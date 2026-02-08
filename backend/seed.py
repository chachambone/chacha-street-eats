# seed.py - Uses the REAL db from app.py (no new SQLAlchemy instance!)

from app import app, db                        # ← this is the key line
from models import Category, MenuItem          # your real models

with app.app_context():
    # Optional: reset DB for clean seed (uncomment if you want fresh start)
    # db.drop_all()
    db.create_all()  # Creates tables if they don't exist

    # Seed categories (skip duplicates)
    categories_data = [
        {"name": "snacks", "label": "Snacks & Starters", "icon": "🥟"},
        {"name": "street_favorites", "label": "Street Favorites", "icon": "🌭"},
        {"name": "mains", "label": "Mains", "icon": "🍖"},
    ]

    cat_map = {}
    for data in categories_data:
        existing = Category.query.filter_by(name=data["name"]).first()
        if existing:
            cat_map[data["name"]] = existing.id
            continue
        cat = Category(**data)
        db.session.add(cat)
        db.session.flush()
        cat_map[data["name"]] = cat.id

    # Seed menu items - Kaluhi’s Kitchen images (tested & loading)
    menu_data = [
        {
            "name": "Nyama Choma (Goat)",
            "price": 1000,
            "image_url": "https://i0.wp.com/kaluhiskitchen.com/wp-content/uploads/2015/09/DSC_0096.jpg",
            "description": "Slow-grilled goat with ugali & sukuma wiki",
            "in_stock": True,
            "spice_level": 1,
            "is_vegetarian": False,
            "category_id": cat_map["mains"]
        },
        {
            "name": "Beef Samosas",
            "price": 100,
            "image_url": "https://www.jayne-rain.com/wp-content/uploads/2020/04/Kenyan-Beef-Samosa-Square.jpg",
            "description": "Crispy spiced beef triangles",
            "in_stock": True,
            "spice_level": 2,
            "is_vegetarian": False,
            "category_id": cat_map["snacks"]
        },
        {
            "name": "Smokie Pasua",
            "price": 150,
            "image_url": "https://nairobikitchen.com/wp-content/uploads/2018/10/IMG_20181005_192242.jpg",
            "description": "Smokie stuffed with kachumbari – street royalty",
            "in_stock": True,
            "spice_level": 2,
            "is_vegetarian": False,
            "category_id": cat_map["street_favorites"]
        },
        {
            "name": "Bhajia",
            "price": 150,
            "image_url": "https://www.chefspencil.com/wp-content/uploads/Kenyan-Bhajia-1.jpg",
            "description": "Crispy potato fritters, coastal style with chili dip",
            "in_stock": True,
            "spice_level": 2,
            "is_vegetarian": True,
            "category_id": cat_map["snacks"]
        },
        {
            "name": "Mandazi",
            "price": 50,
            "image_url": "https://www.africanbites.com/wp-content/uploads/2019/03/IMG_0399.jpg",
            "description": "Fluffy coconut-cardamom dough triangles",
            "in_stock": True,
            "spice_level": 0,
            "is_vegetarian": True,
            "category_id": cat_map["snacks"]
        },
        {
            "name": "Chips Mayai",
            "price": 250,
            "image_url": "https://nairobikitchen.com/wp-content/uploads/2019/02/IMG_20190222_185622.jpg",
            "description": "Fries cooked into a fluffy omelette – pure comfort",
            "in_stock": True,
            "spice_level": 1,
            "is_vegetarian": True,
            "category_id": cat_map["street_favorites"]
        },
    ]

    for data in menu_data:
        existing = MenuItem.query.filter_by(name=data["name"]).first()
        if existing:
            continue
        item = MenuItem(**data)
        db.session.add(item)

    db.session.commit()
    print("Chacha Street Eats fully seeded – categories + menu with Kaluhi’s Kitchen photos! 🔥🇰🇪")