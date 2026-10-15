from flask import jsonify, g
from backend.controllers.updatecontrollers import admin_update_digital_id
import logging
from backend.utils.extraFunctions import get_redis

from fnmatch import fnmatch
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

    if not account_status or not security_clearance_level:
        return jsonify({
            "success": False,
            "message": "missing required fields"
        }), 400

    try:
        campus_id = getattr(g, "user_id", None)
        # call controller
        if admin_update_digital_id(isActive, account_status, security_clearance_level,student_id):
            # Invalidate student cache

            redis_client = get_redis()
            pattern = f"students_data:{campus_id}:*"

            try:
                cursor = 0
                keys_to_delete = []

                while True:
                    result = redis_client.scan(cursor=cursor, match=pattern, count=100)

                    cursor = int(result[0])
                    keys = result[1]

                    keys_to_delete.extend(keys)

                    if cursor == 0:
                        break

                if keys_to_delete:
                    redis_client.delete(*keys_to_delete)

                logger.info(
                    "Student cache invalidation completed for campus %s; deleted %s keys",
                    campus_id,
                    len(keys_to_delete),
                )

            except Exception:
                logger.exception(
                    "FAILED TO INVALIDATE STUDENT CACHE for campus %s",
                    campus_id,
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