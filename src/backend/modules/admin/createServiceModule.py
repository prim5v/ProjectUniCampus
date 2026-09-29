from flask import jsonify
from backend.controllers.insertcontrollers import service_create

def createService(data):
    service_id = data.get("service_id")
    reader_id = data.get("reader_id")
    designation_name = data.get("designation_name")

    try:
        if service_create(service_id, reader_id, designation_name):
            return jsonify({
                "success": True,
                "message": "service created successfully"
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Error creating service"
            }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server Error: {str(e)}"
        }), 500