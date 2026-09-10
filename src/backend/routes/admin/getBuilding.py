from flask import request
from backend.routes.admin import admin_bp
from backend.modules.admin.getBuildingModule import buildings_get
from backend.middleware.auth import require_auth
from backend.utils.limiter import limiter

@admin_bp.route("/get/buildings", methods=['GET'])
@limiter.limit("10 per minute")
@require_auth
def get_buildings():
    data = request.get_json()
    return buildings_get()

