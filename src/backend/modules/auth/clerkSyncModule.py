import logging
import time

from flask import jsonify, g

from backend.controllers.selectcontrollers import check_campus_exists

logger = logging.getLogger(__name__)


def clerk_syncing(email):
    start_time = time.time()

    clerk_id = getattr(g, "user_id", None)
    email = getattr(g, "email", None) or email

    logger.info(
        "SYNC_START",
        extra={
            "clerk_id": clerk_id,
            "email_present": bool(email),
        },
    )

    # Validation
    if not clerk_id:
        logger.warning("SYNC_ABORT_NO_USER_ID")

        return jsonify({
            "error": "Missing user_id from token"
        }), 401

    if not email:
        logger.warning(
            "SYNC_ABORT_NO_EMAIL",
            extra={
                "clerk_id": clerk_id
            },
        )

        return jsonify({
            "error": "Email is required"
        }), 400

    try:
        exists = check_campus_exists(clerk_id)

        if exists:
            logger.info(
                "USER_FOUND",
                extra={
                    "clerk_id": clerk_id
                },
            )

            # role = f'{exists["campus_name"]}_admin'
            role = "admin"

            user = {
                "clerk_id": clerk_id,
                "email": email,
                "role": role
            }

            return jsonify({
                "found": True,
                "message": "User found",
                "user": user
            }), 200

        logger.info(
            "USER_NOT_FOUND",
            extra={
                "clerk_id": clerk_id
            },
        )

        return jsonify({
            "found": False,
            "message": "User not found",
        }), 200

    except Exception:
        logger.exception(
            "SYNC_FAILED_EXCEPTION",
            extra={
                "clerk_id": clerk_id
            },
        )

        return jsonify({
            "error": "Failed to check user"
        }), 500

    finally:
        logger.info(
            "SYNC_END",
            extra={
                "clerk_id": clerk_id,
                "duration_ms": round(
                    (time.time() - start_time) * 1000,
                    2,
                ),
            },
        )