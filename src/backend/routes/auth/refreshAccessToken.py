from flask import jsonify, g
import logging
from backend.routes.auth import auth_bp
from backend.utils.jwt_setup import (
    refresh_token_required,
    generate_access_token
)

logger = logging.getLogger("auth")

@auth_bp.route("/refresh/access/token", methods=["POST"])
@refresh_token_required
def refresh_access_token():
    user_id = g.user_id
    device_id = g.device_id
    session_id = g.session_id

    token, expiry = generate_access_token(
        user_id=user_id,
        role="student",
        device_id=device_id,
        session_id=session_id
    )
    logger.info(f"Access token refreshed for user_id: {user_id}, device_id: {device_id}, session_id: {session_id}")

    return jsonify({
        "success": True,
        "access_token": token,
        "expiry": expiry 
    }), 200




