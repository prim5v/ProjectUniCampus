
from flask import request
from backend.routes.admin import admin_bp
from backend.modules.admin.editDigitalIdModule import edit_digital_id
from backend.utils.limiter import limiter
from backend.middleware.auth import require_auth

@admin_bp.route("/edit/digitalId", methods=['POST'])
@limiter.limit("10 per minute")
@require_auth
def adminEdit():
    data = request.get_json()
    return edit_digital_id(data)