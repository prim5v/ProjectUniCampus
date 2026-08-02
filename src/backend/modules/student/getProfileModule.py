from flask import jsonify
from backend.controllers.selectcontrollers import get_student_data
import logging
logger = logging.getLogger("getProfileModule")

def get_profile_module(student_id):
    if not student_id:
        return jsonify({
            "success": False,
            "error": "Student ID is required"
        }), 400

    user = get_student_data(student_id)

    if user is None:
        logger.warning(f"Student not found for student_id: {student_id}")
        return jsonify({
            "success": False,
            "error": "Student not found"
        }), 404

    logger.info(f"Profile retrieved for student_id: {student_id}")
    return jsonify({
        "success": True,
        "user": user
    }), 200