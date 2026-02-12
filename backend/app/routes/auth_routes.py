from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User
from .. import db

api = Blueprint("api", __name__)

@api.post("/api/auth/signup")
def signup():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify(message="Email and password are required."), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify(message="User already exists."), 409

    user = User(email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify(message="Signup successful."), 201


@api.post("/api/auth/login")
def login():
    print()
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    print(f"[LOGIN] Request data: email={email}, password={'*' * len(password)}")  # ✅ ADD

    if not email or not password:
        return jsonify(message="Email and password are required."), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify(message="Invalid email or password."), 401

    # JWT identity can be email for now
    token = create_access_token(identity=email)

    return jsonify(token=token), 200


@api.get("/api/me")
@jwt_required()
def me():
    email = get_jwt_identity()
    return jsonify(email=email), 200
