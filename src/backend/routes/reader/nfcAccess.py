from backend.routes.reader import reader_bp
from backend.modules.reader.nfcAccessModule import access_payload
from flask import request
from backend.utils.limiter import limiter

@reader_bp.route("/nfc/access", methods=['POST'])
@limiter.limit("20 per minute")
def nfcA():
    data = request.get_json()
    return access_payload(data)