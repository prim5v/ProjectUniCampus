from flask import jsonify
from backend.controllers.selectcontrollers import get_student_data


def get_profile_module(student_id):
    if not student_id:
        return jsonify({
            "success": False,
            "error": "Student ID is required"
        }), 400

    user = get_student_data(student_id)

    if user is None:
        return jsonify({
            "success": False,
            "error": "Student not found"
        }), 404

    return jsonify({
        "success": True,
        "user": user
    }), 200