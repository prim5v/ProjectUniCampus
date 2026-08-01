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

from .db_connection import get_db
from .audit import log_audit

from flask import request, jsonify, g, current_app


import uuid
import secrets


from backend.controllers.selectcontrollers import get_session_by_id



def generate_access_token(user_id, role, device_id, session_id):
    """Generate a short-lived JWT for API requests."""

    now = datetime.utcnow()
    expiry = now + timedelta(minutes=15)

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
            return jsonify({"error": "Authorization header missing"}), 401

        if not auth_header.startswith("Bearer "):
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
                return jsonify({"error": "Invalid token type"}), 401

            # Store user information for the route
            g.user_id = payload["sub"]
            g.role = payload["role"]
            g.device_id = payload["device_id"]
            g.session_id = payload["sid"]
            g.jwt_payload = payload

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Access token expired"}), 401

        except jwt.InvalidTokenError:
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
            return jsonify({"error": "Authorization header missing"}), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Invalid authorization format"}), 401

        refresh_token = auth_header.split(" ", 1)[1]

        try:
            payload = jwt.decode(
                refresh_token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Refresh token expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid refresh token"}), 401

        # Ensure this is actually a refresh token
        if payload.get("type") != "refresh":
            return jsonify({"error": "Invalid token type"}), 401

        session = get_session_by_id(payload["sid"])

        if session is None:
            return jsonify({"error": "Session not found"}), 401

        if session["revoked_at"] is not None:
            return jsonify({"error": "Session revoked"}), 401

        if session["expires_at"] < datetime.utcnow():
            return jsonify({"error": "Session expired"}), 401

        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()

        if token_hash != session["token_hash"]:
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




# ================= TOKEN PROTECTION =================

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        logger.info("=== AUTH CHECK START ===")
        logger.info("Path=%s Method=%s IP=%s", request.path, request.method, request.remote_addr)

        # ---- Device ID ----
        device_id = request.cookies.get("device_id")
        logger.info("Device ID from cookie: %s", device_id)

        if not device_id:
            logger.warning("AUTH FAIL: Device ID missing")
            return jsonify({"error": "Device ID missing"}), 400

        # ---- JWT from cookie ----
        token = request.cookies.get("access_token")
        logger.info("Access token present: %s", bool(token))

        if not token:
            logger.warning("AUTH FAIL: Token missing")
            return jsonify({"error": "Token missing"}), 401

        # ---- Decode JWT ----
        try:
            data = jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )
            logger.info("JWT decoded successfully")

        except jwt.ExpiredSignatureError:
            logger.warning("AUTH FAIL: JWT expired")
            return jsonify({"error": "Token expired"}), 401

        except jwt.InvalidTokenError:
            logger.warning("AUTH FAIL: Invalid JWT")
            return jsonify({"error": "Invalid token"}), 401

        current_user = data.get("user_id")
        role = data.get("role")
        token_device_id = data.get("device_id")
        session_id = data.get("session_id")

        logger.info(
            "JWT Payload: user_id=%s role=%s device_id=%s session_id=%s",
            current_user, role, token_device_id, session_id
        )

        if not all([current_user, role, token_device_id, session_id]):
            logger.warning("AUTH FAIL: JWT missing required fields")
            return jsonify({"error": "Invalid token payload"}), 401

        # ---- Device binding ----
        if token_device_id != device_id:
            logger.warning(
                "AUTH FAIL: Device mismatch. token_device_id=%s cookie_device_id=%s",
                token_device_id, device_id
            )
            return jsonify({"error": "Token not valid for this device"}), 401
        
        conn = get_db()
        cursor = conn.cursor()

        # ---- Token hash (optional but logged) ----
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        logger.info("Token hash: %s", token_hash)
        # check if user account is deactivated or active
        try:
            cursor.execute("""
                SELECT is_active From users 
                WHERE user_id=%s
                """, (current_user,))
            user_row = cursor.fetchone()

            if not user_row:
                return jsonify({"error": "User not found"}), 401

            if not user_row["is_active"]:
                return jsonify({"error": "Account disabled"}), 401
        except Exception as err:
            logger.exception("AUTH FAIL: Database error during user account check")
            return jsonify({"error": "Auth System failure"}), 500

        # ---- Session check ----
        try:
            # conn = get_db()
            # cursor = conn.cursor()

            logger.info("Querying session from DB...")
            cursor.execute(
                """
                SELECT * FROM sessions
                WHERE session_id=%s AND user_id=%s AND device_id=%s
                """,
                (session_id, current_user, device_id)
            )
            session = cursor.fetchone()

        except Exception as db_err:
            logger.exception("AUTH FAIL: Database error during session lookup")
            return jsonify({"error": "Auth system failure"}), 500

        if not session:
            logger.warning(
                "AUTH FAIL: Session not found. user_id=%s session_id=%s device_id=%s",
                current_user, session_id, device_id
            )

            log_audit(
                current_user,
                "SESSION_INVALID",
                request,
                role=role,
                status="failure",
                metadata={"reason": "session not found"}
            )

            return jsonify({"error": "Session invalid or revoked"}), 401

        logger.info(
            "Session found in DB. expires_at=%s created_at=%s",
            session["expires_at"], session["created_at"]
        )

        # ---- Expiry check ----
        now = datetime.utcnow()
        logger.info("Current UTC time: %s", now)

        if now > session["expires_at"]:
            logger.warning(
                "AUTH FAIL: Session expired. now=%s expires_at=%s",
                now, session["expires_at"]
            )

            log_audit(
                current_user,
                "SESSION_EXPIRED",
                request,
                role=role,
                status="failure"
            )

            return jsonify({"error": "Session expired"}), 401

        # ---- CSRF protection ----
        if request.method in ("POST", "PUT", "PATCH", "DELETE"):
            csrf_header = request.headers.get("X-CSRF-Token")
            csrf_cookie = request.cookies.get("csrf_token")

            logger.info(
                "CSRF check: header_present=%s cookie_present=%s match=%s",
                bool(csrf_header),
                bool(csrf_cookie),
                csrf_header == csrf_cookie
            )

            if not csrf_header or not csrf_cookie or csrf_header != csrf_cookie:
                logger.warning(
                    "AUTH FAIL: CSRF validation failed. header=%s cookie=%s",
                    csrf_header, csrf_cookie
                )

                log_audit(
                    current_user,
                    "CSRF_FAILURE",
                    request,
                    role=role,
                    status="failure"
                )

                return jsonify({"error": "CSRF validation failed"}), 403

        # ---- Audit protected access ----
        if request.method != "GET":
            log_audit(
                current_user,
                "PROTECTED_ROUTE_ACCESS",
                request,
                role=role,
                status="success"
            )

        logger.info("=== AUTH CHECK PASSED === user_id=%s role=%s", current_user, role)

        return f(current_user, role, *args, **kwargs)

    return decorated

