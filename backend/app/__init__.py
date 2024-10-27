from flask import Flask
from backend.app.routes import main
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    CORS(app)
    # Register Blueprints or Routes
    app.register_blueprint(main)

    return app