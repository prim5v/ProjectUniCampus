import requests
from backend.utils.db import get_db_cursor
import logging

logger = logging.getLogger(__name__)
EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def send_expo_notification(
    expo_push_token,
    title,
    body,
    data=None
):
    payload = {
        "to": expo_push_token,
        "title": title,
        "body": body,
        "sound": "default",
        "data": data or {}
    }

    response = requests.post(
        EXPO_PUSH_URL,
        json=payload,
        headers={
            "Content-Type": "application/json"
        },
        timeout=10
    )

    response.raise_for_status()

    return response.json()





def send_notification_to_all_students(title, body, data=None):
    conn, cursor = get_db_cursor()

    try:
        cursor.execute(
            """
            SELECT DISTINCT push_token
            FROM student_login_sessions
            WHERE push_token IS NOT NULL
            AND push_token != ''
            """
        )

        students = cursor.fetchall()

    except Exception as e:
        logger.error(
            f"Failed to fetch student push tokens: {e}"
        )
        return False

    finally:
        cursor.close()
        conn.close()

    success_count = 0
    failed_count = 0

    for student in students:
        try:
            student_token = student["push_token"]

            send_expo_notification(
                expo_push_token=student_token,
                title=title,
                body=body,
                data=data or {}
            )

            success_count += 1

        except Exception as e:
            failed_count += 1

            logger.error(
                f"Failed to send notification to {student_token}: {e}"
            )

    logger.info(
        f"Broadcast notification completed: "
        f"{success_count} successful, "
        f"{failed_count} failed"
    )

    return success_count > 0






def send_expo_notification_to_one(student_id, title, body, data=None):
    conn, cursor = get_db_cursor()

    student_token = None

    try:
        cursor.execute(
            """
            SELECT push_token
            FROM student_login_sessions
            WHERE student_id = %s
            AND push_token IS NOT NULL
            AND push_token != ''
            """,
            (student_id,)
        )

        student = cursor.fetchone()

        if not student:
            logger.warning(
                f"No login session found for student {student_id}"
            )
            return False

        student_token = student["push_token"]

        send_expo_notification(
            expo_push_token=student_token,
            title=title,
            body=body,
            data=data or {}
        )

        return True

    except Exception as e:
        logger.error(
            f"Failed to send notification to student {student_id}: {e}"
        )
        return False

    finally:
        cursor.close()
        conn.close()





# student_token = session["push_token"]

# send_expo_notification(
#     expo_push_token=student_token,
#     title="Payment successful",
#     body="KSh 500 has been added to your campus wallet.",
#     data={
#         "type": "payment",
#         "transaction_id": transaction.id
#     }
# )