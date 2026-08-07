
from backend.routes.auth import auth_bp
from flask import request, g
from backend.modules.auth.studentLogOutModule import student_logout
from backend.utils.jwt_setup import refresh_token_required
@auth_bp.route("/student/logout", methods=['POST'])
@refresh_token_required
def logout_student():
    session_id = g.session_id
    return student_logout(session_id)