from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import MetaData, JSON

# ======================
# Database setup
# ======================
metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

# ======================
# Constants
# ======================
ROLE_CHOICES = ("admin", "order_manager", "customer")
ORDER_STATUS_CHOICES = ("pending", "processing", "out_for_delivery", "delivered", "cancelled")

# ======================
# User Model
# ======================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)  # Increased length for safety
    role = db.Column(db.String(20), default="customer")
    blocked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    cart_items = db.relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    orders = db.relationship("Order", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "blocked": self.blocked,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

# ======================
# Category Model
# ======================
class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)   # internal key
    label = db.Column(db.String(50), nullable=False)               # display name
    icon = db.Column(db.String(20))                                # emoji/icon

    # Relationships
    menu_items = db.relationship("MenuItem", back_populates="category", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "label": self.label,
            "icon": self.icon,
        }

# ======================
# MenuItem Model (was Product)
# ======================
class MenuItem(db.Model):
    __tablename__ = "menu_items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)  # KES
    image_url = db.Column(db.String(255))
    description = db.Column(db.Text)
    in_stock = db.Column(db.Boolean, default=True)
    rating = db.Column(db.Float, default=0.0)
    reviews_count = db.Column(db.Integer, default=0)
    spice_level = db.Column(db.Integer, default=0)  # 0-5
    is_vegetarian = db.Column(db.Boolean, default=False)

    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)

    # Relationships
    category = db.relationship("Category", back_populates="menu_items")
    cart_items = db.relationship("CartItem", back_populates="menu_item", cascade="all, delete-orphan")
    order_items = db.relationship("OrderItem", back_populates="menu_item", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category.name if self.category else None,
            "price": self.price,
            "image_url": self.image_url,
            "description": self.description,
            "in_stock": self.in_stock,
            "rating": self.rating,
            "reviews_count": self.reviews_count,
            "spice_level": self.spice_level,
            "is_vegetarian": self.is_vegetarian,
        }

# ======================
# CartItem Model
# ======================
class CartItem(db.Model):
    __tablename__ = "cart_items"

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey("menu_items.id"), nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="cart_items")
    menu_item = db.relationship("MenuItem", back_populates="cart_items")

    def to_dict(self):
        return {
            "id": self.id,
            "quantity": self.quantity,
            "menu_item": self.menu_item.to_dict() if self.menu_item else None,
        }

# ======================
# Order Model
# ======================
class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default="pending")
    shipping_info = db.Column(JSON, nullable=True)
    total_price = db.Column(db.Float, nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="orders")
    order_items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    invoice = db.relationship("Invoice", back_populates="order", uselist=False)

    def to_dict(self):
        shipping_info = self.shipping_info or {}
        return {
            "id": self.id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "status": self.status,
            "total_price": float(self.total_price),
            "shipping_info": shipping_info,
            "items": [item.to_dict() for item in self.order_items],
        }

# ======================
# OrderItem Model
# ======================
class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    price_at_order = db.Column(db.Float, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey("menu_items.id"), nullable=False)

    # Relationships
    order = db.relationship("Order", back_populates="order_items")
    menu_item = db.relationship("MenuItem", back_populates="order_items")

    def to_dict(self):
        return {
            "id": self.id,
            "quantity": self.quantity,
            "price_at_order": float(self.price_at_order),
            "menu_item": self.menu_item.to_dict() if self.menu_item else None,
        }

# ======================
# Invoice Model
# ======================
class Invoice(db.Model):
    __tablename__ = "invoices"

    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(100), unique=True, nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    pdf_url = db.Column(db.String(255))
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), unique=True)

    # Relationships
    order = db.relationship("Order", back_populates="invoice")

    def to_dict(self):
        return {
            "id": self.id,
            "invoice_number": self.invoice_number,
            "issued_at": self.issued_at.isoformat() if self.issued_at else None,
            "pdf_url": self.pdf_url,
            "order_id": self.order_id,
        }

# ======================
# Token Blocklist (JWT Logout / Security)
# ======================
class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False)