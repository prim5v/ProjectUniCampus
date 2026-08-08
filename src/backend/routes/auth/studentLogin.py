
from backend.routes.auth import auth_bp
from flask import request
from backend.modules.auth.studentLoginModule import student_login
from backend.utils.limiter import limiter

@auth_bp.route("/student/login", methods=['POST'])
@limiter.limit("10 per minute")
def login_student():
    data = request.get_json()
    return student_login(data)