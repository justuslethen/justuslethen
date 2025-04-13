from flask import Flask, send_from_directory
from modules.create_event import create_event_bp
from modules.edit_event import edit_event_bp
from modules.get_event import get_event_bp
from modules.permission import permission_bp
import os

app = Flask(__name__, static_folder="app/build")

# register blueprints
app.register_blueprint(create_event_bp)
app.register_blueprint(edit_event_bp)
app.register_blueprint(get_event_bp)
app.register_blueprint(permission_bp)


# server react app files for any path
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path == "database.db":
        return "File not found", 403

    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(debug=True, port=4000, host="0.0.0.0")