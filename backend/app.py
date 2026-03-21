from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from dotenv import load_dotenv
import os

from models import db, TokenBlocklist, User


# ======================
# App Setup
# ======================
load_dotenv()

app = Flask(__name__)

# ======================
# Config
# ======================
app.config["SQLALCHEMY_DATABASE_URI"]        = os.getenv("DATABASE_URL", "sqlite:///chacha.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["JWT_SECRET_KEY"]           = os.getenv("JWT_SECRET_KEY", "chacha-secret-2026")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 60 * 60 * 24  # 24 hours

# Mail config
app.config["MAIL_SERVER"]         = "smtp.gmail.com"
app.config["MAIL_PORT"]           = 587
app.config["MAIL_USE_TLS"]        = True
app.config["MAIL_USERNAME"]       = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"]       = os.getenv("MAIL_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER")

# ======================
# Initialize Extensions
# ======================
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

jwt    = JWTManager(app)
bcrypt = Bcrypt(app)
mail   = Mail(app)

# ======================
# JWT Token Blocklist
# ======================
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti   = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

@jwt.revoked_token_loader
def revoked_token_response(jwt_header, jwt_payload):
    return jsonify({"error": "Token has been revoked, please login again."}), 401

# ======================
# Blueprints
# ======================
from views.auth   import auth_bp
from views.menu   import menu_bp
from views.orders import orders_bp
from views.user   import user_bp
from views.admin  import admin_bp

app.register_blueprint(auth_bp,   url_prefix="/api/auth")
app.register_blueprint(menu_bp,   url_prefix="/api")
app.register_blueprint(orders_bp, url_prefix="/api/orders")
app.register_blueprint(user_bp,   url_prefix="/api/user")
app.register_blueprint(admin_bp,  url_prefix="/api/admin")

# ======================
# Health Check
# ======================
@app.route("/")
def home():
    return jsonify({"message": "Chacha Street Eats Backend Live! 🔥🇰🇪"})

# ======================
# Admin Setup Route (protected by secret key)
# Usage: /setup-admin/your-secret-key
# ======================
@app.route("/setup-admin/<secret>")
def setup_admin(secret):
    if secret != os.getenv("ADMIN_SECRET", "chacha-admin-2026"):
        return jsonify({"error": "Unauthorized"}), 403
    u = User.query.filter_by(email="mbonemarycharity@gmail.com").first()
    if u:
        u.role = "admin"
        db.session.commit()
        return "Admin role set! 🔥"
    return "User not found", 404

# ======================
# Run Server
# ======================
if __name__ == "__main__":
    app.run(debug=True, port=5000)