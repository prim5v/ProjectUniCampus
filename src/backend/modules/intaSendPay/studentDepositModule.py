from flask import jsonify, g
from backend.utils.instasend_setup import intasend
from backend.controllers.insertcontrollers import insert_transaction_record
from backend.controllers.selectcontrollers import student_campus
def trigger_deposit(data):
    # user_id = "user_123"  # Simulated logged-in user session
    phone_number = data.get("phone_number")  # Format: 2547XXXXXXXX
    amount = data.get("amount")
    user_id = getattr(
        g,
        "student_id",
        None
    )

    # Get the campus ID for the student
    campus_id = student_campus(user_id)

    intasend_service = intasend()
    
    if not phone_number or not amount:
        return jsonify({"error": "Missing phone number or amount"}), 400
    
    try:
            # 1. Trigger the STK push via IntaSend
            response = intasend_service.collect.mpesa_stk_push(
                phone_number=phone_number,
                amount=amount,
                narrative="Wallet Deposit",
                email="developer@example.com"
            )
            
            # 2. Extract invoice unique details
            invoice_id = response.get('id') or response.get('invoice', {}).get('invoice_id')
            
            # 3. Log transaction in transactions_data table
            insert_transaction_record(
                transaction_id=1,
                student_id=user_id,
                campus_id=campus_id,
                amount=amount,
                status="PENDING",
                payment_method="M-PESA",
                invoice_id=invoice_id
            )
            
            return jsonify({
                "message": "STK push initiated successfully",
                "invoice_id": invoice_id,
                "status": "PENDING"
            }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500