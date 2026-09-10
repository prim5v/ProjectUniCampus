from flask import request
from backend.routes.admin import admin_bp
from backend.modules.admin.addReaderModule import reader_add
from backend.utils.limiter import limiter
from backend.middleware.auth import require_auth

@admin_bp.route("/add/reader", methods=['POST'])
@limiter.limit("10 per minute")
@require_auth
def add_reader():
    data = request.get_json()
    return reader_add(data)

