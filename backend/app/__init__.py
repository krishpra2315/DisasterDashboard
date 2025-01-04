from flask import Flask
import os

def create_app():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

    print(f"project root: {project_root}")
    # Set the correct path to the dist folder
    static_folder_path = os.path.join(project_root, 'backend', 'app', 'static', 'dist')

    app = Flask(
        __name__,
        static_folder=static_folder_path,
        static_url_path="",
    )

    print(f"Static folder is set to: {app.static_folder}")

    # Import and register routes
    with app.app_context():
        from .routes import bp
        app.register_blueprint(bp)

    return app