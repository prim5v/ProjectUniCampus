import eventlet
eventlet.monkey_patch()

from flask import Flask, jsonify, request
print("1 - Flask imported", flush=True)
from flask_cors import CORS
print("2 - CORS imported", flush=True)
from flask_socketio import SocketIO, join_room
print("12 - SocketIO imported", flush=True)
import logging
print("3 - logging imported", flush=True)
from backend.middleware.limiter import limiter
print("4 - limiter imported", flush=True)
# from backend.utils.cron import start_scheduler
from backend.utils.db import check_db_connection, check_mongo_connection
print("5 - db imported", flush=True)
from backend.utils.extraFunctions import generate_rsa_key_pair
print("6 - extraFunctions imported", flush=True)
from backend.routes.reader import reader_bp
print("7 - reader imported", flush=True)
from backend.routes.auth import auth_bp
print("8 - auth imported", flush=True)
from backend.routes.student import student_bp
print("9 - student imported", flush=True)
from backend.routes.admin import admin_bp
print("10 - admin imported", flush=True)
from backend.routes.pay import pay_bp 
print("11 - pay imported", flush=True)

print("========== ALL IMPORTS COMPLETE ==========", flush=True)


import os

app = Flask(__name__)
CORS(app,
    supports_credentials=True,
    resources={r"/*": {
        "origins": [
            "http://localhost:5173",
            "https://unicampus-os-ruddy.vercel.app"
        ]
    }})

socketio = SocketIO(app, cors_allowed_origins=["http://localhost:5173", "https://unicampus-os-ruddy.vercel.app", "https://projectunicampus.onrender.com"])

# expose it
app.extensions["socketio"] = socketio


secret_key = os.getenv("SECRET_KEY")

if not secret_key:
    raise RuntimeError("SECRET_KEY environment variable is missing")

app.config["SECRET_KEY"] = secret_key


# ================= LOGGING =================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logging.info("Starting the Flask application...")
logging.info("Flask application started successfully.")

# ================= EXTENSIONS =================
limiter.init_app(app)

# ================= SOCKET EVENTS =================
@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

@socketio.on('join_payment_room')
def handle_join_room(data):
    room = data.get('room')
    if room:
        join_room(room)
        print(f" Client {request.sid} joined room: {room}")

# @socketio.on('join_active_access_token_room')
# def token_room():
#     room = 
# ================= ERROR HANDLERS =================
@app.errorhandler(429)
def ratelimit_error(e):
    return jsonify({
        "error": "Too many requests — slow down.",
        "details": str(e.description)
    }), 429

# start cron job
# start_scheduler()
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


@app.route("/health/mongodb")
def mongodb_health():
    is_connected = check_mongo_connection()

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
app.register_blueprint(auth_bp)
app.register_blueprint(student_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(pay_bp)

if __name__ == "__main__":
    # app.run(debug=True)
    socketio.run(app, debug=False)


    # https://projectunicampus.onrender.com