from app import app, db
from models import Category, MenuItem

# First, seed categories
categories = [
    {"name": "Snacks", "display_order": 1},
    {"name": "Street Favorites", "display_order": 2},
    {"name": "Mains", "display_order": 3},
]

# Menu items with category names (we'll map them)
menu_data = [
    {"name": "Nyama Choma (Goat)", "description": "Charcoal-grilled goat perfection with ugali & sukuma wiki", "price": 1000, "category": "Mains", "spice_level": 1, "is_vegetarian": False, "image_url": "https://i0.wp.com/kaluhiskitchen.com/wp-content/uploads/2015/09/DSC_0096.jpg"},
    {"name": "Beef Samosas", "description": "Crispy triangles packed with spiced minced beef & herbs", "price": 100, "category": "Snacks", "spice_level": 2, "is_vegetarian": False, "image_url": "https://www.jayne-rain.com/wp-content/uploads/2020/04/Kenyan-Beef-Samosa-Square.jpg"},
    {"name": "Smokie Pasua", "description": "Grilled smokie stuffed with kachumbari – street royalty", "price": 150, "category": "Street Favorites", "spice_level": 2, "is_vegetarian": False, "image_url": "https://i.pinimg.com/originals/5e/2b/4d/5e2b4d8b8f8f8f8f8f8f8f8f8f8f8f8f.jpg"},
    # ... add the rest like before
    # (I'll skip repeating all 10 for brevity – use the same as before)
]

with app.app_context():
    db.drop_all()
    db.create_all()

    # Seed categories
    cat_map = {}
    for cat in categories:
        c = Category(**cat)
        db.session.add(c)
        db.session.commit()
        cat_map[cat["name"]] = c.id

    # Seed menu items
    for data in menu_data:
        item = MenuItem(
            name=data["name"],
            description=data["description"],
            price=data["price"],
            category_id=cat_map[data["category"]],
            spice_level=data["spice_level"],
            is_vegetarian=data["is_vegetarian"],
            image_url=data["image_url"]
        )
        db.session.add(item)
    
    db.session.commit()
    print("Chacha Street Eats fully seeded – categories + menu! 🔥🇰🇪")