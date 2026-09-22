from backend.routes.reader import reader_bp
from backend.modules.reader.getInitializedModule import readerInitialize
from flask import request
from backend.utils.limiter import limiter

@reader_bp.route("/initialize/reader", methods = ['POST'])
# @limiter.limit("10 per minute")
def initializeReader():
    data = request.get_json()
    reader_id = data.get("reader_id")
    return readerInitialize(reader_id)