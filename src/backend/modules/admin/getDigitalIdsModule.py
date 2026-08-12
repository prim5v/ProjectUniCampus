from flask import jsonify, g, request, json
import logging

from backend.utils.extraFunctions import get_redis
from backend.controllers.selectcontrollers import get_ids

logger = logging.getLogger(__name__)


def get_digital_ids():
    campus_id = getattr(
        g,
        "user_id",
        "user_3HccsKFVqHvcLfKK5is7ywF8c72"
    )

    if not campus_id:
        return jsonify({
            "success": False,
            "message": "campus id required"
        }), 400

    # -----------------------------
    # Pagination
    # -----------------------------

    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 20))

    except ValueError:
        return jsonify({
            "success": False,
            "message": "page and limit must be valid numbers"
        }), 400

    if page < 1:
        return jsonify({
            "success": False,
            "message": "page must be greater than 0"
        }), 400

    if limit < 1 or limit > 100:
        return jsonify({
            "success": False,
            "message": "limit must be between 1 and 100"
        }), 400

    # -----------------------------
    # Redis
    # -----------------------------

    redis_client = get_redis()

    cache_key = (
        f"digital_ids:"
        f"{campus_id}:"
        f"page:{page}:"
        f"limit:{limit}"
    )

    cached = None

    try:
        cached = redis_client.get(cache_key)

    except Exception as redis_error:
        logger.error(
            f"REDIS GET FAILED: {redis_error}"
        )

    # -----------------------------
    # Cache hit
    # -----------------------------

    if cached:
        try:
            rows = json.loads(cached)
            return jsonify(rows), 200

        except Exception as cache_error:
            logger.error(
                f"REDIS JSON PARSE FAILED: {cache_error}"
            )

    # -----------------------------
    # Cache miss
    # -----------------------------

    digital_ids = get_ids(
        campus_id=campus_id,
        page=page,
        limit=limit
    )

    if digital_ids is None:
        return jsonify({
            "success": False,
            "message": "Failed to fetch digital IDs"
        }), 500

    # -----------------------------
    # No digital IDs
    # -----------------------------

    if not digital_ids["data"]:
        result = {
            "success": True,
            "message": "No digital IDs found",
            "data": [],
            "pagination": digital_ids["pagination"]
        }

        try:
            redis_client.set(
                cache_key,
                json.dumps(result),
                ex=900
            )

        except Exception as redis_error:
            logger.error(
                f"REDIS SET FAILED: {redis_error}"
            )

        return jsonify(result), 200

    # -----------------------------
    # Format response
    # -----------------------------

    response = []

    for student in digital_ids["data"]:

        response.append({
            "id": student.get("id"),
            "campus_id": student.get("campus_id"),
            "student_id": student.get("student_id"),
            "username": student.get("username"),
            "isActive": student.get("isActive"),
            "nfc_status": student.get("nfc_status"),
            "account_status": student.get("account_status"),
            "onBoardedWhen": (
                student["onBoardedWhen"].isoformat()
                if student.get("onBoardedWhen")
                else None
            )
        })

    # -----------------------------
    # Final response
    # -----------------------------

    result = {
        "success": True,
        "data": response,
        "pagination": digital_ids["pagination"]
    }

    # -----------------------------
    # Cache response
    # -----------------------------

    try:
        redis_client.set(
            cache_key,
            json.dumps(result),
            ex=900
        )

    except Exception as redis_error:
        logger.error(
            f"REDIS SET FAILED: {redis_error}"
        )

    return jsonify(result), 200