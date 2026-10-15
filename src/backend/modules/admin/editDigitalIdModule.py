from flask import jsonify
from backend.controllers.updatecontrollers import admin_update_digital_id
import logging

logger = logging.getLogger(__name__)

def edit_digital_id(data):
    isActive = data.get("isActive")
    account_status = data.get("account_status")
    security_clearance_level = data.get("security_clearance_level")
    student_id = data.get("student_id")

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

        # call controller
        if admin_update_digital_id(isActive, account_status, security_clearance_level,student_id):
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