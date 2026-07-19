from utils.db import get_db_cursor


def check_reader(reader_id):
    conn, cursor = get_db_cursor()

    if conn is None:
        return None

    try:
        cursor.execute(
            """
            SELECT service_type
            FROM reader_data
            WHERE reader_id = %s
            """,
            (reader_id,)
        )

        reader = cursor.fetchone()

        if reader is None:
            return None

        return reader["service_type"]

    finally:
        cursor.close()
        conn.close()

def get_service_id(reader_id):
    conn, cursor = get_db_cursor()

    if conn is None:
        return None
    
    try:
        cursor.execute(
            """
            SELECT service_id 
            FROM service_data
            WHERE reader_id=%s
            """,
            (reader_id,)
        )
        service = cursor.fetchone()

        if service is None:
            return None
        
        return service["service_id"]
    
    finally:
        cursor.close()
        conn.close()

# def check_student(student_id):
#     conn, cursor = get_db_cursor()

#     if conn is None:
#         return None
    
#     try:
#         cursor.execute(
#             """
#             SELECT * 
#             FROM students_data
#             WHERE student_id=%s
#             AND isActive=1
#             """,
#             (student_id,)
#         )
#         student = cursor.fetchone()
#         if student is None:
#             return False
#         return True

#     finally:
#         cursor.close()
#         conn.close()

def check_nonce(nonce):
    conn, cursor = get_db_cursor()

    if conn is None:
        return None

    try:
        cursor.execute(
            """
            SELECT 1
            FROM service_sessions
            WHERE nonce = %s
            LIMIT 1
            """,
            (nonce,)
        )

        return cursor.fetchone() is not None

    finally:
        cursor.close()
        conn.close()

def check_student(student_id, serviceType):
    conn, cursor = get_db_cursor()

    if conn is None:
        return {
            "authorized": False,
            "reason": "Database connection failed"
        }

    try:
        cursor.execute(
            """
            SELECT 
                student_id,
                isActive,
                nfc_status,
                account_status
            FROM students_data
            WHERE student_id=%s
            """,
            (student_id,)
        )

        student = cursor.fetchone()

        if student is None:
            return {
                "authorized": False,
                "reason": "Student not found"
            }

        # Global check - applies to every service
        if not student["isActive"]:
            return {
                "authorized": False,
                "reason": "Student account inactive"
            }

        # NFC check - applies to every NFC service
        if student["nfc_status"].lower() != "active":
            return {
                "authorized": False,
                "reason": f"NFC status is {student['nfc_status']}"
            }

        # Financial account check - Payment only
        if serviceType == "Payment":
            if student["account_status"].lower() != "active":
                return {
                    "authorized": False,
                    "reason": f"Account status is {student['account_status']}"
                }

        return {
            "authorized": True,
            "reason": "Student authorized"
        }

    finally:
        cursor.close()
        conn.close()