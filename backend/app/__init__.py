from flask import Flask

def create_app():
    app = Flask(
        __name__,
        static_folder="backend/static/dist",
        static_url_path="",
    )

    print(f"Static folder is set to: {app.static_folder}")

    # Import and register routes
    with app.app_context():
        from .routes import bp
        app.register_blueprint(bp)

    return app