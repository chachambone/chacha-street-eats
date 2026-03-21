from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from dotenv import load_dotenv
import os

from models import db, TokenBlocklist

# ======================
# App Setup
# ======================
load_dotenv()

app = Flask(__name__)

# ======================
# Config
# ======================
app.config["SQLALCHEMY_DATABASE_URI"]        = "sqlite:///chacha.db"
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

# ✅ FIX: ONE JWTManager for the entire app — auth.py no longer creates its own.
# The blocklist loaders are registered HERE so they actually fire on revoked tokens.
jwt     = JWTManager(app)
bcrypt  = Bcrypt(app)
mail    = Mail(app)

# ======================
# JWT Token Blocklist (powers logout / token revocation)
# ✅ FIX: These were previously registered on an orphaned JWTManager in auth.py
# and were silently doing nothing. Now they're on the real instance.
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

app.register_blueprint(auth_bp,   url_prefix="/api/auth")
app.register_blueprint(menu_bp,   url_prefix="/api")
app.register_blueprint(orders_bp, url_prefix="/api/orders")
app.register_blueprint(user_bp,   url_prefix="/api/user")

# ======================
# Health Check
# ======================
@app.route("/")
def home():
    return jsonify({"message": "Chacha Street Eats Backend Live! 🔥🇰🇪"})

# ======================
# Run Server
# ======================
if __name__ == "__main__":
    app.run(debug=True, port=5000)