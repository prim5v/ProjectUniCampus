from flask import request
from backend.routes.admin import admin_bp
from backend.modules.admin.addBuildingModule import building_add
from backend.utils.limiter import limiter
from backend.middleware.auth import require_auth

@admin_bp.route("/add/building", methods=['POST'])
@limiter.limit("10 per minute")
@require_auth
def add_building():
    data = request.get_json()
    return building_add(data)

