from flask import Blueprint

student_bp = Blueprint("reader", __name__, url_prefix="/student")

from . import getProfile