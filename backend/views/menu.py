from flask import Blueprint, jsonify
from models import db, MenuItem, Category

menu_bp = Blueprint('menu', __name__)


# ======================
# GET /api/menu  — fetch all menu items
# ======================
@menu_bp.route('/menu', methods=['GET'])
def get_menu():
    items = MenuItem.query.join(Category).order_by(MenuItem.id).all()
    return jsonify([item.to_dict() for item in items])


# ======================
# GET /api/categories  — fetch all categories
# ======================
@menu_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.order_by(Category.id).all()
    return jsonify([cat.to_dict() for cat in categories])