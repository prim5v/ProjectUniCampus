from backend.utils.db import get_db_cursor, get_mongo_collection
from flask import jsonify
import bcrypt, uuid
import logging




logger = logging.getLogger(__name__)


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
            "reason": "Student authorized",
            "student": student
        }

    finally:
        cursor.close()
        conn.close()

# def check_device(student_id):
    


def login_check(username, pwd):
    conn, cursor = get_db_cursor()

    if conn is None:
        return None

    try:
        cursor.execute(
            "SELECT * FROM students_data WHERE username=%s",
            (username,)
        )
        user = cursor.fetchone()

        if not user:
            logging.warning(f"❌ User {username} not found")
            return None

        # if not bcrypt.checkpw(pwd.encode(), user["pwd_hash"].encode()):
        # if pwd != user["pwd_hash"]:
        #     logging.warning(f"❌ Invalid password for user {username}")
        #     return None
        stored_hash = user["pwd_hash"]

        password_valid = bcrypt.checkpw(
            pwd.encode("utf-8"),
            stored_hash.encode("utf-8")
        )

        if not password_valid:
            logging.warning(f"❌ Invalid password for user {username}")
            return None
        
        # Never return the password hash
        user.pop("pwd_hash", None)

        logging.info(f"✅ User {username} authenticated successfully")
        return user
        

    finally:
        cursor.close()
        conn.close()


def get_session_by_id(session_id):
    conn, cursor = get_db_cursor()

    if conn is None:
        return None

    try:
        cursor.execute(
            """
            SELECT 
                id,
                session_id,
                student_id,
                device_id,
                token_hash,
                expires_at,
                created_at,
                revoked_at,
                ip_address,
                user_agent
            FROM student_login_sessions
            WHERE session_id = %s
            LIMIT 1
            """,
            (session_id,)
        )

        session = cursor.fetchone()

        return session

    finally:
        cursor.close()
        conn.close()


def check_device_id(device_id):
    conn, cursor = get_db_cursor()
    
    if conn is None:
        return None

    try:
        cursor.execute("SELECT * FROM students_devices WHERE device_id = %s", (device_id,))
        record = cursor.fetchone()
        if not record:
            return None

        return record

    finally:
        cursor.close()
        conn.close()

        

def get_student_data(student_id):
    conn, cursor = get_db_cursor()

    if conn is None:
        return None

    try:
        query = """
            SELECT
                sc.student_name AS name,
                sc.admission_number AS admission_number,
                sc.student_course AS course,
                sc.Year_of_study AS year,
                sc.image_url AS image_url,
                c.campus_name AS university_name
            FROM students_data sd
            LEFT JOIN students_credentials sc
                ON sd.student_id = sc.student_id
            LEFT JOIN campus_data c
                ON sd.campus_id = c.campus_id
            WHERE sd.student_id = %s
            LIMIT 1
        """

        cursor.execute(query, (student_id,))
        student = cursor.fetchone()

        return student

    except Exception as e:
        print(f"Error fetching student data: {e}")
        return None

    finally:
        cursor.close()
        conn.close()

def student_campus(student_id):
    conn, cursor = get_db_cursor()

    try:
        cursor.execute("SELECT campus_id FROM students_data WHERE student_id=%s", (student_id,))
        record = cursor.fetchone()
        campus_id = record["campus_id"] if record else None
        return campus_id

    except Exception as e:
        logger.error(f"Error fetching student campus: {e}")
        return None

    finally:
        cursor.close()
        conn.close()



def check_campus_exists(clerk_id):
    conn, cursor = get_db_cursor()

    if not conn:
        logger.error(
            "DB_CONNECTION_FAILED",
            extra={
                "clerk_id": clerk_id
            },
        )

        raise RuntimeError("Database connection failed")

    try:
        cursor.execute(
            """
            SELECT 1
            FROM campus_data
            WHERE campus_id = %s
            LIMIT 1
            """,
            (clerk_id,),
        )

        return cursor.fetchone() is not None

    except Exception:
        logger.exception(
            "DB_CHECK_USER_FAILED",
            extra={
                "clerk_id": clerk_id
            },
        )

        raise

    finally:
        cursor.close()
        conn.close()




def get_students(campus_id, page=1, limit=20):
    try:
        collection = get_mongo_collection("students_data")

        if collection is None:
            logger.error("Students collection could not be accessed")
            return None

        # Calculate how many documents to skip
        skip = (page - 1) * limit

        # Filter students belonging to this campus
        query = {
            "campus_id": campus_id,
            "digitalId_created": False
        }

        # Get total number of students
        total = collection.count_documents(query)

        # Get only the requested page
        students = list(
            collection
            .find(query)
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )

        # Calculate total pages
        total_pages = (
            (total + limit - 1) // limit
            if total > 0
            else 0
        )

        return {
            "data": students,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1
            }
        }

    except Exception as e:
        logger.error(f"Failed to get students: {e}")
        return None



