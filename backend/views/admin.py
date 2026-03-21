from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from functools import wraps
from models import db, User, Order, MenuItem

admin_bp = Blueprint('admin', __name__)

# ======================
# Admin-only decorator
# ======================
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({"error": "Admin access only"}), 403
        return fn(*args, **kwargs)
    return wrapper


# ======================
# Dashboard Stats  GET /api/admin/stats
# ======================
@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    total_users    = User.query.count()
    total_orders   = Order.query.count()
    total_menu     = MenuItem.query.count()
    pending_orders = Order.query.filter_by(status='pending').count()
    revenue        = db.session.query(db.func.sum(Order.total_price)).scalar() or 0
    recent_orders  = Order.query.order_by(Order.created_at.desc()).limit(5).all()

    return jsonify({
        "total_users":    total_users,
        "total_orders":   total_orders,
        "total_menu":     total_menu,
        "pending_orders": pending_orders,
        "total_revenue":  float(revenue),
        "recent_orders":  [o.to_dict() for o in recent_orders],
    }), 200


# ======================
# All Orders  GET /api/admin/orders
# ======================
@admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_all_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders]), 200


# ======================
# Update Order Status  PATCH /api/admin/orders/<id>/status
# ======================
@admin_bp.route('/orders/<int:id>/status', methods=['PATCH'])
@admin_required
def update_order_status(id):
    order  = Order.query.get_or_404(id)
    data   = request.get_json()
    status = data.get('status')

    VALID = ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled']
    if status not in VALID:
        return jsonify({"error": f"Invalid status. Choose from: {VALID}"}), 400

    order.status = status
    db.session.commit()
    return jsonify({"message": "Order status updated", "order": order.to_dict()}), 200


# ======================
# All Users  GET /api/admin/users
# ======================
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200


# ======================
# Block / Unblock User  PATCH /api/admin/users/<id>/block
# ======================
@admin_bp.route('/users/<int:id>/block', methods=['PATCH'])
@admin_required
def toggle_block(id):
    user         = User.query.get_or_404(id)
    user.blocked = not user.blocked
    db.session.commit()
    status = "blocked" if user.blocked else "unblocked"
    return jsonify({"message": f"User {status}", "user": user.to_dict()}), 200


# ======================
# Delete User  DELETE /api/admin/users/<id>
# ======================
@admin_bp.route('/users/<int:id>', methods=['DELETE'])
@admin_required
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200


# ======================
# All Menu Items  GET /api/admin/menu
# ======================
@admin_bp.route('/menu', methods=['GET'])
@admin_required
def get_menu():
    items = MenuItem.query.order_by(MenuItem.id).all()
    return jsonify([i.to_dict() for i in items]), 200


# ======================
# Add Menu Item  POST /api/admin/menu
# ======================
@admin_bp.route('/menu', methods=['POST'])
@admin_required
def add_menu_item():
    data = request.get_json()

    for field in ['name', 'price', 'category_id']:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    item = MenuItem(
        name          = data['name'],
        price         = data['price'],
        category_id   = data['category_id'],
        description   = data.get('description', ''),
        image_url     = data.get('image_url', ''),
        in_stock      = data.get('in_stock', True),
        spice_level   = data.get('spice_level', 0),
        is_vegetarian = data.get('is_vegetarian', False),
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Menu item added", "item": item.to_dict()}), 201


# ======================
# Update Menu Item  PATCH /api/admin/menu/<id>
# ======================
@admin_bp.route('/menu/<int:id>', methods=['PATCH'])
@admin_required
def update_menu_item(id):
    item = MenuItem.query.get_or_404(id)
    data = request.get_json()

    item.name          = data.get('name',          item.name)
    item.price         = data.get('price',         item.price)
    item.description   = data.get('description',   item.description)
    item.image_url     = data.get('image_url',     item.image_url)
    item.in_stock      = data.get('in_stock',      item.in_stock)
    item.spice_level   = data.get('spice_level',   item.spice_level)
    item.is_vegetarian = data.get('is_vegetarian', item.is_vegetarian)
    item.category_id   = data.get('category_id',   item.category_id)

    db.session.commit()
    return jsonify({"message": "Menu item updated", "item": item.to_dict()}), 200


# ======================
# Delete Menu Item  DELETE /api/admin/menu/<id>
# ======================
@admin_bp.route('/menu/<int:id>', methods=['DELETE'])
@admin_required
def delete_menu_item(id):
    item = MenuItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Menu item deleted"}), 200