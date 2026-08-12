import logging

from flask import jsonify, g
from backend.controllers.insertcontrollers import insert_single_student
from backend.utils.extraFunctions import get_redis

logger = logging.getLogger(__name__)


def add_single_student(data):

    campus_id = getattr(g, "user_id", None)

    first_name = data.get("first_name")
    middle_name = data.get("middle_name")
    last_name = data.get("last_name")

    admission_number = data.get("admission_number")
    university_email = data.get("university_email")

    faculty = data.get("faculty")
    course = data.get("course")

    expiry = data.get("expiry")  # 31/12/2009

    # --------------------------------
    # VALIDATION
    # --------------------------------
    if not campus_id:
        return jsonify({
            "success": False,
            "message": "campus id required"
        }), 400

    if not first_name or not last_name:
        return jsonify({
            "success": False,
            "message": "First name and last name are required"
        }), 400

    if not admission_number or not university_email:
        return jsonify({
            "success": False,
            "message": "Admission number and university email are required"
        }), 400

    if not faculty or not course:
        return jsonify({
            "success": False,
            "message": "Faculty and course are required"
        }), 400

    if not expiry:
        return jsonify({
            "success": False,
            "message": "Expiry date is required"
        }), 400

    # --------------------------------
    # INSERT STUDENT
    # --------------------------------

    result = insert_single_student(data, campus_id)

    # student_id = collection.insert_one(student_data).inserted_id

    # Invalidate student cache
    try:
        pattern = f"students_data:{campus_id}:*"
        redis_client = get_redis()

        for key in redis_client.scan_iter(match=pattern):
            redis_client.delete(key)

        logger.info(
            f"Student cache invalidated for campus {campus_id}"
        )

    except Exception as redis_error:
        logger.error(
            f"FAILED TO INVALIDATE STUDENT CACHE: {redis_error}"
        )

    if not result:
        return jsonify({
            "success": False,
            "message": "Error inserting student"
        }), 500

    return jsonify({
        "success": True,
        "message": "Student inserted successfully",
        "id": str(result.inserted_id)
    }), 201