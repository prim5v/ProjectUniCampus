from flask import jsonify, g
from backend.controllers.updatecontrollers import admin_update_digital_id
import logging
from backend.utils.extraFunctions import get_redis

logger = logging.getLogger(__name__)

def edit_digital_id(data):
    isActive = data.get("isActive")
    account_status = data.get("account_status")
    security_clearance_level = data.get("security_clearance_level")
    student_id = data.get("student_id")

    print(f"Recived Data: {student_id}, {security_clearance_level}, {account_status}, {isActive}")

    if not student_id:
        return jsonify({
            "success": False,
            "message": "student reference required"
        }), 400

    if not isActive or not account_status or not security_clearance_level:
        return jsonify({
            "success": False,
            "message": "missing required fields"
        }), 400

    try:
        campus_id = getattr(g, "user_id", None)
        # call controller
        if admin_update_digital_id(isActive, account_status, security_clearance_level,student_id):
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

            return jsonify({
                "success": True,
                "message": "admin edit was a success"
            }), 200

        

    except Exception as e:
        logger.exception(e)
        return jsonify({
            "success": False,
            "message": f"Server error {str(e)}"
        }), 500