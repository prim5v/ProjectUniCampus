
from flask import jsonify
from backend.controllers.updatecontrollers import update_profile_year_of_study, update_profile_pwd
import bcrypt
import logging

logger = logging.getLogger(__name__)

def profileEdit(data):
    try:
        new_pwd = data.get("new_pwd")
        year_of_study = data.get("year_of_study")
        student_id = data.get("student_id")

        if not new_pwd and not year_of_study:
            return jsonify({
                "success": False,
                "message": "missing requitred fields"
            }), 400

        if not student_id:
            return jsonify({
                "success": False,
                "message": "missing required fields"
            }), 400

        if year_of_study:
            update_profile_year_of_study(year_of_study, student_id)

        if new_pwd:

            new_pwd = new_pwd.strip().lower()
            # hash the pwd 
            new_pwd_hash = bcrypt.hashpw(
                new_pwd.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")

            update_profile_pwd(new_pwd_hash, student_id)

        return jsonify({
            "success": True,
            "message": "Profile updated successfully"
        }), 200

    except Exception as e:
        logger.exception("Server error")
        return jsonify({
            "success": False,
            "message": f"Server error {str(e)}"
        }), 500