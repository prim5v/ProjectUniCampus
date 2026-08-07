from backend.routes.student import student_bp
from backend.utils.jwt_setup import access_token_required
from backend.modules.student.getProfileModule import get_profile_module
from flask import request, g
from backend.utils.limiter import limiter


@student_bp.route("/get/profile", methods=["GET"])
@limiter.limit("10 per minute")
@access_token_required
def get_profile():
    student_id = g.user_id
    return get_profile_module(student_id)

