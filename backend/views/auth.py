from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
    verify_jwt_in_request,
)
from datetime import datetime, timezone
from functools import wraps
from models import db, User, TokenBlocklist
from views.mailserver import send_email

auth_bp = Blueprint('auth', __name__)

# ======================
# ✅ FIX: Removed the duplicate JWTManager that was here before.
# JWTManager lives in app.py only. The blocklist loaders are
# also registered there. Do NOT add them back here.
# ======================


# ======================
# Role-based access decorator
# Usage: @roles_required('admin') or @roles_required('admin', 'order_manager')
# ======================
def roles_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims    = get_jwt()
            # ✅ FIX: role now lives in JWT claims (additional_claims), not identity
            user_role = claims.get('role')
            if user_role not in roles:
                return jsonify({"error": "You are not authorized to access this resource"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper


# ======================
# Register
# ======================
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    username = data.get('username') or data.get('name')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 409

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(
        username      = username,
        email         = data['email'],
        role          = data.get('role', 'customer'),
        password_hash = generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()

    send_email(user.username, user.email)

    # ✅ FIX: identity is a plain string (str of user id).
    # Extra data like role goes in additional_claims.
    # This is what was causing the 422 errors on /api/orders/
    access_token = create_access_token(
        identity          = str(user.id),
        additional_claims = {"role": user.role}
    )

    user_info = {
        "id":         user.id,
        "username":   user.username,
        "email":      user.email,
        "role":       user.role,
        # ✅ FIX: datetime must be serialized to string or Flask's JSON encoder crashes
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }

    return jsonify({"user": user_info, "access_token": access_token}), 201


# ======================
# Login
# ======================
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data     = request.get_json()
        email    = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email or password is missing"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        if user.blocked:
            return jsonify({"error": "Account is suspended"}), 403

        if not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Invalid password"}), 401

        # ✅ FIX: same pattern as register — plain string identity + claims for role
        access_token = create_access_token(
            identity          = str(user.id),
            additional_claims = {"role": user.role}
        )

        user_info = {
            "id":         user.id,
            "username":   user.username,
            "email":      user.email,
            "role":       user.role,
            # ✅ FIX: serialize datetime
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }

        return jsonify({"access_token": access_token, "user": user_info}), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Internal server error"}), 500


# ======================
# Logout
# ======================
@auth_bp.route('/logout', methods=['DELETE'])
@jwt_required(verify_type=False)
def logout():
    try:
        jti   = get_jwt()['jti']
        now   = datetime.now(timezone.utc)
        token = TokenBlocklist(jti=jti, created_at=now)
        db.session.add(token)
        db.session.commit()
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        print(f"Logout error: {e}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500