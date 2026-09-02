from flask import Blueprint

pay_bp = Blueprint("pay", __name__, url_prefix="/pay")

from . import studentDeposit, callback