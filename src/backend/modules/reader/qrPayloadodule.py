from flask import jsonify, g
from pathlib import Path
import logging
from backend.controllers.selectcontrollers import check_reader, get_service_id, check_student, check_nonce, check_device_id, student_campus, get_wallet_data
from backend.utils.extraFunctions import decrypt_with_private_key
from backend.controllers.insertcontrollers import create_service_session, insert_expense_transaction
from backend.controllers.updatecontrollers import update_service_session
import time
import base64

logger = logging.getLogger(__name__)

PRIVATE_KEY_PATH =Path("/etc/secrets/private_key.pem")
logger.info("checking default private key...")

if not PRIVATE_KEY_PATH.exists():
    logging.info("Private key does not exist going for fallback")
    BACKEND_ROOT = Path(__file__).resolve().parent.parent
    PRIVATE_KEY_PATH = BACKEND_ROOT / "private_key.pem"

with open(PRIVATE_KEY_PATH, "rb") as f:
    private_key = f.read()

def payload(data):
    try:
        base64ciphertext = data.get("ciphertext")
        reader_id = data.get("reader_id")
        amount = data.get("amount")

        if not base64ciphertext or not reader_id:
            return jsonify({
                "success": False,
                "message": "Missing required fields"}
                ), 400

        # check if reader is authorized and get serviceType
        # debug print
        print(base64ciphertext)

        serviceType = check_reader(reader_id) 
        if not serviceType:
            logger.error("Unauthorized reader")
            return jsonify({
                "success": False,
                "message": "Unauthorized"}
                ), 403

        logger.info(f"Reader {reader_id} authorized for {serviceType}")

        # decode ciphertext
        data_inHexBytes = decrypt_with_private_key(base64ciphertext, private_key)
        logger.info(f"Decrypted payload data: {data_inHexBytes}")
        if not data_inHexBytes:
            logger.error("Invalid Payload")
            return jsonify({
                "success": False,
                "message": "Invalid Payload"}
                ), 400

        # create data info from decoded ciphertext

        separator = data_inHexBytes.index(b'|')

        student_id = data_inHexBytes[:separator].decode("utf-8")
        logger.info(f"Extracted student_id: {student_id}")

        remaining = data_inHexBytes[separator + 1:]

        if len(remaining) != 29:
            logger.error(f"Malformed Payload: expected 29 bytes, got {len(remaining)}")
            return jsonify({
                "success": False,
                "message": "Malformed Payload"}
                ), 400

        nonce = remaining[:16]
        logger.info(f"Extracted nonce: {nonce}")

        timestamp_ms = int(remaining[16:].decode("utf-8"))

        timestamp = timestamp_ms // 1000
        logger.info(f"Extracted timestamp:{timestamp}")

        MAX_TIME_DIFF = 60

        current_timestamp = int(time.time())

        if abs(current_timestamp - timestamp) > MAX_TIME_DIFF:
            logger.warning(f"Expired payload")
            return jsonify({
                "success": False,
                "message": "Expired request"}
                ), 401

        nonce = base64.b64encode(nonce).decode("utf-8")

        if check_nonce(nonce):
            logger.warning(f"token used")
            return jsonify({
                "success": False,
                "message": "payload used"}
                ), 403

        service_id = get_service_id(reader_id)

        if not service_id:
            logger.info("No service for this reader")
            return jsonify({
                "success": False,
                "message": "No service for this reader"}
                ), 400

        session_id = create_service_session(service_id, student_id, nonce, timestamp)

        student_check = check_student(student_id, serviceType)
        if not student_check["authorized"]:
            reason = student_check["reason"]
            update_service_session(session_id, reason)
            logger.warning(f"student auth failed: {reason}")
            return jsonify({
                "success": False,
                "message": "Student Unauthorized"}
                ), 403

        student = student_check["student"]
        check_device = check_device_id(student["student_id"])
        if not check_device:
            return jsonify({
                "success": False,
                "message": "Unauthorized"}
                ), 403

        reason = student_check["reason"]
        update_service_session(session_id, reason)

        if serviceType == "Payment":
            if amount is None:
                return jsonify({
                    "success": False,
                    "message": "Amount required"}
                    ), 400

            try:
                amount = float(amount)
            except (ValueError, TypeError):
                return jsonify({
                    "success": False,
                    "message": "Invalid amount"}
                    ), 400

            if amount <=0:
                return jsonify({
                    "success": False,
                    "message": "Invalid amount"}
                    ), 400
            transaction_id =1
            payment_method = "QR"
            campus_id = student_campus(student_id)
            # we need to check students balance must be more than requested amount
            # for now ill reuse get wallet data
            wallet_data = get_wallet_data(student_id)
            balance = wallet_data["balance"]
            if balance >= amount:
                insert_expense_transaction(transaction_id, student_id, campus_id, amount, "COMPLETED", payment_method, session_id)
                logger.info(f"Payment of {amount} recorded for {student_id}")

            elif balance < amount:
                logger.info("Not sufficient funds")
                return jsonify({
                    "success": False,
                    "message": "Insufficient funds"
                }), 200

        logger.info(f"Session {session_id} completed successfully")

        return jsonify({
            "success": True,
            "message": session_id
        }), 200
    
    except Exception as e:
        logger.exception(e)
        return jsonify({
            "success": False,
            "message": "Server Error"
        }), 500


        







    