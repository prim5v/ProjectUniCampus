from flask import g, jsonify, request
import logging
import secrets
import string
import bcrypt
import imagekitio
from backend.controllers.insertcontrollers import insert_digital_id
from backend.utils.extraFunctions import generate_student_id, get_redis, get_imagekit
logger = logging.getLogger(__name__)


def create_digital_id(data):
    try:
        campus_id = getattr(g, "user_id", None)

        student_name = data.get("student_name")
        admission_number = data.get("admission_number")
        course = data.get("course")
        year_of_study = data.get("year_of_study")
        university_email = data.get("university_email")
        faculty = data.get("faculty")
        expiry = data.get("expiry")


        # Image comes from multipart/form-data
        image = request.files.get("image")


        logger.info("ImageKit version:", imagekitio.__version__)
        logger.info("ImageKit methods:", dir(imagekit))

        if not campus_id:
            return jsonify({
                "success": False,
                "message": "Campus ID required"
            }), 400

        if not admission_number or not university_email:
            return jsonify({
                "success": False,
                "message": "Admission number and university email are required"
            }), 400

        if not faculty or not course:
            return jsonify({
                "success": False,
                "message": "Faculty and course are required"
            }), 400

        if not expiry:
            return jsonify({
                "success": False,
                "message": "Expiry date is required"
            }), 400

        if not student_name or not year_of_study:
            return jsonify({
                "success": False,
                "message": "Full name and year of study are required"
            }), 400

        # -------------------------------
        # Upload image to ImageKit
        # -------------------------------

        image_url = None

        if image:
            imagekit = get_imagekit()

            image_response = imagekit.files.upload(
                file=image.read(),
                file_name=image.filename,
                folder="/students"
            )

            image_url = image_response.url

        else:
            return jsonify({
                "success": False,
                "message": "Student image is required"
            }), 400


        # --------------------------------
        # Generate student credentials
        # --------------------------------

        username = admission_number.strip().upper()

        # Initial password = lowercase admission number
        initial_password = admission_number.strip().lower()

        # bcrypt password hash
        pwd_hash = bcrypt.hashpw(
            initial_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # Generate student ID
        student_id = generate_student_id()

        # --------------------------------
        # Insert
        # --------------------------------

        result = insert_digital_id(
            student_id,
            campus_id,
            student_name,
            admission_number,
            course,
            year_of_study,
            university_email,
            faculty,
            expiry,
            username,
            pwd_hash,
            image_url
        )

        # Invalidate student cache
        try:
            pattern = f"students_data:{campus_id}:*"
            redis_client = get_redis()

            for key in redis_client.scan_iter(match=pattern):
                redis_client.delete(key)

            logger.info(
                f"Student cache invalidated for campus {campus_id}"
            )

        except Exception as redis_error:
            logger.error(
                f"FAILED TO INVALIDATE STUDENT CACHE: {redis_error}"
            )
            

        if not result:
            return jsonify({
                "success": False,
                "message": "Failed to create digital ID"
            }), 500

        return jsonify({
            "success": True,
            "message": "Digital ID created successfully",
            "student": {
                "student_id": student_id,
                "student_name": student_name,
                "admission_number": admission_number,
                "username": username,
                "course": course,
                "year_of_study": year_of_study,
                "university_email": university_email,
                "faculty": faculty,
                "expiry": expiry
            }
        }), 201

    except Exception as e:
        logger.exception("Server error while creating digital ID")

        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500