from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_bcrypt import Bcrypt
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite+pysqlite:///chacha.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fallback-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 86400)))

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)  # Allow frontend access
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# We'll import models inside routes to avoid circular imports
MenuItem = None
Category = None
User = None

def import_models():
    global MenuItem, Category, User
    from models import User, MenuItem, Category

# === AUTH ROUTES ===
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    phone = data.get('phone')

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 409

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    new_user = User(
        email=email,
        password_hash=password_hash,
        name=name,
        phone=phone,
        is_admin=False  # First user? Change to True manually if needed
    )
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity={
            "id": user.id,
            "email": user.email,
            "is_admin": user.is_admin
        })
        return jsonify({
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "is_admin": user.is_admin
            }
        }), 200

    return jsonify({"message": "Invalid email or password"}), 401


# === PROTECTED EXAMPLE ROUTE ===
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify({"user": current_user}), 200


# === MENU ROUTES (Public) ===
@app.route('/api/menu', methods=['GET'])
def get_menu():
    import_models()  # Safe import here
    items = MenuItem.query.join(Category).order_by(Category.display_order, MenuItem.id).all()
    return jsonify([item.to_dict() for item in items])


@app.route('/api/categories', methods=['GET'])
def get_categories():
    import_models()
    categories = Category.query.order_by(Category.display_order).all()
    return jsonify([cat.to_dict() for cat in categories])


# Home
@app.route('/')
def home():
    return jsonify({"message": "Karibu Chacha Street Eats! 🇰🇪 Backend + Auth Ready!"})

if __name__ == '__main__':
    app.run(debug=True)