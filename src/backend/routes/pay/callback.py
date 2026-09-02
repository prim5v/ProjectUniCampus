from backend.routes.pay import pay_bp
from backend.utils.jwt_setup import access_token_required
from backend.modules.mpesaStkPush.callbackModule import stk_callback
from flask import request
from backend.utils.limiter import limiter

@pay_bp.route("/student/deposit/callback", methods=["POST"])
@limiter.limit("10 per minute")
@access_token_required
def mpesa_callback():
    payload = request.get_json()
    return stk_callback(payload)