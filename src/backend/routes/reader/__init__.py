from flask import Blueprint

reader_bp = Blueprint("reader", __name__, url_prefix="/reader")

from . import payload