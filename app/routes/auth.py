from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import User
from app.utils.jwt_middleware import generate_access_token
from app.utils.passwords import hash_password, verify_password

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "name, email, and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(name=name, email=email, password=hash_password(password))
    db.session.add(user)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "User registered successfully",
                "user": user.to_dict(),
            }
        ),
        201,
    )


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_access_token(user.id)
    return jsonify({"access_token": token, "token_type": "Bearer", "user": user.to_dict()})
