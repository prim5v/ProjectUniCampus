from flask import jsonify, g
from backend.controllers.insertcontrollers import insert_reader
def reader_add(data):

    reader_id = data.get("reader_id")
    reader_name = data.get("reader_name")
    building_id = data.get("building_id")
    reader_type = data.get("reader_type")
    service_type = data.get("service_type")
    designation = data.get("designation")
    campus_id = getattr(g, "user_id", None)

    try:
        if not reader_id or not reader_name or not building_id:
            return jsonify({
                "success": False,
                "message": "required fields missing"
            }), 400

        if not reader_type or not service_type or not designation:
            return jsonify({
                "success": False,
                "message": "required fields missing1"
            }), 400

        if not campus_id:
            return jsonify({
                "success": False,
                "message": "campus_id required"
            }), 400

        # insert reader
        success = insert_reader(reader_id, campus_id, reader_name, reader_type, service_type, designation, building_id)
        if success:
            return({
                "success": True,
                "message": "reader record insert success"
            }), 200
        else:
            return({
                "success": False,
                "message": "reader record insert failed"
            }), 200

    except Exception as e:
        return jsonify(
            {
                "success": False,
                "message": f"Server error: {str(e)}"
            }
        ), 500