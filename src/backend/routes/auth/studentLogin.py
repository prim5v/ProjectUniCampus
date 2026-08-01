
from backend.routes.auth import auth_bp
from flask import request
from backend.modules.auth.studentLoginModule import student_login

@auth_bp.route("/student/login", methods=['POST'])
def login_student():
    data = request.get_json()
    return student_login(data)