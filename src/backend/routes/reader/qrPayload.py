from backend.routes.reader import reader_bp
from backend.modules.reader.qrPayloadodule import payload
from flask import request
from backend.utils.limiter import limiter

@reader_bp.route("/qr/payload", methods= ['POST'])
# @limiter.limit("10 per minute")
def qr_payload():
    data = request.get_json()
    return payload(data)