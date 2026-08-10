from flask import request
from backend.routes.admin import admin_bp
from backend.modules.admin.addSingleStudentModule import add_single_student
from backend.utils.limiter import limiter
from backend.middleware.auth import require_auth, require_role

@admin_bp.route("/add/single/student", methods=['POST'])
@limiter.limit("10 per minute")
@require_auth
def student_add():
    data = request.get_json()
    return add_single_student(data)