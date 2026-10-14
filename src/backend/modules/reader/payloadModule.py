import logging
from backend.utils.extraFunctions import decrypt_with_private_key
from backend.controllers.selectcontrollers import check_reader, get_service_id, check_student, check_nonce, student_campus, get_wallet_data
from backend.controllers.insertcontrollers import create_service_session, insert_expense_transaction
from backend.controllers.updatecontrollers import update_service_session
import time
import base64
from pathlib import Path
from backend.controllers.selectcontrollers import check_device_id
from backend.utils.notifications import send_expo_notification_to_one
from flask import jsonify

# BACKEND_ROOT = Path(__file__).resolve().parent.parent
# PRIVATE_KEY_PATH = BACKEND_ROOT / "private_key.pem"

# with open(PRIVATE_KEY_PATH, "rb") as f:
#     private_key = f.read()

# from pathlib import Path
import os


# Render mounts secret files at /etc/secrets/
PRIVATE_KEY_PATH = Path("/etc/secrets/private_key.pem")
logging.info("checking default private key...")

# Fallback to a local workspace path for your local development 
if not PRIVATE_KEY_PATH.exists():
    logging.info("Private key does not exist going for fallback")
    BACKEND_ROOT = Path(__file__).resolve().parent.parent
    PRIVATE_KEY_PATH = BACKEND_ROOT / "private_key.pem"

with open(PRIVATE_KEY_PATH, "rb") as f:
    private_key = f.read()
    # Your implementation here


def get_payload(data):
    try:
        ciphertext =data.get("ciphertext")
        # due to issues i will send raw unencrypted student_id on cipher_text var
        reader_id = data.get("reader_id")
        amount = data.get("amount") # we use amount if serviceType is Payment

        logging.info(f"Received payload data: {data}")
        print(f"Received payload data: {data}")

        if not ciphertext or not reader_id:
            logging.error("Missing required fields")
            return jsonify(
                {
                 "success": False,
                 "message": "Missing required fields"
                 }), 400
            
        
        logging.info(f"Payload received from reader {reader_id}")


        # check if reader is authorized and get readtype = serviceType
        serviceType = check_reader(reader_id) #ie Payment, Auth, RollCall
        if not serviceType:
            logging.error("Unauthorized reader")
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }), 403
            
        
        logging.info(f"Reader {reader_id} authorized for {serviceType}")
        # serviceType="Payment"  # hardcoded for now, we can use check_reader to get the serviceType

        if amount and serviceType != "Payment":
            return jsonify({
                "success": False,
                "message": "Reader not authorized to process payments"
            }), 403

        is_payment = amount is not None

        # decrypt data_in_bytes
        # private_key="string"
        data_inHexbytes = decrypt_with_private_key(ciphertext, private_key)
        logging.info(f"Decrypted payload data: {data_inHexbytes}")
        if not data_inHexbytes:
            logging.error("Invalid payload")
            return jsonify({
                "success": False,
                "message": "Invalid Payload"
            }), 400
            
        
        # create data info
        separator = data_inHexbytes.index(b'|')

        student_id = data_inHexbytes[:separator].decode("utf-8")
        logging.info(f"Extracted student_id: {student_id}")

        remaining = data_inHexbytes[separator + 1:]

        if len(remaining) != 29:
            logging.error(
                f"Malformed payload: expected 29 bytes, got {len(remaining)}"
            )
            return jsonify({
                "success": False,
                "message": "Malformed Payload"
            }), 400

        nonce = remaining[:16]
        logging.info(f"Extracted nonce: {nonce}")

        # timestamp = int.from_bytes(
        #     remaining[16:29],
        #     byteorder="big"
        # )

        timestamp_ms = int(
            remaining[16:].decode("utf-8")
        )

        timestamp = timestamp_ms // 1000

        logging.info(f"Extracted timestamp: {timestamp}")

        MAX_TIME_DIFF = 20  # suggested by Lynne

        current_timestamp = int(time.time())

        if abs(current_timestamp - timestamp) > MAX_TIME_DIFF:
            logging.warning(
                f"Expired payload. student={student_id}"
            )

            return jsonify({
                "success": False,
                "message": "Expired request"
            }), 401
        
        # nonce = base64.b64encode(nonce)
        nonce = base64.b64encode(nonce).decode("utf-8")
        if check_nonce(nonce):
            logging.warning(
                f"token used. reader={reader_id}, student={student_id}"
            )

            return jsonify({
                "success": False,
                "message": "Payload used"
            }), 403
        
        # create session, student_id, nonce, timestamp ie status, reason and get session_id
        # if serviceType == "Payment":
            # get service_id using the reader_id
        service_id = get_service_id(reader_id)

        if not service_id:
            logging.error("No service for this reader")
            return jsonify({
                "success": False,
                "message": "No service for this reader"
            }), 400
            
        # create service session service_id, student_id, timestamp, nonce, status=pending
        session_id = create_service_session(service_id, student_id, nonce, timestamp)
        # use student_id check if student is authorized for the serviceType and also return student info
        student_check = check_student(student_id, serviceType)
        reason = student_check["reason"]
        status = student_check["status"]
        if not student_check["authorized"]:
            update_service_session(session_id, reason, status)
            logging.warning(            # return {"error": "Payload used"}, 403
                f"Student auth failed: {student_check['reason']}"
            )
            return jsonify({
                "success": False,
                "message": "Student Unauthorized"
            }), 403

        # add device_id check this is mobile deviceid check added it today date 31/7/2026
        student = student_check["student"]
        
        check_device = check_device_id(student_id)
        if not check_device:
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }), 403
        
        # update service session if success in student is authorized we place status success + reason or fail + reason
        update_service_session(session_id, reason, status)
        #  if success insert transaction table placing the amount(ie is expense so append - eg -400), student_id, title, category + service_id
        title = None
        body = None
        channelId = None
        priority = "high"

        if serviceType == "Payment" and is_payment:
            if amount is None:
                return jsonify({
                    "success": False,
                    "messsage": "Amount required"
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

            transaction_id =1
            payment_method = "NFC"
            campus_id = student_campus(student_id)

            wallet_data = get_wallet_data(student_id)
            balance = float(wallet_data["balance2"])
            if balance >= amount:
                insert_expense_transaction(transaction_id, student_id, campus_id, amount, "COMPLETE", payment_method, session_id)
                logging.info(f"Payment of {amount} recorded for {student_id}")

            elif balance < amount:
                logging.info("Not sufficient funds")
                return jsonify({
                    "success": False,
                    "error": "Insufficient funds"
                }), 200

            title = "NFC Payment successful"
            body = f"Your payment of KES {amount:.2f} was successfully processed."
            channelId = "payments"
            priority = "high"
            data ={
                "type": "payment",
                "id": session_id,
                "amount": amount
            }
        else:
            title= "Access Granted"
            body = f"User {student_id} authorized"
            channelId="access"
            priority="high"
            data={
                "type": "access",
                "id": session_id
            }
            
        # all records in transaction with service_id != null are considered student expenses(the campuses legal money), ==null this are students active money
        logging.info(
            f"Session {session_id} completed successfully."
        )

        if send_expo_notification_to_one(student_id, title, body, channelId, priority, data):
            print("notification sent")
        else:
            print("notification failed")

        return ({
            "success": True,
            "session_id": session_id
        }), 200
    
    except Exception as e:
        logging.exception(e)
        return jsonify({
            "success": False,
            "message": "Server Error"
        }), 500
# perfect backend codes