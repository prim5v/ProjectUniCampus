import logging
import secrets

from flask import jsonify, g

from backend.controllers.insertcontrollers import (
    create_campus_account,
)
from backend.utils.db import get_db_cursor

logger = logging.getLogger(__name__)


def create_campus(data):
    clerk_id = getattr(g, "user_id", None)
    # email = getattr(g, "email", None)
    email = data.get('email')

    if not clerk_id:
        return jsonify({
            "error": "Missing user_id from token"
        }), 401

    if not email:
        return jsonify({
            "error": "Email is required"
        }), 400

    required_fields = [
        "campus_name",
        "institution_type",
        "estimated_population",
        "primary_phone",
        "service_ids",
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "error": f"{field} is required"
            }), 400

    if not isinstance(data["service_ids"], list):
        return jsonify({
            "error": "service_ids must be an array"
        }), 400

    if not data["service_ids"]:
        return jsonify({
            "error": "At least one service must be selected"
        }), 400

    primary_phone = data["primary_phone"]
    secondary_phone = data.get("secondary_phone")

    if secondary_phone:
        phone_number = f"{primary_phone}, {secondary_phone}"
    else:
        phone_number = primary_phone

    # Campus admin role
    role = f'{data["campus_name"]}_admin'

    # Generate security token on the backend
    security_token = secrets.token_urlsafe(48)

    try:
        # Validate selected services
        conn, cursor = get_db_cursor()

        if not conn:
            return jsonify({
                "error": "Database connection failed"
            }), 500

        try:
            service_ids = data["service_ids"]

            placeholders = ", ".join(
                ["%s"] * len(service_ids)
            )

            cursor.execute(
                f"""
                SELECT id
                FROM services
                WHERE id IN ({placeholders})
                  AND is_active = TRUE
                """,
                tuple(service_ids),
            )

            valid_services = cursor.fetchall()

        finally:
            cursor.close()
            conn.close()

        valid_service_ids = {
            row["id"] if isinstance(row, dict) else row[0]
            for row in valid_services
        }

        invalid_service_ids = [
            service_id
            for service_id in service_ids
            if service_id not in valid_service_ids
        ]

        if invalid_service_ids:
            return jsonify({
                "error": "One or more selected services are invalid",
                "invalid_service_ids": invalid_service_ids,
            }), 400

        create_campus_account(
            data={
                **data,
                "phone_number": phone_number,
            },
            email=email,
            campus_id=clerk_id,
            security_token=security_token,
            role=role,
        )

        logger.info(
            "CAMPUS_ONBOARDING_COMPLETED",
            extra={
                "clerk_id": clerk_id,
                "campus_id": data["campus_id"],
            },
        )

        return jsonify({
            "message": "Campus account created successfully",
            "campus_id": data["campus_id"],
        }), 201

    except Exception:
        logger.exception(
            "CAMPUS_ONBOARDING_FAILED",
            extra={
                "clerk_id": clerk_id,
                "campus_id": data.get("campus_id"),
            },
        )

        return jsonify({
            "error": "Failed to create campus account"
        }), 500