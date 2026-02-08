from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/chacha.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define minimal classes just for seeding (to avoid import issues)
class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    label = db.Column(db.String(50), nullable=False)
    icon = db.Column(db.String(20))

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(255))
    description = db.Column(db.Text)
    in_stock = db.Column(db.Boolean, default=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))

with app.app_context():
    db.drop_all()  # Optional: reset for clean seed
    db.create_all()

    # Seed categories
    categories_data = [
        {"name": "snacks", "label": "Snacks & Starters", "icon": "🥟"},
        {"name": "street_favorites", "label": "Street Favorites", "icon": "🌭"},
        {"name": "mains", "label": "Mains", "icon": "🍖"},
    ]

    cat_map = {}
    for data in categories_data:
        cat = Category(**data)
        db.session.add(cat)
        db.session.flush()  # Get ID
        cat_map[data["name"]] = cat.id

    # Seed products (your Kenyan menu)
    products_data = [
        {"name": "Nyama Choma (Goat)", "price": 1000, "image": "https://i0.wp.com/kaluhiskitchen.com/wp-content/uploads/2015/09/DSC_0096.jpg", "description": "Slow-grilled goat with ugali & sukuma wiki", "in_stock": True, "category_id": cat_map["mains"]},
        {"name": "Beef Samosas", "price": 100, "image": "https://www.jayne-rain.com/wp-content/uploads/2020/04/Kenyan-Beef-Samosa-Square.jpg", "description": "Crispy spiced beef triangles", "in_stock": True, "category_id": cat_map["snacks"]},
        {"name": "Smokie Pasua", "price": 150, "image": "https://nairobikitchen.com/wp-content/uploads/2018/10/IMG_20181005_192242.jpg", "description": "Smokie stuffed with kachumbari", "in_stock": True, "category_id": cat_map["street_favorites"]},
        {"name": "Bhajia", "price": 150, "image": "https://www.chefspencil.com/wp-content/uploads/Kenyan-Bhajia-1.jpg", "description": "Crispy potato fritters", "in_stock": True, "category_id": cat_map["snacks"]},
        {"name": "Mandazi", "price": 50, "image": "https://www.africanbites.com/wp-content/uploads/2019/03/IMG_0399.jpg", "description": "Fluffy coconut dough triangles", "in_stock": True, "category_id": cat_map["snacks"]},
        # Add more if you want
    ]

    for data in menu_data:
        item = MenuItem(**data)
        db.session.add(item)

    db.session.commit()
    print("Chacha Street Eats fully seeded – categories + products! 🔥🇰🇪")