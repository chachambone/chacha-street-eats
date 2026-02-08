from flask import Blueprint, jsonify
from flask_sqlalchemy import SQLAlchemy

products_bp = Blueprint('products', __name__)

# We can't import db here directly (circular), so we'll use current_app
from flask import current_app

@products_bp.route('/menu', methods=['GET'])
def get_menu():
    db = current_app.extensions['sqlalchemy'].db
    from models import MenuItem, Category
    items = db.session.query(MenuItem).join(Category).order_by(Category.display_order, MenuItem.id).all()
    return jsonify([item.to_dict() for item in items])

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    db = current_app.extensions['sqlalchemy'].db
    from models import Category
    categories = db.session.query(Category).order_by(Category.display_order).all()
    return jsonify([cat.to_dict() for cat in categories])