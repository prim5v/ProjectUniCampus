# from flask import request, jsonify, current_app
# from backend.utils.jwt_setup import access_token_required
# from backend.modules.mpesaStkPush.statusCheckModule import check_status
# socketio = current_app.extensions["socketio"]

# @socketio.on("check_status")
# def status():
#     payload = request.get_json()
#     return check_status(payload)