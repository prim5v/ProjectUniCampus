from backend.routes.student import student_bp
from backend.utils.jwt_setup import access_token_required
from backend.modules.student.editProfleModule import profileEdit
from flask import request
from backend.utils.limiter import limiter


@student_bp.route("/edit/profile", methods=["POST"])
@limiter.limit("10 per minute")
@access_token_required
def profile_edit():
    # student_id = g.user_id
    data = request.get_json()
    return profileEdit(data)

