import uuid
from backend.utils.db import get_db_cursor, get_mongo_collection
import logging
from datetime import datetime, timezone


logger = logging.getLogger(__name__)

def create_service_session(service_id, student_id, nonce, timestamp):
    conn, cursor = get_db_cursor()

    if conn is None:
        return None
    
    try:
        session_id = uuid.uuid4().hex[:8].upper()
        cursor.execute(
            """
            INSERT INTO service_sessions
            (service_id, session_id, student_id, timestamp, nonce, status)
            VALUES(%s, %s, %s, %s, %s, %s)
            """,
            (service_id, session_id, student_id, timestamp, nonce, "pending")
        )
        conn.commit()
        return session_id

    finally:
        cursor.close()
        conn.close()

def insert_expense_transaction(student_id, amount, session_id):
    conn, cursor = get_db_cursor()

    if conn is None:
        return False

    try:
        title = "Student Purchase"
        category = "Purchase"

        # Store expenses as negative amounts
        amount = -abs(amount)

        cursor.execute(
            """
            INSERT INTO transactions
            (student_id, session_id, title, amount, category)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (student_id, session_id, title, amount, category)
        )

        conn.commit()

        return cursor.lastrowid

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()



def insert_into_student_login_sessions(session_id, student_id, device_id, token_hash, expires_at):
    conn, cursor = get_db_cursor()
    
    if conn is None:
        return False
    
    try:
        cursor.execute(
            """
            INSERT INTO student_login_sessions
            (session_id, student_id, device_id, token_hash, expires_at)
            VALUES(%s, %s, %s, %s, %s)
            """, 
            (session_id, student_id, device_id, token_hash, expires_at))
        conn.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        conn.close()

def insert_into_student_devices(student_id, device_id, device_name, platform, app_version, ip_address, user_agent):
    conn, cursor = get_db_cursor()
    
    if conn is None:
        return False

    try:
        cursor.execute(
            """
            INSERT INTO students_devices
            (student_id, device_id, device_name, platform, app_version, ip_address, user_agent, is_revoked)
            VALUES(%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (student_id, device_id, device_name, platform, app_version, ip_address, user_agent, False)
            )
        conn.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        conn.close()



def create_campus_account(data, email, campus_id, security_token, role):
    conn, cursor = get_db_cursor()

    if not conn:
        logger.error("DB_CONNECTION_FAILED")
        raise RuntimeError("Database connection failed")

    try:
        campus_name = data["campus_name"]
        institution_type = data["institution_type"]
        estimated_population = data["estimated_population"]
        phone_number = data["phone_number"]
        service_ids = data["service_ids"]


        # Create campus data
        cursor.execute(
            """
            INSERT INTO campus_data (
                campus_id,
                campus_name,
                "isActive",
                "joinedWhen"
            )
            VALUES (
                %s, %s, %s, CURRENT_TIMESTAMP
            )
            """,
            (
                campus_id,
                campus_name,
                True,
            ),
        )


        # Create campus credentials
        cursor.execute(
            """
            INSERT INTO campus_credentials (
                campus_id,
                security_token,
                verified,
                email,
                role,
                phone_number,
                estimated_population,
                institution_type,
                "createdAt"
            )
            VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s,
                CURRENT_TIMESTAMP
            )
            """,
            (
                campus_id,
                security_token,
                False,
                email,
                role,
                phone_number,
                estimated_population,
                institution_type,
            ),
        )

        

        # Create campus service selections
        for service_id in service_ids:
            cursor.execute(
                """
                INSERT INTO campus_services (
                    campus_id,
                    service_id,
                    status,
                    trial_started_at,
                    trial_ends_at,
                    created_at
                )
                VALUES (
                    %s,
                    %s,
                    'trialing',
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP + INTERVAL '30 days',
                    CURRENT_TIMESTAMP
                )
                """,
                (
                    campus_id,
                    service_id,
                ),
            )

        conn.commit()

        logger.info(
            "CAMPUS_ACCOUNT_CREATED",
            extra={
                "campus_id": campus_id,
                "email": email,
                "service_count": len(service_ids),
            },
        )

        return True

    except Exception:
        conn.rollback()

        logger.exception(
            "CAMPUS_ACCOUNT_CREATION_FAILED",
            extra={
                "campus_id": data.get("campus_id"),
            },
        )

        raise

    finally:
        cursor.close()
        conn.close()


def insert_single_student(data):
    try:
        student = get_mongo_collection("students_data")

        result = student.insert_one({
            "first_name": data["first_name"],
            "middle_name": data.get("middle_name"),
            "last_name": data["last_name"],
            "admission_number": data["admission_number"],
            "university_email": data["university_email"],
            "faculty": data["faculty"],
            "course": data["course"],
            "expiry": data["expiry"],
            "created_at": datetime.now(timezone.utc)
        })

        if not result.inserted_id:
            return None

        return result

    except Exception as e:
        logger.error(f"Error inserting student: {e}")
        return None