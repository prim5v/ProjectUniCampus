from flask import jsonify
from backend.controllers.selectcontrollers import check_reader, check_nonce, get_service_id, get_student_by_id, check_student, student_campus, get_wallet_data
from backend.utils.extraFunctions import decrypt_with_private_key
from backend.controllers.insertcontrollers import create_service_session, insert_expense_transaction
from backend.controllers.updatecontrollers import update_service_session
from backend.utils.notifications import send_expo_notification_to_one
import logging
from pathlib import Path
import time
import base64

PRIVATE_KEY_PATH = Path("/etc/secrets/private_key.pem")

if not PRIVATE_KEY_PATH.exists():
    BACKEND_ROOT = Path(__file__).resolve().parent.parent
    PRIVATE_KEY_PATH = BACKEND_ROOT / "private_key.pem"

with open(PRIVATE_KEY_PATH, "rb") as f:
    private_key = f.read()

logger = logging.getLogger(__name__)
def payment_payload(data):

    try:
        ciphertext = data.get("ciphertext")
        reader_id = data.get("reader_id")
        amount = data.get("amount")

        print(f"Received payload: {ciphertext}, {reader_id}, {amount}")
        if not ciphertext or not reader_id or not amount:
            return jsonify({
                "success": False,
                "message": "missing required fields"
            }), 400

        serviceType = check_reader(reader_id)
        if not serviceType:
            logger.error("Unauthorized reader")
            return jsonify({
                "success": False,
                "message": "Unauthorized reader"
            }), 403

        if serviceType != "Payment":
            logger.error("reader not authorized to process payments")
            return jsonify({
                "success": False,
                "message": "reader not authorized to process payments"
            }), 403

        data_inHexBytes = decrypt_with_private_key(ciphertext, private_key)
        if not data_inHexBytes:
            logger.error("Invalid payload")
            return jsonify({
                "success": False,
                "message": "Invalid Payload"
            }), 400

        separator = data_inHexBytes.index(b'|')
        student_id = data_inHexBytes[:separator].decode("utf-8")
        remaining = data_inHexBytes[separator + 1:]
        if len(remaining) != 29:
            logger.error(f"Malformed payload: expected 29 bytes, got {len(remaining)}")
            return jsonify({
                "success": False,
                "message": "Malformed Payload"
            }), 400
        nonce = remaining[:16]
        timestamp_ms = int(remaining[16:].decode("utf-8"))
        timestamp = timestamp_ms // 1000
        MAX_TIME_DIFF = 20 
        current_timestamp = int(time.time())
        if abs(current_timestamp - timestamp) > MAX_TIME_DIFF:
            logger.warning("Expired payload")
            return jsonify({
                "success": False,
                "message": "Expired request"
            }), 401
        nonce = base64.b64encode(nonce).decode("utf-8")
        if check_nonce(nonce):
            logger.warning("Token used")
            return jsonify({
                "success": False,
                "message": "request reuse denied"
            }), 403
        service_id , service_data_id, required_security_clearance_level = get_service_id(reader_id)
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
        # we check if student is authorized for payment ie account status is active and if id is active
        student_check = check_student(student_id, serviceType, required_security_clearance_level)
        reason = student_check["reason"]
        status = student_check["status"]
        if not student_check["authorized"]:
            update_service_session(session_id, reason, status)
            return jsonify({
                "success": False,
                "message": "Student Unauthorized"
            }), 403
        student = student_check["student"]
        update_service_session(session_id, reason, status)
        if amount is None:
            return jsonify({
                "success": False,
                "message": "Amount required"
            }), 400
        try:
            amount = float(amount)
        except (ValueError, TypeError):
            return jsonify({
                "success": False,
                "message": "Invalid amount"
            }), 400
        if amount <= 0:
            return jsonify({
                "success": False,
                "message": "Invalid amount"
            }), 400
        transaction_id = 1
        payment_method = "NFC"
        campus_id = student_campus(student_id)
        wallet_data = get_wallet_data(student_id)
        balance = float(wallet_data["balance2"])
        if balance >= amount:
            insert_expense_transaction(transaction_id, student_id, campus_id, amount, "COMPLETE", payment_method, session_id)
        elif balance < amount:
            return jsonify({
                "success": False,
                "message": "Insufficient funds"
            }), 200
        title = "NFC Payment successful"
        body = f"Your payment of KES {amount:.2f} was successfully processed."
        channelId = "payments"
        priority = "high"
        data = {
            "type": "payment",
            "id": session_id,
            "amount": amount
        }
        if send_expo_notification_to_one(student_id, title, body, channelId, priority, data):
            print("notification sent")
        else:
            print("notification failed")
        return jsonify({
            "success": True,
            "message": "Payment processed successfully"
        }), 200
    except Exception as e:
        logger.exception(e)
        return jsonify({
            "success": False,
            "message": f"Server error {str(e)}"
        }), 500
# bet 9/10 no errors