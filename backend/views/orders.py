# backend/views/orders.py
from flask import Blueprint, jsonify

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
def get_orders():
    return jsonify({"message": "Orders endpoint – coming soon! 🛒"})