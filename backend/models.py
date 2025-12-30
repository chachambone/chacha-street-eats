from app import db
from datetime import datetime
# from flask_login import UserMixin  # We'll use Flask-Login later for auth

# Optional: Separate table for categories (makes admin easier & avoids typos)
class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)  # e.g., "Snacks", "Mains"
    display_order = db.Column(db.Integer, default=0)  # For sorting on frontend

    # Relationship to menu items
    items = db.relationship('MenuItem', backref='category_ref', lazy=True)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "display_order": self.display_order}


class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)  # in KSh
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    spice_level = db.Column(db.Integer, default=0)  # 0-3
    is_vegetarian = db.Column(db.Boolean, default=False)
    is_available = db.Column(db.Boolean, default=True)  # For out-of-stock
    image_url = db.Column(db.String(500))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description or "",
            "price": self.price,
            "category": self.category_ref.name if self.category_ref else "",
            "spice_level": self.spice_level,
            "is_vegetarian": self.is_vegetarian,
            "is_available": self.is_available,
            "image_url": self.image_url or ""
        }


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(20))  # Optional but useful for delivery
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100))
    address = db.Column(db.Text)  # Default delivery address
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    orders = db.relationship('Order', backref='user', lazy=True)


class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    
    # Relationships
    menu_item = db.relationship('MenuItem')

    def to_dict(self):
        return {
            "id": self.id,
            "menu_item": self.menu_item.to_dict(),
            "quantity": self.quantity
        }


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, preparing, out_for_delivery, delivered, cancelled
    delivery_address = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    notes = db.Column(db.Text)  # Special instructions
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to order items
    items = db.relationship('OrderItem', backref='order', lazy=True)


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_at_time = db.Column(db.Float, nullable=False)  # Snapshot of price when ordered

    menu_item = db.relationship('MenuItem')