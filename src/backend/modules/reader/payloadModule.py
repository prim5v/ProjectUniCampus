import logging
from backend.utils.extraFunctions import decrypt_with_private_key
from backend.controllers.selectcontrollers import check_reader, get_service_id, check_student, check_nonce
from backend.controllers.insertcontrollers import create_service_session, insert_expense_transaction
from backend.controllers.updatecontrollers import update_service_session
import time
import base64
from pathlib import Path
from backend.controllers.selectcontrollers import check_device_id

# BACKEND_ROOT = Path(__file__).resolve().parent.parent
# PRIVATE_KEY_PATH = BACKEND_ROOT / "private_key.pem"

# with open(PRIVATE_KEY_PATH, "rb") as f:
#     private_key = f.read()

# from pathlib import Path
import os


# Render mounts secret files at /etc/secrets/
PRIVATE_KEY_PATH = Path("/etc/secrets/private_key.pem")

# Fallback to a local workspace path for your local development 
if not PRIVATE_KEY_PATH.exists():
    BACKEND_ROOT = Path(__file__).resolve().parent.parent
    PRIVATE_KEY_PATH = BACKEND_ROOT / "private_key.pem"

with open(PRIVATE_KEY_PATH, "rb") as f:
    private_key = f.read()
    # Your implementation here


def get_payload(data):
    try:
        ciphertext =data.get("dataInBytes")
        reader_id = data.get("reader_id")
        amount = data.get("amount") # we use amount if serviceType is Payment

        logging.info(f"Received payload data: {data}")

        if not ciphertext or not reader_id:
            logging.error("Missing required fields")
            return {"error": "Missing required fields"}, 400
            
        
        logging.info(f"Payload received from reader {reader_id}")


        # check if reader is authorized and get readtype = serviceType
        # serviceType= check_reader(reader_id) #ie Payment, Auth, RollCall
        # if not serviceType:
        #     logging.error("Unauthorized")
        #     return {"error": "Unauthorized"}, 403
            
        
        # logging.info(f"Reader {reader_id} authorized for {serviceType}")
        serviceType="Payment"  # hardcoded for now, we can use check_reader to get the serviceType

        # decrypt data_in_bytes
        # private_key="string"
        data_in_bytes = decrypt_with_private_key(ciphertext, private_key)
        logging.info(f"Decrypted payload data: {data_in_bytes}")
        if not data_in_bytes:
            logging.error("Invalid payload")
            return {"error": "Invalid payload"}, 400
            
        
        # create data info
        separator = data_in_bytes.index(b'|')

        student_id = data_in_bytes[:separator].decode("utf-8")
        logging.info(f"Extracted student_id: {student_id}")

        remaining = data_in_bytes[separator + 1:]

        if len(remaining) != 29:
            logging.error(
                f"Malformed payload: expected 29 bytes, got {len(remaining)}"
            )
            return {"error": "Malformed payload"}, 400

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
            return {"error": "Expired request"}, 401
        
        # nonce = base64.b64encode(nonce)
        nonce = base64.b64encode(nonce).decode("utf-8")
        if check_nonce(nonce):
            logging.warning(
                f"Replay attack detected. reader={reader_id}, student={student_id}"
            )
            return {"error": "Payload used"}, 403
        
        # create session, student_id, nonce, timestamp ie status, reason and get session_id
        # if serviceType == "Payment":
            # get service_id using the reader_id
        service_id = get_service_id(reader_id)

        if not service_id:
            logging.error("No service for this reader")
            return {"error": "No Service For this reader"}, 400
            
        # create service session service_id, student_id, timestamp, nonce, status=pending
        session_id = create_service_session(service_id, student_id, nonce, timestamp)
        # use student_id check if student is authorized for the serviceType and also return student info
        student_check = check_student(student_id, serviceType)
        if not student_check["authorized"]:
            reason = student_check["reason"]
            update_service_session(session_id, reason)
            logging.warning(
                f"Student auth failed: {student_check['reason']}"
            )
            return {"error": "Student Unauthorized"}, 403

        # add device_id check this is mobile deviceid check added it today date 31/7/2026
        student = student_check["student"]
        
        check_device = check_device_id(student["device_id"])
        if not check_device:
            return {"error": "Unauthorized"}, 403
        
        # update service session if success in student is authorized we place status success + reason or fail + reason
        reason=student_check["reason"]
        update_service_session(session_id, reason)
        #  if success insert transaction table placing the amount(ie is expense so append - eg -400), student_id, title, category + service_id
        if serviceType == "Payment":
            if amount is None:
                return {"error": "Amount required"}, 400

            try:
                amount = float(amount)
            except (ValueError, TypeError):
                return {"error": "Invalid amount"}, 400

            if amount <= 0:
                return {"error": "Invalid amount"}, 400
            insert_expense_transaction(student_id, amount, session_id)
            logging.info(
                f"Payment of {amount} recorded for {student_id}"
            )
        # all records in transaction with service_id != null are considered student expenses(the campuses legal money), ==null this are students active money
        logging.info(
            f"Session {session_id} completed successfully."
        )

        return {
            "success": True,
            "session_id": session_id
        }, 200
    
    except Exception as e:
        logging.exception(e)
        return {"error": "Server error"}, 500
# perfect backend codes