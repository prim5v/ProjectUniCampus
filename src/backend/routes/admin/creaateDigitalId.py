from flask import request

from backend.routes.admin import admin_bp
from backend.modules.admin.creaateDigitalIdModule import create_digital_id
from backend.utils.limiter import limiter
from backend.middleware.auth import require_auth


@admin_bp.route("/create/digital/id", methods=["POST"])
@limiter.limit("20 per minute")
@require_auth
def create_id():
    data = request.get_json()
    return create_digital_id(data)