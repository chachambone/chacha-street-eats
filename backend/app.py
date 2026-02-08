from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chacha.db'  # flat file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'chacha-secret-2026')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600 * 24
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # your gmail
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # app password
mail = Mail(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# ... other imports ...

from views.auth import auth_bp
from views.menu import menu_bp         # ← changed here
from views.orders import orders_bp
from views.user import user_bp

# ... config and extensions ...

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(menu_bp, url_prefix='/api')     # ← changed here
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(user_bp, url_prefix='/api/user')

@app.route('/')
def home():
    return jsonify({"message": "Chacha Street Eats Backend Live! 🔥🇰🇪"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)