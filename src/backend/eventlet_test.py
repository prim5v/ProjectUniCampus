import eventlet

eventlet.monkey_patch()

from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)

socketio = SocketIO(
    app,
    async_mode="eventlet",
    cors_allowed_origins="*",
)

@app.route("/")
def index():
    return {"status": "eventlet working"}

@socketio.on("connect")
def connect():
    print("Socket client connected")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=10000)