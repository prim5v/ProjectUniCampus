# backend/utils/db.py


import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import logging

from pymongo import MongoClient
from pymongo.server_api import ServerApi



load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
MONGODB_URI = os.getenv("MONGODB_URI")








def get_db_connection():
    try:
        conn = psycopg2.connect(
            DATABASE_URL,
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print("Database connection failed:", e)
        return None


def get_db_cursor():
    conn = get_db_connection()
    if conn:
        return conn, conn.cursor()
    return None, None




def check_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        cursor.execute("SELECT 1;")
        cursor.fetchone()

        cursor.close()
        conn.close()

        logging.info("✅ Database connection successful")

        return True

    except Exception as e:
        logging.error(f"❌ Database connection failed: {str(e)}")
        return False





# Create MongoDB client once
client = MongoClient(
    MONGODB_URI,
    server_api=ServerApi("1")
)


def get_mongo_connection():
    """
    Returns the MongoDB client.
    """
    try:
        return client

    except Exception as e:
        print("MongoDB connection failed:", e)
        return None


def get_mongo_db():
    """
    Returns the UniCampus MongoDB database.
    """
    try:
        db = client["unicampus"]
        return db

    except Exception as e:
        print("MongoDB database access failed:", e)
        return None


# def get_mongo_collection(collection_name):
#     """
#     Returns a collection from the UniCampus database.
#     """
#     try:
#         db = get_mongo_db()
#         db.create_index(
#                 "created_at",
#                 expireAfterSeconds=60 * 60 * 24 * 90
#             )

#         if db is None:
#             return None

#         return db[collection_name]

#     except Exception as e:
#         print("MongoDB collection access failed:", e)
#         return None

def get_mongo_collection(collection_name):
    """
    Returns a collection from the UniCampus database.
    """
    try:
        db = get_mongo_db()

        if db is None:
            return None

        collection = db[collection_name]

        # Create TTL index once
        collection.create_index(
            "created_at",
            expireAfterSeconds=60 * 60 * 24 * 90
        )

        return collection

    except Exception as e:
        print("MongoDB collection access failed:", e)
        return None


def check_mongo_connection():
    """
    Checks whether MongoDB is reachable.
    """
    try:
        client.admin.command("ping")

        logging.info("✅ MongoDB connection successful")

        return True

    except Exception as e:
        logging.error(f"❌ MongoDB connection failed: {str(e)}")

        return False


# import os
# import logging
# import pymysql
# from dotenv import load_dotenv

# load_dotenv()

# DB_HOST = os.getenv("DB_HOST")
# DB_USER = os.getenv("DB_USER")
# DB_PASSWORD = os.getenv("DB_PASSWORD")
# DB_NAME = os.getenv("DB_NAME")
# DB_PORT = int(os.getenv("DB_PORT", 3306))


# def get_db_connection():
#     try:
#         conn = pymysql.connect(
#             host=DB_HOST,
#             user=DB_USER,
#             password=DB_PASSWORD,
#             database=DB_NAME,
#             port=DB_PORT,
#             cursorclass=pymysql.cursors.DictCursor,
#             autocommit=True,
#             charset="utf8mb4"
#         )
#         return conn

#     except Exception as e:
#         logging.error(f"Database connection failed: {e}")
#         return None


# def get_db_cursor():
#     conn = get_db_connection()

#     if conn is None:
#         return None, None

#     return conn, conn.cursor()


# def check_db_connection():
#     conn = get_db_connection()

#     if conn is None:
#         return False

#     try:
#         with conn.cursor() as cursor:
#             cursor.execute("SELECT 1")
#             cursor.fetchone()

#         logging.info("✅ Database connection successful")
#         return True

#     except Exception as e:
#         logging.error(f"❌ Database connection failed: {e}")
#         return False

#     finally:
#         conn.close()


















