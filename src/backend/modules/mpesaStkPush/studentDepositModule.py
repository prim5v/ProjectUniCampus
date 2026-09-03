from flask import g, jsonify
from decimal import Decimal
import os
import requests
from requests.auth import HTTPBasicAuth
import base64
from backend.controllers.insertcontrollers import insert_transaction_record
from backend.controllers.selectcontrollers import student_campus
from datetime import datetime
def stk_push(payload):
    phone = payload.get("phone")
    amount = payload.get("amount")
    user_id = getattr(
        g,
        "student_id",
        None
    )

    if not phone or not amount:
        return jsonify({"error": "Missing phone number or amount"}), 400

    if not user_id:
        return jsonify({"error": "Missing student_id"}), 400

    try:

        try:
            amount = Decimal(str(amount))
            if amount <= 0:
                return {"error": "Invalid amount"}, 400
        except:
            return {"error": "Amount must be numeric"}, 400

        # credentials
        consumer_key = os.getenv("MPESA_CONSUMER_KEY")
        consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
        passkey = os.getenv("MPESA_PASSKEY")
        short_code = os.getenv("BUSINESS_SHORT_CODE")
        callback_url = os.getenv("MPESA_CALLBACK_URL")

        if not all([consumer_key, consumer_secret, passkey, short_code]):
            return {"error": "MPESA credentials not configured"}, 500


        # 🔐 AUTH
        auth_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        auth_response = requests.get(
            auth_url,
            auth=HTTPBasicAuth(consumer_key, consumer_secret),
            timeout=10
        )

        access_token = auth_response.json().get("access_token")

        # 🔐 PASSWORD
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        raw = f"{short_code}{passkey}{timestamp}"
        encoded_pwd = base64.b64encode(raw.encode()).decode()

        payload = {
            "BusinessShortCode": short_code,
            "Password": encoded_pwd,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone,
            "PartyB": short_code,
            "PhoneNumber": phone,
            "CallBackURL": callback_url,
            "AccountReference": user_id,
            "TransactionDesc": f"Payment of {amount} for user {user_id}"
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        stk_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        # stk_url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

        response = requests.post(stk_url, json=payload, headers=headers, timeout=15)
        mpesa_response = response.json()

        # ❌ FAILED
        if mpesa_response.get("ResponseCode") != "0":
            return {"error": "STK push failed", "details": mpesa_response}, 400

        # ✅ SUCCESS
        campus_id = student_campus(user_id)
        checkout_request_id = mpesa_response.get("CheckoutRequestID")

        record_inserted = insert_transaction_record(
                transaction_id=1,
                student_id=user_id,
                campus_id=campus_id,
                amount=amount,
                status="PENDING",
                payment_method="M-PESA",
                invoice_id=checkout_request_id,
                phone=phone,
            )

        if record_inserted:
            return jsonify({
                "message": "STK push initiated successfully",
                "checkout_request_id": checkout_request_id,
                "status": "PENDING"
            }), 200
        else:
            return jsonify({"error": "Failed to insert transaction record"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500