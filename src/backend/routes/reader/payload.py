from backend.routes.reader import reader_bp
from backend.modules.reader.payloadModule import get_payload
from flask import request
from backend.utils.limiter import limiter

@reader_bp.route("/payload", methods=["POST"])
@limiter.limit("10 per minute")
def payload():
    data = request.get_json()
    return get_payload(data)