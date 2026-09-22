from flask import jsonify
from backend.controllers.selectcontrollers import check_reader

def readerInitialize(reader_id):

    try:
        reader = check_reader(reader_id)
        if reader is None:
            return jsonify({
                "success": False,
                "message": "reader not initialized"
            }), 404
        else:
            return jsonify({
                "success": True,
                "message": "reader initialized"
            }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"server error, {e}"
        }), 500
