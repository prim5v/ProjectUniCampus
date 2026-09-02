from intasend import APIService
import os
from dotenv import load_dotenv


load_dotenv()

def intasend():
    # Initialize IntaSend Service
    intasend_service = APIService(
        token=os.getenv("INTASEND_SECRET_KEY"), 
        publishable_key=os.getenv("INTASEND_PUBLISHABLE_KEY"), 
        test=True
    )
    return intasend_service