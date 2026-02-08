from flask import Blueprint, jsonify
from flask import current_app

# Let's name it menu_bp for clarity (you can keep products_bp if you prefer)
menu_bp = Blueprint('menu', __name__, url_prefix='/api')

@menu_bp.route('/menu', methods=['GET'])
def get_menu():
    db = current_app.extensions['sqlalchemy'].db
    from models import Product, Category  # ← Changed MenuItem to Product

    # Join using the relationship (cleaner)
    # Order by Category.label (human-readable), then Product.name
    items = (
        db.session.query(Product)
        .join(Category)                    # uses Product.category relationship
        .order_by(Category.label.asc(), Product.name.asc())
        .all()
    )

    return jsonify([item.to_dict() for item in items])


@menu_bp.route('/categories', methods=['GET'])
def get_categories():
    db = current_app.extensions['sqlalchemy'].db
    from models import Category

    # Order by label (display name) — safe since you have 'label' field
    categories = (
        db.session.query(Category)
        .order_by(Category.label.asc())
        .all()
    )

    return jsonify([cat.to_dict() for cat in categories])