# role based access decorator





def require_role(required_roles):
    """
    Role-based access control decorator.
    - required_roles: str or list/tuple/set of roles
    - MUST be used after token_required
    """

    if isinstance(required_roles, str):
        required_roles_set = {required_roles.lower()}
    else:
        required_roles_set = {r.lower() for r in required_roles}

    def decorator(f):
        @token_required
        @wraps(f)
        def wrapper(current_user, role, *args, **kwargs):

            path = request.path
            method = request.method
            ip = request.remote_addr

            role_normalized = (role or "unknown").lower()

            logger.info(
                "=== ROLE CHECK START === path=%s method=%s ip=%s user_id=%s role=%s required=%s",
                path, method, ip, current_user, role_normalized, list(required_roles_set)
            )

            # ❌ Access denied
            if role_normalized not in required_roles_set:
                logger.warning(
                    "❌ ROLE CHECK FAILED path=%s user_id=%s role=%s required=%s",
                    path, current_user, role_normalized, list(required_roles_set)
                )

                log_audit(
                    user_id=current_user,
                    action="ROLE_ACCESS_DENIED",
                    request=request,
                    role=role_normalized,
                    status="failure",
                    metadata={
                        "required_roles": list(required_roles_set),
                        "attempted_role": role_normalized,
                        "path": path,
                        "method": method,
                    },
                )

                return jsonify({
                    "error": "Forbidden",
                    "message": "You do not have permission to access this resource"
                }), 403

            # ✅ Access granted
            logger.info(
                "✅ ROLE CHECK PASSED path=%s user_id=%s role=%s",
                path, current_user, role_normalized
            )

            log_audit(
                user_id=current_user,
                action="ROLE_ACCESS_GRANTED",
                request=request,
                role=role_normalized,
                status="success",
                metadata={
                    "required_roles": list(required_roles_set),
                    "path": path,
                    "method": method,
                },
            )

            return f(current_user, role, *args, **kwargs)

        return wrapper

    return decorator


logger = logging.getLogger(__name__)

# ================= VERIFIED USER DECORATOR =================
def require_verified_user(f):
    """
    Ensures that the user has a verified security check.
    Must be used **after** token_required (directly or indirectly),
    so `current_user` and `role` are already available.
    """
    @wraps(f)
    def wrapper(current_user, role, *args, **kwargs):

        logger.info(
            "=== VERIFICATION CHECK START === path=%s method=%s ip=%s user_id=%s role=%s",
            request.path,
            request.method,
            request.remote_addr,
            current_user,
            role
        )

        try:
            db = get_db()
            cursor = db.cursor(pymysql.cursors.DictCursor)

            logger.info(
                "Querying security_checks for user_id=%s check_type=landlord",
                current_user
            )

            cursor.execute(
                """
                SELECT status
                FROM security_checks
                WHERE user_id = %s AND check_type = 'landlord'
                """,
                (current_user,)
            )
            check = cursor.fetchone()

            logger.info("Verification query result: %s", check)

            if not check:
                logger.warning(
                    "❌ VERIFICATION FAILED: No security_checks row for user_id=%s",
                    current_user
                )
                return jsonify({
                    "error": "User not verified",
                    "message": "Verification record not found."
                }), 403

            if check.get("status") != "verified":
                logger.warning(
                    "❌ VERIFICATION FAILED: status=%s user_id=%s",
                    check.get("status"),
                    current_user
                )
                return jsonify({
                    "error": "User not verified",
                    "message": "You need to complete verification before accessing this feature."
                }), 403

            logger.info(
                "✅ VERIFICATION PASSED user_id=%s role=%s",
                current_user,
                role
            )

        except Exception as e:
            logger.exception(
                "🔥 VERIFICATION CHECK ERROR user_id=%s error=%s",
                current_user,
                str(e)
            )
            return jsonify({"error": "Verification check failed"}), 500

        # ✅ Proceed to the wrapped route
        return f(current_user, role, *args, **kwargs)

    return wrapper


