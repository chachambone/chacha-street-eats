from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, OrderItem, MenuItem

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def place_order():
    try:
        identity = get_jwt_identity()
        user_id  = identity.get('id')
        data     = request.get_json()

        items         = data.get('items', [])
        total_price   = data.get('total_price', 0)
        shipping_info = data.get('shipping_info', {})

        if not items:
            return jsonify({'error': 'No items in order'}), 400

        # Create order
        order = Order(
            user_id       = user_id,
            total_price   = total_price,
            shipping_info = shipping_info,
            status        = 'pending',
        )
        db.session.add(order)
        db.session.flush()

        # Add order items
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

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_my_orders():
    identity = get_jwt_identity()
    user_id  = identity.get('id')
    orders   = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders]), 200