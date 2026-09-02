from flask import jsonify, g, json
import logging

from backend.controllers.selectcontrollers import get_wallet_data
from backend.utils.extraFunctions import get_redis

logger = logging.getLogger("Wallet")


def wallet():

    student_id = getattr(
        g,
        "user_id",
        None
    )


    if not student_id:
        return jsonify({
            "success": False,
            "message": "Student ID required"
        }), 400


    redis_client = get_redis()

    cache_key = f"wallet:{student_id}"


    # -----------------------------
    # Redis GET
    # -----------------------------
    try:
        cached = redis_client.get(cache_key)

    except Exception as redis_error:
        logger.error(
            f"REDIS GET FAILED: {redis_error}"
        )
        cached = None



    # -----------------------------
    # Cache hit
    # -----------------------------
    if cached:

        try:
            return jsonify(
                json.loads(cached)
            ), 200

        except Exception as cache_error:

            logger.error(
                f"CACHE PARSE FAILED: {cache_error}"
            )


    # -----------------------------
    # Cache miss
    # -----------------------------

    wallet_data = get_wallet_data(student_id)


    if wallet_data is None:

        return jsonify({

            "success": False,
            "message": "Failed to retrieve wallet"

        }), 500



    result = {

        "success": True,

        "data": wallet_data

    }



    # -----------------------------
    # Redis SET
    # -----------------------------

    try:

        redis_client.set(

            cache_key,

            json.dumps(result),

            ex=120

        )


    except Exception as redis_error:

        logger.error(

            f"REDIS SET FAILED: {redis_error}"

        )



    return jsonify(result), 200