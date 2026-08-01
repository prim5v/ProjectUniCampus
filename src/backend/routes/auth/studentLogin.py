
from backend.routes.auth import auth_bp
from flask import request

@auth_bp.route("/student/login", methods=['POST'])
def login_student():
    data = request.get_json()
    return 