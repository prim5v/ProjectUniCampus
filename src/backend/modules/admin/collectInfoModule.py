from flask import jsonify
from backend.controllers.insertcontrollers import insert_info
def info(data):
    name = data.get("name")
    institution = data.get("institution")
    email = data.get("email")
    interest = data.get("interest")
    message = data.get("message")
    try:

        if not name or not institution or not email:
            return jsonify({
                "success": False,
                "message": "missing required fields"
            }), 400

        if insert_info(name, institution, email, interest, message):
            return jsonify({
                "success": True,
                "message": "submit successfully"
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "submit error"
            }), 400
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error, {str(e)}"
        }), 500
    