from flask import request

from backend.routes.admin import admin_bp
from backend.modules.admin.getDigitalIdsModule import get_digital_ids
from backend.utils.limiter import limiter
from backend.middleware.auth import require_auth


@admin_bp.route("/get/digital/ids", methods=["GET"])
@limiter.limit("20 per minute")
# @require_auth
def ids_get():

    return get_digital_ids()