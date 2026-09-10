from backend.routes.admin import admin_bp
from backend.modules.admin.getBuildingModule import buildings_get
from backend.middleware.auth import require_auth
from backend.utils.limiter import limiter

@admin_bp.route("/get/buildings", methods=['GET'])
@limiter.limit("10 per minute")
@require_auth
def get_buildings():
    return buildings_get()

