from flask import jsonify, g
from backend.controllers.insertcontrollers import insert_building

def building_add(data):

    name = data.get("name")
    code = data.get("code")
    address = data.get("address")
    campus_id = getattr(g, "user_id", None)

    try:
        if not name or not code or not address:
            return jsonify({
                "success": False,
                "message": "required fields missing"
            }), 400

        if not campus_id:
            return jsonify({
                "success": False,
                "message":"campus_id missing"
            })


        # insert to db
        success = insert_building(campus_id, name, code, address)
        if success:
            return jsonify({
                "success": True,
                "message": "building insert successfull"
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Error inserting building record"
            }), 200

    except Exception as e:
        return jsonify({
                    "success": False,
                    "message": f"Server error: {str(e)}"
                }), 500