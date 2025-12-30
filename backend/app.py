from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:pass@localhost/chacha_db'  # Update with your DB URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)  # Allow frontend access

@app.route('/')
def hello():
    return "Chacha Street Eats Backend Live! 🔥"

if __name__ == '__main__':
    app.run(debug=True)