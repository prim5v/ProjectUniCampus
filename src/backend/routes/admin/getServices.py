from backend.modules.admin.getServicesModule import getServices
from backend.routes.admin import admin_bp
from backend.utils.limiter import limiter
from backend.middleware.auth import require_auth

@admin_bp.route("/get/services", methods=['GET'])
@limiter.limit("20 per minute")
@require_auth
def services():
    return getServices()