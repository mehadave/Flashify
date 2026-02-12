from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    # Initialize extensions FIRST
    db.init_app(app)
    jwt.init_app(app)
    
    # Apply CORS BEFORE registering blueprints
    CORS(app)

    # Ensure models are imported before create_all
    from . import models  # noqa: F401

    # Create DB tables
    with app.app_context():
        db.create_all()

    # Register API routes (Blueprint)
    from .routes.auth_routes import api
    from .routes.location_routes import location_bp
    from .routes.address_routes import address_bp

    app.register_blueprint(api)
    app.register_blueprint(location_bp)
    app.register_blueprint(address_bp)

    #Debug: Print registered routes
    print("\n=== REGISTERED ROUTES ===")
    for r in app.url_map.iter_rules():
        print(r)
    print("========================\n")


    return app