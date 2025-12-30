from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite+pysqlite:///chacha.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)  # Allow frontend access

@app.route('/api/test-db')
def test_db():
    count = MenuItem.query.count()
    return jsonify({"menu_items_count": count, "message": "DB connected & seeded! 🇰🇪"})

@app.route('/')
def hello():
    return "Chacha Street Eats Backend Live! 🔥"

if __name__ == '__main__':
    app.run(debug=True)