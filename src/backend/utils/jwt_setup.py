# backend/utils/jwt_setup.py

import jwt
import hashlib
from functools import wraps
from datetime import datetime, timedelta
import pymysql
import logging

logger = logging.getLogger("auth")


# from flask import (
#     request,
#     jsonify,
#     current_app
# )

# from .db_connection import get_db
# from .audit import log_audit

from flask import request, jsonify, g, current_app


import uuid
import secrets


from backend.controllers.selectcontrollers import get_session_by_id



def generate_access_token(user_id, role, device_id, session_id):
    """Generate a short-lived JWT for API requests."""

    now = datetime.utcnow()
    expiry = now + timedelta(minutes=5)

    payload = {
        "sub": user_id,
        "role": role,
        "device_id": device_id,
        "sid": session_id,
        "type": "access",

        "iat": now,
        "nbf": now,
        "exp": expiry,

        "jti": str(uuid.uuid4())
    }

    token = jwt.encode(
        payload,
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return token, expiry




def generate_refresh_token(user_id, device_id, session_id):
    """Generate a long-lived refresh token."""

    now = datetime.utcnow()
    expiry = now + timedelta(days=30)

    payload = {
        "sub": user_id,
        "device_id": device_id,
        "sid": session_id,
        "type": "refresh",

        "iat": now,
        "nbf": now,
        "exp": expiry,

        "jti": secrets.token_hex(16)
    }

    token = jwt.encode(
        payload,
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    token_hash = hashlib.sha256(token.encode()).hexdigest()

    return token, token_hash, expiry


# ================= JWT GENERATION =================
def generate_jwt(user_id, role, device_id, session_id):
    # Set expiry based on role
    if role == "admin":
        expiry = datetime.utcnow() + timedelta(minutes=1)
    elif role == "comrade":
        expiry = datetime.utcnow() + timedelta(hours=8)
    elif role == "landlord":
        expiry = datetime.utcnow() + timedelta(hours=6)
    else:
        expiry = datetime.utcnow() + timedelta(hours=5)

    payload = {
        "user_id": user_id,
        "role": role,
        "device_id": device_id,
        "session_id": session_id,
        "exp": expiry,
    }

    token = jwt.encode(
        payload,
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    token_hash = hashlib.sha256(token.encode()).hexdigest()

    return token, expiry, token_hash




# all comon endpoints have this
def access_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            logger.warning("Authorization header missing in access token request")
            return jsonify({"error": "Authorization header missing"}), 401

        if not auth_header.startswith("Bearer "):
            logger.warning("Invalid authorization format in access token request")
            return jsonify({"error": "Invalid authorization format"}), 401

        token = auth_header.split(" ", 1)[1]

        try:
            payload = jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )

            # Ensure this is an access token
            if payload.get("type") != "access":
                logger.warning("Invalid token type in access token request")
                return jsonify({"error": "Invalid token type"}), 401

            # Store user information for the route
            g.user_id = payload["sub"]
            g.role = payload["role"]
            g.device_id = payload["device_id"]
            g.session_id = payload["sid"]
            g.jwt_payload = payload

        except jwt.ExpiredSignatureError:
            logger.warning("Access token expired")
            return jsonify({"error": "Access token expired"}), 401

        except jwt.InvalidTokenError:
            logger.warning("Invalid access token")
            return jsonify({"error": "Invalid access token"}), 401

        return f(*args, **kwargs)

    return decorated

# @app.route("/api/profile", methods=["GET"])
# @access_token_required
# def profile():

#     return jsonify({
#         "student_id": g.user_id,
#         "role": g.role
#     })







# only the get access_token endpoint has this. ie we issue access_token if refresh token is valid
# suppose the refresh token expires we need to login again
def refresh_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            logger.warning("Authorization header missing in refresh token request")
            return jsonify({"error": "Authorization header missing"}), 401

        if not auth_header.startswith("Bearer "):
            logger.warning("Invalid authorization format in refresh token request")
            return jsonify({"error": "Invalid authorization format"}), 401

        refresh_token = auth_header.split(" ", 1)[1]

        try:
            payload = jwt.decode(
                refresh_token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )

        except jwt.ExpiredSignatureError:
            logger.warning("Refresh token expired")
            return jsonify({"error": "Refresh token expired"}), 401

        except jwt.InvalidTokenError:
            logger.warning("Invalid refresh token")
            return jsonify({"error": "Invalid refresh token"}), 401

        # Ensure this is actually a refresh token
        if payload.get("type") != "refresh":
            logger.warning("Invalid token type")
            return jsonify({"error": "Invalid token type"}), 401

        session = get_session_by_id(payload["sid"])

        if session is None:
            logger.warning("Session not found")
            return jsonify({"error": "Session not found"}), 401

        if session["revoked_at"] is not None:
            logger.warning("Session revoked")
            return jsonify({"error": "Session revoked"}), 401

        if session["expires_at"] < datetime.utcnow():
            logger.warning("Session expired")
            return jsonify({"error": "Session expired"}), 401

        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()

        if token_hash != session["token_hash"]:
            logger.warning("Refresh token mismatch")
            return jsonify({"error": "Refresh token mismatch"}), 401

        # Make available to the endpoint
        g.user_id = payload["sub"]
        g.session_id = payload["sid"]
        g.device_id = payload["device_id"]
        g.refresh_token = refresh_token
        g.session = session

        return f(*args, **kwargs)

    return decorated



# @app.route("/api/auth/refresh", methods=["POST"])
# @refresh_token_required
# def refresh_access_token():

#     access_token, expires_at = generate_access_token(
#         user_id=g.user_id,
#         role="student",   # fetch role if needed
#         device_id=g.device_id,
#         session_id=g.session_id
#     )

#     return jsonify({
#         "access_token": access_token,
#         "expires_at": expires_at.isoformat()
#     }), 200








# logger = logging.getLogger(__name__)
