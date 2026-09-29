from flask import request

from backend.routes.admin import admin_bp
from backend.modules.admin.createServiceModule import createService
from backend.utils.limiter import limiter
from backend.middleware.auth import require_auth

@admin_bp.route("/create/service", methods=['POST'])
@limiter.limit("20 per minute")
@require_auth
def service():
    data = request.get_json()
    return createService(data)