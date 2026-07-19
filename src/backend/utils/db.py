# # backend/utils/db.py

import os
import logging
import pymysql
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = int(os.getenv("DB_PORT", 3306))


def get_db_connection():
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT,
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=True,
            charset="utf8mb4"
        )
        return conn

    except Exception as e:
        logging.error(f"Database connection failed: {e}")
        return None


def get_db_cursor():
    conn = get_db_connection()

    if conn is None:
        return None, None

    return conn, conn.cursor()


def check_db_connection():
    conn = get_db_connection()

    if conn is None:
        return False

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

        logging.info("✅ Database connection successful")
        return True

    except Exception as e:
        logging.error(f"❌ Database connection failed: {e}")
        return False

    finally:
        conn.close()


















# import os
# import psycopg2
# from psycopg2.extras import RealDictCursor
# from dotenv import load_dotenv
# import logging

# load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL")


# def get_db_connection():
#     try:
#         conn = psycopg2.connect(
#             DATABASE_URL,
#             cursor_factory=RealDictCursor
#         )
#         return conn
#     except Exception as e:
#         print("Database connection failed:", e)
#         return None


# def get_db_cursor():
#     conn = get_db_connection()
#     if conn:
#         return conn, conn.cursor()
#     return None, None




# def check_db_connection():
#     try:
#         conn = psycopg2.connect(DATABASE_URL)
#         cursor = conn.cursor()

#         cursor.execute("SELECT 1;")
#         cursor.fetchone()

#         cursor.close()
#         conn.close()

#         logging.info("✅ Database connection successful")

#         return True

#     except Exception as e:
#         logging.error(f"❌ Database connection failed: {str(e)}")
#         return False