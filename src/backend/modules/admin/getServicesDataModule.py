from flask import jsonify
from backend.controllers.selectcontrollers import services_data
def get_services_data(data):
    service_id = data.get("service_id")

    try:
        services_data = services_data(service_id)
        if services_data:
            return jsonify({
                "success": True,
                "message": "services data found",
                "services_data": services_data or []
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "services data not found"
            }), 404

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"server error {str(e)}"
        }), 500