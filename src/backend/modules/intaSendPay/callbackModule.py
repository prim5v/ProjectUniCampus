from flask import request, jsonify, g
import hmac
import hashlib
import os
from dotenv import load_dotenv
from backend.controllers.selectcontrollers import transaction_lookup
from backend.controllers.updatecontrollers import update_transaction_status

load_dotenv()

INTASEND_WEBHOOK_SIGNATURE_KEY = os.getenv("INTASEND_WEBHOOK_SIGNATURE_KEY")

def callback(payload):

    try:
        signature = request.headers.get('X-IntaSend-Signature')

        # 2. Re-hash the raw incoming data using your secret key to verify authenticity
        raw_payload = request.get_data()
        expected_signature = hmac.new(
            INTASEND_WEBHOOK_SIGNATURE_KEY.encode('utf-8'),
            raw_payload,
            hashlib.sha256
        ).hexdigest()
        
        # 3. Reject if the signatures do not match
        if not signature or not hmac.compare_digest(signature, expected_signature):
            return jsonify({"error": "Unauthorized signature validation failed"}), 401

        invoice_id = payload.get("invoice_id")
        state = payload.get("state")  # Expected: "COMPLETE", "FAILED", etc.
        amount = float(payload.get("value", 0))

        # perform transaction look up
        transaction = transaction_lookup(invoice_id)

        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

    # Avoid processing duplicates if the webhook hits twice
        if transaction["status"] == "COMPLETE":
            return jsonify({"message": "Transaction already processed"}), 200

        # 2. Handle Terminal states and update PostgreSQL tables
        if state == "COMPLETE":
            update_transaction_status(invoice_id, status="COMPLETE", amount=amount)
            return jsonify({"message": "Transaction marked as COMPLETE"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500