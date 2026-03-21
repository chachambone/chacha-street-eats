from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, OrderItem, MenuItem

orders_bp = Blueprint('orders', __name__)


# ======================
# Place Order  POST /api/orders/
# ======================
@orders_bp.route('/', methods=['POST'])
@jwt_required()
def place_order():
    try:
        # ✅ FIX: get_jwt_identity() now returns a plain string (the user's id).
        # Convert to int before using as a DB foreign key.
        # Previously it returned a dict like {"id": 1, "role": "customer"}
        # which made user_id = identity.get('id') seem to work but caused
        # SQLAlchemy to reject it on some Flask-JWT-Extended versions → 422.
        user_id = int(get_jwt_identity())

        data          = request.get_json()
        items         = data.get('items', [])
        total_price   = data.get('total_price', 0)
        shipping_info = data.get('shipping_info', {})

        if not items:
            return jsonify({'error': 'No items in order'}), 400

        if not total_price:
            return jsonify({'error': 'Total price is required'}), 400

        # Create the order record
        order = Order(
            user_id       = user_id,
            total_price   = total_price,
            shipping_info = shipping_info,
            status        = 'pending',
        )
        db.session.add(order)
        db.session.flush()  # get order.id without committing yet

        # Add each item to order_items
        for item in items:
            order_item = OrderItem(
                order_id       = order.id,
                menu_item_id   = item['menu_item_id'],
                quantity       = item['quantity'],
                price_at_order = item['price'],
            )
            db.session.add(order_item)

        db.session.commit()

        return jsonify({
            'id':      order.id,
            'status':  order.status,
            'message': 'Order placed successfully! 🔥'
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f'Order error: {e}')
        return jsonify({'error': 'Failed to place order'}), 500


# ======================
# Get My Orders  GET /api/orders/
# ======================
@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_my_orders():
    # ✅ FIX: convert string identity to int
    user_id = int(get_jwt_identity())
    orders  = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders]), 200