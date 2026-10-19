from flask import request
from backend.modules.admin.collectInfoModule import info
from backend.utils.limiter import limiter
from backend.routes.admin import admin_bp
from backend.middleware.auth import require_auth

@admin_bp.route("/collect/info", methods=['POST'])
@limiter.limit("20 per minute")
@require_auth
def collect():
    data = request.get_json()
    return info(data)