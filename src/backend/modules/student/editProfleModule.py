
# from flask import jsonify
# from backend.controllers.updatecontrollers import update_profile_year_of_study, update_profile_pwd
# import bcrypt
# import logging

# logger = logging.getLogger(__name__)

# def profileEdit(data):
#     try:
#         new_pwd = data.get("new_pwd")
#         year_of_study = data.get("year_of_study")
#         student_id = data.get("student_id")

#         if not new_pwd and not year_of_study:
#             return jsonify({
#                 "success": False,
#                 "message": "missing requitred fields"
#             }), 400

#         if not student_id:
#             return jsonify({
#                 "success": False,
#                 "message": "missing required fields"
#             }), 400

#         if year_of_study:
#             update_profile_year_of_study(year_of_study, student_id)

#         if new_pwd:

#             new_pwd = new_pwd.strip().lower()
#             # hash the pwd 
#             new_pwd_hash = bcrypt.hashpw(
#                 new_pwd.encode("utf-8"),
#                 bcrypt.gensalt()
#             ).decode("utf-8")

#             update_profile_pwd(new_pwd_hash, student_id)

#         return jsonify({
#             "success": True,
#             "message": "Profile updated successfully"
#         }), 200

#     except Exception as e:
#         logger.exception("Server error")
#         return jsonify({
#             "success": False,
#             "message": f"Server error {str(e)}"
#         }), 500


from flask import jsonify, g
from backend.controllers.updatecontrollers import (
    update_profile_year_of_study,
    update_profile_pwd
)
import bcrypt
import logging

logger = logging.getLogger(__name__)

def profileEdit(data):
    try:
        student_id = data.get("student_id")
        new_pwd = data.get("new_pwd")
        year_of_study = data.get("year_of_study")

        if not student_id:
            return jsonify({
                "success": False,
                "message": "Student ID is required"
            }), 400

        # Recommended: verify authenticated identity
        # Adjust this comparison if your authentication system
        # stores the student ID under a different field.
        authenticated_id = getattr(g, "user_id", None)

        if authenticated_id and str(authenticated_id) != str(student_id):
            return jsonify({
                "success": False,
                "message": "Unauthorized profile update"
            }), 403

        if not new_pwd and year_of_study is None:
            return jsonify({
                "success": False,
                "message": "No changes submitted"
            }), 400

        # YEAR UPDATE
        if year_of_study is not None:
            try:
                year_of_study = int(year_of_study)
            except (ValueError, TypeError):
                return jsonify({
                    "success": False,
                    "message": "Invalid year of study"
                }), 400

            if year_of_study not in range(1, 7):
                return jsonify({
                    "success": False,
                    "message": "Invalid year of study"
                }), 400

            update_profile_year_of_study(
                year_of_study,
                student_id
            )

        # PASSWORD UPDATE
        if new_pwd:
            if not isinstance(new_pwd, str):
                return jsonify({
                    "success": False,
                    "message": "Invalid password"
                }), 400

            if len(new_pwd) < 8:
                return jsonify({
                    "success": False,
                    "message": "Password must be at least 8 characters"
                }), 400

            new_pwd_hash = bcrypt.hashpw(
                new_pwd.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")

            update_profile_pwd(
                new_pwd_hash,
                student_id
            )

        return jsonify({
            "success": True,
            "message": "Profile updated successfully"
        }), 200

    except Exception:
        logger.exception("Profile update failed")

        return jsonify({
            "success": False,
            "message": "An internal server error occurred"
        }), 500