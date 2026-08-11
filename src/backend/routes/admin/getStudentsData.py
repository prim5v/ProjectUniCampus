from flask import request

from backend.routes.admin import admin_bp
from backend.modules.admin.getStudentsDataModule import get_students_data
from backend.utils.limiter import limiter
from backend.middleware.auth import require_auth


@admin_bp.route("/get/students/data", methods=["GET"])
@limiter.limit("10 per minute")
@require_auth
def students_get():

    return get_students_data()