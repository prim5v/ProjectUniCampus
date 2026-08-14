from backend.utils.extraFunctions import get_redis
from backend.controllers.selectcontrollers import get_students
from flask import jsonify, g, request, json
import logging

logger = logging.getLogger(__name__)


def get_students_data():
    campus_id = getattr(g, "user_id", "user_3HccsKFVqHvcLfKK5is7ywF8c72")

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

    cache_key = f"students_data:{campus_id}:page:{page}:limit:{limit}"

    cached = None

    try:
        cached = redis_client.get(cache_key)

    except Exception as redis_error:
        logger.error(f"REDIS GET FAILED: {redis_error}")

    # -----------------------------
    # Cache hit
    # -----------------------------

    if cached:
        rows = json.loads(cached)
        return jsonify(rows), 200

    # -----------------------------
    # Cache miss
    # -----------------------------

    students = get_students(
        campus_id=campus_id,
        page=page,
        limit=limit
    )

    if not students:
        return jsonify({
            "success": True,
            "message": "No students found",
            "data": [],
            "pagination": {
                "page": page,
                "limit": limit,
                "total": 0,
                "total_pages": 0
            }
        }), 200

    response = []

    for student in students["data"]:
        response.append({
            "id": str(student["_id"]),
            "first_name": student.get("first_name"),
            "middle_name": student.get("middle_name"),
            "last_name": student.get("last_name"),
            "admission_number": student.get("admission_number"),
            "university_email": student.get("university_email"),
            "faculty": student.get("faculty"),
            "course": student.get("course"),
            "expiry": student.get("expiry"),
            "digitalId_created": student.get("digitalId_created", False),
            "created_at": (
                student["created_at"].isoformat()
                if student.get("created_at")
                else None
            ),
        })

    result = {
        "success": True,
        "data": response,
        "pagination": students["pagination"]
    }

    # -----------------------------
    # Cache response
    # -----------------------------

    try:
        redis_client.set(
            cache_key,
            json.dumps(result),
            ex=300
        )

    except Exception as redis_error:
        logger.error(f"REDIS SET FAILED: {redis_error}")

    return jsonify(result), 200