from app import db  # Assuming app.py imports this

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)  # in KSh
    category = db.Column(db.String(50), nullable=False)
    spice_level = db.Column(db.Integer, default=0)  # 0=none, 1=mild, 2=medium, 3=hot 🌶️
    is_vegetarian = db.Column(db.Boolean, default=False)
    image_url = db.Column(db.String(500))  # We'll store direct image URLs for now

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "spice_level": self.spice_level,
            "is_vegetarian": self.is_vegetarian,
            "image_url": self.image_url
        }

# Add more: User, Order, etc. later