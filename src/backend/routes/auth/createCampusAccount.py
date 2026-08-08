from flask import request
from backend.middleware.auth import require_auth, require_role
from backend.modules.auth.createCampusAccountModule import create_campus_account
from backend.routes.auth import auth_bp


@auth_bp.route("/create/campus/account", methods=['POST'])
@require_auth
def create_account():
    print("🔥 ROUTE HIT")
    data = request.get_json()
    response = create_campus_account(data)
    return response

# http://127.0.0.1:5000/auth/clerk/sync