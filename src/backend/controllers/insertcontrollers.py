import uuid
from utils.db import get_db_cursor

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