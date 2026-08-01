import logging
from flask import jsonify
from backend.controllers.updatecontrollers import revoke_student_session


def student_logout(session_id):
    try:

        if not session_id:
            return jsonify({
                "error": "Session ID missing from token"
            }), 400

        revoked = revoke_student_session(session_id)

        if not revoked:
            return jsonify({
                "error": "Session not found or already revoked"
            }), 401

        return jsonify({
            "message": "Logout successful",
            "status": "success"
        }), 200

    except Exception as e:
        logging.exception("Student logout failed")

        return jsonify({
            "error": "Server error"
        }), 50