def get_ids(campus_id, page=1, limit=20):
    conn, cursor = get_db_cursor()

    if not conn or not cursor:
        logger.error(
            "Database connection or cursor unavailable"
        )
        return None

    try:
        # -----------------------------
        # Pagination
        # -----------------------------

        offset = (page - 1) * limit

        # -----------------------------
        # Get total digital IDs
        # -----------------------------
        #
        # nfc_status is being used to determine
        # whether the student has a digital ID.
        #
        # Change "active" if your actual value
        # is something different, e.g. "enabled".
        # -----------------------------

        count_query = """
            SELECT COUNT(*) AS total
            FROM students_data
            WHERE campus_id = %s
        """

        cursor.execute(
            count_query,
            (campus_id,)
        )

        count_row = cursor.fetchone()

        if not count_row:
            total = 0
        else:
            total = count_row["total"]
        # -----------------------------
        # Get requested page
        # -----------------------------

        query = """
           SELECT
                sd.id,
                sd.campus_id,
                sd.student_id,
                sd.username,
                sd."isActive",
                sd.nfc_status,
                sd.account_status,
                sd."onBoardedWhen",
                sc.image_url
            FROM students_data sd
            LEFT JOIN students_credentials sc
                ON sd.student_id = sc.student_id
            WHERE sd.campus_id = %s
            ORDER BY sd."onBoardedWhen" DESC
            LIMIT %s OFFSET %s
        """

        cursor.execute(
            query,
            (
                campus_id,
                limit,
                offset
            )
        )

        rows = cursor.fetchall()

        # -----------------------------
        # Convert rows to dictionaries
        # -----------------------------

        # columns = [
        #     description[0]
        #     for description in cursor.description
        # ]

        students = rows

        # for row in rows:
        #     students.append(
        #         dict(zip(columns, row))
        #     )

        # -----------------------------
        # Total pages
        # -----------------------------

        total_pages = (
            (total + limit - 1) // limit
            if total > 0
            else 0
        )

        return {
            "data": students,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1
            }
        }

    except Exception:
        logger.exception("Error fetching IDs")

        return None

    finally:
        try:
            cursor.close()
            conn.close()

        except Exception as close_error:
            logger.error(
                f"Error closing database connection: {close_error}"
            )




def get_wallet_data(student_id):


    conn, cursor = get_db_cursor()


    if conn is None:
        return None


    try:


        # -----------------------------
        # Transactions
        # -----------------------------

        transaction_query = """

        SELECT

            t.icon_name AS icon,

            t.title,

            td.amount,

            t.category AS direction,

            td.createdAt AS time


        FROM transactions_data td


        INNER JOIN transactions t

        ON td.transaction_id = t.id


        WHERE td.student_id = %s


        ORDER BY td.createdAt DESC


        """


        cursor.execute(
            transaction_query,
            (student_id,)
        )


        transactions = cursor.fetchall()



        # -----------------------------
        # Wallet summary
        # -----------------------------

        summary_query = """

        SELECT


        COALESCE(

            SUM(

                CASE

                WHEN t.category='incoming'

                THEN td.amount

                ELSE 0

                END

            ),0

        ) AS total_topups,



        COALESCE(

            SUM(

                CASE

                WHEN t.category='outgoing'

                THEN td.amount

                ELSE 0

                END

            ),0

        ) AS total_spent,



        COUNT(td.transaction_id) AS total_transactions



        FROM transactions_data td


        INNER JOIN transactions t

        ON td.transaction_id = t.id


        WHERE td.student_id=%s


        """



        cursor.execute(

            summary_query,

            (student_id,)

        )


        summary = cursor.fetchone()



        balance = (

            summary["total_topups"]

            -

            summary["total_spent"]

        )



        # -----------------------------
        # This Month Spending
        # -----------------------------

        month_query = """

        SELECT

        COALESCE(

            SUM(td.amount),

            0

        ) AS amount



        FROM transactions_data td


        INNER JOIN transactions t

        ON td.transaction_id=t.id


        WHERE td.student_id=%s


        AND t.category='outgoing'


        AND DATE_TRUNC(

            'month',

            td.createdAt

        )

        =

        DATE_TRUNC(

            'month',

            CURRENT_DATE

        )


        """



        cursor.execute(

            month_query,

            (student_id,)

        )


        month = cursor.fetchone()



        return {


            "balance": f"KSh {balance}",


            "transactions": transactions,


            "summaryStats": [

                {

                "label": "Total Top-ups",

                "value": f"KSh {summary['total_topups']}"

                },


                {

                "label": "Total Spent",

                "value": f"KSh {summary['total_spent']}"

                },


                {

                "label": "This Month",

                "value": f"KSh {month['amount']}"

                },


                {

                "label": "Transactions",

                "value": str(summary["total_transactions"])

                }

            ]

        }



    except Exception as e:

        print(
            f"Wallet controller error: {e}"
        )

        return None



    finally:

        cursor.close()
        conn.close()


def transaction_lookup(invoice_id):
    conn, cursor = get_db_cursor()

    if conn is None:
        return None

    try:
        cursor.execute(
            """
            SELECT *
            FROM transactions_data
            WHERE invoice_id=%s
            """,
            (invoice_id,)
        )

        transaction = cursor.fetchone()

        return transaction

    except Exception as e:
        print(f"Transaction lookup error: {e}")
        return None

    finally:
        cursor.close()
        conn.close()