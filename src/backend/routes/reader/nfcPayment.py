from backend.routes.reader import reader_bp
from backend.modules.reader.nfcPaymentModule import payment_payload
from flask import request
from backend.utils.limiter import limiter

@reader_bp.route("nfc/payment", methods=['POST'])
# @limiter.limit("20 per minute")
def nfcP():
    data = request.get_json()
    return payment_payload(data)
