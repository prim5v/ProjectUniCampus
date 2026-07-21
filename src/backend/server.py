from flask import Flask, jsonify
from flask_cors import CORS
import logging
from backend.middleware.limiter import limiter
from backend.utils.cron import start_scheduler
from backend.utils.db import check_db_connection
from backend.utils.extraFunctions import generate_rsa_key_pair
from backend.routes.reader import reader_bp

app = Flask(__name__)
CORS(app,
    supports_credentials=True,
    resources={r"/*": {
        "origins": [
            "http://localhost:5173"
        ]
    }})


# ================= LOGGING =================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logging.info("Starting the Flask application...")
logging.info("Flask application started successfully.")

# ================= EXTENSIONS =================
limiter.init_app(app)


# ================= ERROR HANDLERS =================
@app.errorhandler(429)
def ratelimit_error(e):
    return jsonify({
        "error": "Too many requests — slow down.",
        "details": str(e.description)
    }), 429

# start cron job
# 
# import os

# # # Only start the scheduler if NOT running under PythonAnywhere's uWSGI web server
# # if "UWSGI_ORIGINAL_PROC_NAME" not in os.environ:
# #     start_scheduler()
# # else:
# #     print("Skipping background scheduler initialization in uWSGI worker process.")


@app.route("/generate_rsa")
def generate_rsa():
    public_key = generate_rsa_key_pair()
    return public_key


# ================= Health Check =================

@app.route("/")
def health_check():
    return {"status": "healthy"}

@app.route("/health/db")
def db_health():
    is_connected = check_db_connection()

    if is_connected:
        return {
            "status": "healthy",
            "database": "connected"
        }, 200
    else:
        return {
            "status": "unhealthy",
            "database": "disconnected"
        }, 500
    
# ================= BLUEPRINTS =================
# app.register_blueprint(auth_bp)
app.register_blueprint(reader_bp)

if __name__ == "__main__":
    app.run(debug=True)
    # socketio.run(app, debug=True)