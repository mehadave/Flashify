from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    CORS(app)          # allow frontend calls
    db.init_app(app)   # database hookup


    @app.route("/health")
    def health():
        return {"status": "ok"}


    from .routes import api
    app.register_blueprint(api)

    return app
