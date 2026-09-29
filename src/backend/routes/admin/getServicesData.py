from backend.middleware.auth import require_auth
from flask import request
from backend.utils.limiter import limiter
from backend.modules.admin.getServicesDataModule import get_services_data
from backend.routes.admin import admin_bp

@admin_bp.route("/get/services/data", methods=['POST'])
@limiter.limit("20 per minute")
@require_auth
def services_data():
    data = request.get_json()
    return get_services_data(data)
