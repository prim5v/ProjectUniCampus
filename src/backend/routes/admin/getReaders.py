from flask import request
from backend.routes.admin import admin_bp
from backend.modules.admin.getReadersModule import readers_get
from backend.middleware.auth import require_auth
from backend.utils.limiter import limiter

@admin_bp.route("/get/readers", methods=['GET'])
@limiter.limit("10 per minute")
@require_auth
def get_readers():
    data = request.get_json()
    return readers_get()

