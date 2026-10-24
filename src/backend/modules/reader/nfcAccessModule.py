from flask import jsonify
from backend.controllers.selectcontrollers import check_reader, check_nonce, get_service_id, get_student_by_id, check_student
from backend.controllers.insertcontrollers import create_service_session
from backend.controllers.updatecontrollers import update_service_session
from backend.utils.notifications import send_expo_notification_to_one
from backend.utils.extraFunctions import decrypt_with_private_key
from pathlib import Path
import base64
import time
import logging
logger = logging.getLogger(__name__)

PRIVATE_KEY_PATH = Path("/etc/secrets/private_key.pem")
if not PRIVATE_KEY_PATH.exists():
    BACKEND_ROOT = Path(__file__).resolve().parent.parent
    PRIVATE_KEY_PATH = BACKEND_ROOT / "private_key.pem"

with open(PRIVATE_KEY_PATH, "rb") as f:
    private_key = f.read()

def access_payload(data):
    try:
        ciphertext = data.get("ciphertext")
        reader_id = data.get("reader_id")
        amount = data.get("amount")

        print(f"Received data: {ciphertext}, {reader_id}")
        if not ciphertext or not reader_id:
            return jsonify({
                "success": False,
                "message": "Missing required fields"
            }), 400

        if amount:
            return jsonify({
                "success": False,
                "message": "Reader not authorized to process payments"
            }), 403

        serviceType = check_reader(reader_id)
        if not serviceType:
            logger.error("Unauthorized reader")
            return jsonify({
                "success": False,
                "message": "Unauthorized reader"
            }), 403
        
        if serviceType != "Access":
            return jsonify({
                "success": False,
                "message": "Reader not authorized for access"
            }), 403

        data_inHexBytes = decrypt_with_private_key(ciphertext, private_key)
        if not data_inHexBytes:
            return jsonify({
                "success": False,
                "message": "Invalid Payload"
            }), 400

        separator = data_inHexBytes.index(b'|')

        student_id = data_inHexBytes[:separator].decode("utf-8")
        print(f"Decoded student id:{student_id}")
        remaining = data_inHexBytes[separator + 1:]
        if len(remaining) != 29:
            return jsonify({
                "success": False,
                "message": "Malformed Payload"
            }), 400
        nonce = remaining[:16]
        print(f"nonce: {nonce}")
        timestamp_ms = int(remaining[16:].decode("utf-8"))
        timestamp = timestamp_ms // 1000
        print(f"Timestamp_ms: {timestamp_ms}")
        print(f"Timestamp: {timestamp}")
        MAX_TIME_DIFF = 20
        current_timestamp = int(time.time())
        if abs(current_timestamp - timestamp) > MAX_TIME_DIFF:
            return jsonify({
                "success": False,
                "message": "Expired request"
            }), 401
        nonce = base64.b64encode(nonce).decode("utf-8")
        if check_nonce(nonce):
            return jsonify({
                "success": False,
                "message": "request reuse denied"
            }), 403

        service_id, service_data_id, required_security_clearance_level = get_service_id(reader_id)
        if not service_id or not service_data_id:
            return jsonify({
                "success": False,
                "message": "No service for this reader"
            }), 404

        student = get_student_by_id(student_id)
        if not student:
            return jsonify({
                "success": False,
                "message": "Student not registered"
            }), 404

        session_id = create_service_session(service_id, student_id, nonce, timestamp, service_data_id)
        student_check = check_student(student_id, serviceType, required_security_clearance_level)
        # add logic to check security clearance
        reason = student_check["reason"]
        status = student_check["status"]
        if not student_check["authorized"]:
            update_service_session(session_id, reason, status)
            return jsonify({
                "success": False,
                "message": "user Unauthorized"
            }), 403
        
        student = student_check["student"]
        update_service_session(session_id, reason, status)
        title = "NFC Access Granted"
        body = f"User {student_id} authorized"
        channelId = "access"
        priority = "high"
        data = {
            "type": "access",
            "id": session_id
        }
        if send_expo_notification_to_one(student_id, title, body, channelId, priority, data):
            print("notification sent")
        else:
            print("notification failed")

        return jsonify({
            "success": True,
            "message": "NFC Access Granted"
        }), 200
    
    except Exception as e:
        logger.exception(e)
        return jsonify({
            "success": False,
            "message": f"Server error {str(e)}"
        }), 500


        

        