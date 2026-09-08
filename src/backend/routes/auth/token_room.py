from flask import current_app, jsonify, g, request
from flask_socketio import join_room
from backend.utils.jwt_setup import access_token_required
socketio = current_app.extensions["socketio"]

@socketio.on('join_active_access_token_room')
@access_token_required
def token_room():
    room = getattr(g, "user_id", None)
    if room:
        join_room(room)
        print(f"Client {request.sid} joined access token room: {room}")