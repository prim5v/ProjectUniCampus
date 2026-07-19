from flask import Flask, jsonify
from flask_cors import CORS
import logging
from backend.middleware.limiter import limiter
from backend.utils.cron import start_scheduler
from backend.utils.db import check_db_connection
from backend.utils.extraFunctions import generate_rsa_key_pair


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
start_scheduler()

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

if __name__ == "__main__":
    app.run(debug=True)
    # socketio.run(app, debug=True)