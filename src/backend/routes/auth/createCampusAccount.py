from flask import request
from backend.middleware.auth import require_auth, require_role
from backend.modules.auth.createCampusAccountModule import create_campus
from backend.routes.auth import auth_bp
from backend.utils.limiter import limiter

@auth_bp.route("/create/campus/account", methods=['POST'])
@limiter.limit("10 per minute")
@require_auth
def create_account():
    print("🔥 ROUTE HIT")
    data = request.get_json()
    response = create_campus(data)
    return response

# http://127.0.0.1:5000/auth/clerk/sync