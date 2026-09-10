from flask import jsonify, g
from backend.controllers.selectcontrollers import buildings
def buildings_get():
    try:
        # get from controller
        campus_id = getattr(g, "user_id", None)
        results = buildings(campus_id)
        if results:
            return jsonify({
                "success":True,
                "message": "buildings select success",
                "buildings": results
            }), 200

    except Exception as e:
        return jsonify(
            {
                "success": False,
                "message": f"Server error: {str(e)}"
            }
        ), 500