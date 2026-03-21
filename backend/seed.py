# seed.py

from app import app, db
from models import Category, MenuItem

with app.app_context():
    db.create_all()

    # ==========================
    # Seed Categories
    # ==========================
    categories_data = [
        {"name": "snacks",           "label": "Snacks & Starters", "icon": "🥟"},
        {"name": "street_favorites", "label": "Street Favorites",  "icon": "🌭"},
        {"name": "mains",            "label": "Mains",             "icon": "🍖"},
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

    # ==========================
    # Seed Menu Items
    # Images from Unsplash (free, stable, no hotlinking restrictions) ✅
    # ==========================
    menu_data = [
        {
            "name":          "Nyama Choma (Goat)",
            "price":         1000,
            "image_url":     "https://images.unsplash.com/photo-1544025162-d76694265947?w=640&q=80",
            "description":   "Slow-grilled goat with ugali & sukuma wiki",
            "in_stock":      True,
            "spice_level":   1,
            "is_vegetarian": False,
            "category_id":   cat_map["mains"],
        },
        {
            "name":          "Beef Samosas",
            "price":         100,
            "image_url":     "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=640&q=80",
            "description":   "Crispy spiced beef triangles",
            "in_stock":      True,
            "spice_level":   2,
            "is_vegetarian": False,
            "category_id":   cat_map["snacks"],
        },
        {
            "name":          "Smokie Pasua",
            "price":         150,
            "image_url":     "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=640&q=80",
            "description":   "Smokie stuffed with kachumbari – street royalty",
            "in_stock":      True,
            "spice_level":   2,
            "is_vegetarian": False,
            "category_id":   cat_map["street_favorites"],
        },
        {
            "name":          "Bhajia",
            "price":         150,
            "image_url":     "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=640&q=80",
            "description":   "Crispy potato fritters, coastal style with chili dip",
            "in_stock":      True,
            "spice_level":   2,
            "is_vegetarian": True,
            "category_id":   cat_map["snacks"],
        },
        {
            "name":          "Mandazi",
            "price":         50,
            "image_url":     "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640&q=80",
            "description":   "Fluffy coconut-cardamom dough triangles",
            "in_stock":      True,
            "spice_level":   0,
            "is_vegetarian": True,
            "category_id":   cat_map["snacks"],
        },
        {
            "name":          "Chips Mayai",
            "price":         250,
            "image_url":     "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=640&q=80",
            "description":   "Fries cooked into a fluffy omelette – pure comfort",
            "in_stock":      True,
            "spice_level":   1,
            "is_vegetarian": True,
            "category_id":   cat_map["street_favorites"],
        },
    ]

    for data in menu_data:
        existing = MenuItem.query.filter_by(name=data["name"]).first()
        if existing:
            # Always update image URL to fix any old broken ones in the DB
            existing.image_url = data["image_url"]
            continue
        item = MenuItem(**data)
        db.session.add(item)

    db.session.commit()
    print("Chacha Street Eats seeded with fresh working images! 🔥🇰🇪")