
from flask import jsonify, current_app

from backend.controllers.selectcontrollers import transaction_lookup
from backend.controllers.updatecontrollers import update_transaction_status


def stk_callback(payload):

    try:
        socketio = current_app.extensions["socketio"]
        stk = payload.get("Body", {}).get("stkCallback", {})

        result_code = stk.get("ResultCode")
        result_desc = stk.get("ResultDesc")
        invoice_id = stk.get("CheckoutRequestID")
        amount = stk.get("CallbackMetadata", {}).get("Item", [{}])[0].get("Value")
        MpesaReceiptNumber = stk.get("CallbackMetadata", {}).get("Item", [{}])[1].get("Value")

        # transaction look up
        transaction = transaction_lookup(invoice_id)

        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404

        # Avoid processing duplicates if the webhook hits twice
        if transaction["status"] == "COMPLETE":
            return jsonify({"message": "Transaction already processed"}), 200

        if result_code != 0:
            update_transaction_status(invoice_id, status="FAILED", MpesaReceiptNumber=None)

            socketio.emit(
                "callback:status", 
                {"status": "failed", "ResultCode": result_code}, 
                room=invoice_id  # <--- Crucial change
            )
            return jsonify({"ResultCode": result_code, "ResultDesc": result_desc}), 400
        
        elif result_code == 0:
            update_transaction_status(invoice_id, status="COMPLETE", MpesaReceiptNumber=MpesaReceiptNumber)
            socketio.emit(
                "callback:status", 
                {"status": "success", "MpesaReceiptNumber": MpesaReceiptNumber}, 
                room=invoice_id  # <--- Crucial change
            )
            
            return jsonify({"ResultCode": result_code, "ResultDesc": result_desc}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500