from backend.routes.student import student_bp
from backend.utils.jwt_setup import access_token_required
from backend.modules.student.walletModule import wallet
from flask import request, g
from backend.utils.limiter import limiter


@student_bp.route("/get/wallet", methods=["GET"])
@limiter.limit("10 per minute")
@access_token_required
def my_wallet():
    student_id = g.user_id
    return wallet(student_id)

