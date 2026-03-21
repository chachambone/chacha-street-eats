# 🔥 Chacha Street Eats

> Authentic Kenyan street food delivered to your door — built with React + Flask

**Live Demo:** [https://chacha-street-eats.vercel.app](https://chacha-street-eats.vercel.app)

---

## 📸 About

Chacha Street Eats is a full-stack food ordering web app for a Kenyan street food business based in Mwihoko, Kahawa Sukari, Nairobi. Customers can browse the menu, add items to cart, and place orders with M-Pesa, cash, or card payment options.

---

## ✨ Features

- 🔐 User authentication (register, login, logout) with JWT
- 🍽️ Menu page with real food images and category filtering
- 🛒 Shopping cart with quantity controls
- 📦 Multi-step checkout (Delivery → Payment → Confirm)
- 📱 M-Pesa, Cash on Delivery, and Card payment options
- 🏠 Home page with Best Sellers section
- 📍 Delivery to Mwihoko, Kahawa Sukari area
- 👨‍💼 Admin panel for managing users and orders
- 📧 Welcome email on registration
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for cart and auth state

### Backend
- **Flask** (Python)
- **Flask-JWT-Extended** for authentication
- **Flask-SQLAlchemy** + **Flask-Migrate** for database
- **Flask-Mail** for email notifications
- **Flask-CORS** for cross-origin requests
- **Flask-Bcrypt** for password hashing
- **SQLite** (development) / **PostgreSQL** (production)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

---

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/chachambone/chacha-street-eats.git
cd chacha-street-eats/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run migrations
flask db upgrade

# Seed the database
python seed.py

# Start the server
python app.py
```

Backend runs at: `http://localhost:5000`

---

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` folder:

```env
JWT_SECRET_KEY=your-secret-key-here
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_DEFAULT_SENDER=your-gmail@gmail.com
DATABASE_URL=sqlite:///chacha.db
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| DELETE | `/api/auth/logout` | Logout (revokes token) |

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items |
| GET | `/api/categories` | Get all categories |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/` | Place an order |
| GET | `/api/orders/` | Get current user's orders |

### User (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/users` | Get all users (admin only) |
| PATCH | `/api/user/<id>/block` | Block/unblock user (admin only) |
| DELETE | `/api/user/<id>` | Delete user (admin only) |
| POST | `/api/user/create-manager` | Create manager account (admin only) |
| DELETE | `/api/user/delete` | Delete own account |
| PATCH | `/api/user/change-password` | Change own password |

---

## 🌍 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |

### Deploy Frontend (Vercel)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Deploy Backend (Render)
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app`

---

## 📁 Project Structure

```
chacha-street-eats/
├── backend/
│   ├── app.py              # Flask app entry point
│   ├── models.py           # Database models
│   ├── seed.py             # Database seeder
│   ├── requirements.txt
│   ├── Pipfile
│   └── views/
│       ├── auth.py         # Authentication routes
│       ├── menu.py         # Menu routes
│       ├── orders.py       # Order routes
│       ├── user.py         # User management routes
│       └── mailserver.py   # Email helpers
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js           # Axios instance
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Menu.jsx
    │       ├── Cart.jsx
    │       ├── Checkout.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── AboutUs.jsx
    │       └── Contact.jsx
    ├── package.json
    └── vite.config.js
```

---

## 👩‍💻 Author

Built with ❤️ by **Mary Charity** — Nairobi, Kenya 🇰🇪

---

## 📄 License

This project is licensed under the MIT License.