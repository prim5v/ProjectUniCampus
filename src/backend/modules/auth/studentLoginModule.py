import logging
from flask import jsonify, request
from backend.controllers.selectcontrollers import login_check, check_device_id
from backend.controllers.insertcontrollers import insert_into_student_login_sessions, insert_into_student_devices
from backend.utils.jwt_setup import generate_refresh_token
import uuid
from backend.utils.extraFunctions import get_device_info
def student_login(data):
    try:
        username = data.get("username")
        pwd = data.get("pwd")

        if not username or not pwd:
            return jsonify({"error": "Missing required fields"}), 400

        username = username.strip()

        if len(username) > 255 or len(pwd) > 128:
            return jsonify({"error": "Invalid input"}), 400

        user = login_check(username, pwd)

        if user is None:
            return jsonify({"error": "Invalid credentials"}), 401


        # Generate JWT refresh token
        # requirments ie user_id, device_id, session_id
        # device_id = request.headers.get("device_id") or f"DEV-{uuid.uuid4().hex[:10].upper()}"

        # get deviceinfo
        device_info = get_device_info()
        
        session_id = str(uuid.uuid4())
        student_id = user["student_id"]

        refresh_token, token_hash, token_expiry = generate_refresh_token(student_id, device_info["device_id"], session_id)

        

        
        # check 1st if device_id exists for that student,
        record = check_device_id()
        if not record:
            # insert into student devices
            insert_into_student_devices(student_id, device_info["device_id"], device_info["device_name"], device_info["platform"], device_info["app_version"], device_info["ip"], device_info["user_agent"])
        # one student_id can have as many device_ids,
        # only one device_id record for the whole table

        # insert into login sessions
        insert_into_student_login_sessions(session_id, student_id, device_info["device_id"], token_hash, token_expiry)


        # device info:
        # device_id, device_name, platform
        # app_version, browser, os, device, device_brand,
        # device_model, ip, location, user_agent



        
        # Update last_login
        # Return user info

        return jsonify({
            "message": "Login successful",
            "status": "success",
            "device_id": device_info["device_id"],
            "refresh_token": refresh_token
        }), 200

    except Exception as e:
        logging.exception(e)
        return jsonify({"error": "Server error"}), 500