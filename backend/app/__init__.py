from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    # Allow frontend calls
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Ensure models are imported before create_all
    from . import models  # noqa: F401

    # Create DB tables
    with app.app_context():
        db.create_all()

    # Register API routes (Blueprint)
    from .routes import api
    app.register_blueprint(api)

    return app