from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_bcrypt import Bcrypt
from datetime import timedelta
import os
from dotenv import load_dotenv

from models import db, User, Category, Product

load_dotenv()

migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///chacha.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
        seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 86400))
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    # ======================
    # ROUTES
    # ======================

    @app.route("/")
    def home():
        return jsonify({
            "message": "Karibu Chacha Street Eats! 🇰🇪 Backend + Auth Ready! 🔥"
        })

    # -------- AUTH --------
    @app.route("/api/auth/register", methods=["POST"])
    def register():
        data = request.get_json()

        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        if not email or not password or not username:
            return jsonify({"message": "Missing required fields"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already registered"}), 409

        password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

        user = User(
            email=email,
            username=username,
            password_hash=password_hash
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

    @app.route("/api/auth/login", methods=["POST"])
    def login():
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password_hash, password):
            token = create_access_token(identity=user.id)
            return jsonify({
                "access_token": token,
                "user": user.to_dict()
            }), 200

        return jsonify({"message": "Invalid credentials"}), 401

    # -------- MENU --------
    @app.route("/api/categories", methods=["GET"])
    def get_categories():
        categories = Category.query.all()
        return jsonify([c.to_dict() for c in categories])

    @app.route("/api/products", methods=["GET"])
    def get_products():
        products = Product.query.all()
        return jsonify([p.to_dict() for p in products])

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
