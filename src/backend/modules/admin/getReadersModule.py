from flask import jsonify, g
from backend.controllers.selectcontrollers import readers

def readers_get():
    try:
        campus_id = getattr(g, "user_id", None)
        results = readers(campus_id)
        if results:
            return jsonify({
                "success": True,
                "message": "readers select success",
                "readers": results
            }), 200

    except Exception as e:
        return jsonify(
            {
                "success": False,
                "message": f"Server error: {str(e)}"
            }
        ), 500   