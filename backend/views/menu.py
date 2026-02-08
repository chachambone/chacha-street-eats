from flask import Blueprint, jsonify
from flask import current_app

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('/menu', methods=['GET'])
def get_menu():
    db = current_app.extensions['sqlalchemy'].db
    from models import MenuItem, Category
    items = db.session.query(MenuItem).join(Category).order_by(Category.display_order, MenuItem.id).all()
    return jsonify([item.to_dict() for item in items])

@menu_bp.route('/categories', methods=['GET'])
def get_categories():
    db = current_app.extensions['sqlalchemy'].db
    from models import Category
    categories = db.session.query(Category).order_by(Category.display_order).all()
    return jsonify([cat.to_dict() for cat in categories])