from flask import jsonify
from backend.controllers.selectcontrollers import services_get

def getServices():

    try:
        services = services_get()
        if not services():
            return jsonify({
                "success": False,
                "message": "no services found"
            }), 404
        else:
            return jsonify({
                "success": True,
                "message": "services found",
                "services": services or []
            }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500