from routes.reader import reader_bp
from modules.reader.payloadModule import get_payload
from flask import request


@reader_bp.route("/payload", methods=["POST"])
def payload():
    data = request.get_json()
    return get_payload(data)