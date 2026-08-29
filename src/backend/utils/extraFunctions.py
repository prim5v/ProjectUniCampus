import math
from pathlib import Path

from imagekitio import ImageKit

from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

import base64

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

from flask import request
import user_agents

import requests
import uuid
from upstash_redis import Redis
import os


from datetime import datetime


import os
from dotenv import load_dotenv

import secrets
import string

load_dotenv()


def get_redis():
    redis_client = Redis(
        url=os.getenv("UPSTASH_REDIS_REST_URL"),
        token=os.getenv("UPSTASH_REDIS_REST_TOKEN"),
    )

    return redis_client




def generate_student_id():
    """
    Generate a 12-character student ID.

    Example:
        STU-A7K92PX4
    """

    alphabet = string.ascii_uppercase + string.digits

    random_part = ''.join(
        secrets.choice(alphabet)
        for _ in range(8)
    )

    return f"STU-{random_part}"

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Returns distance in METERS between two coordinates.
    """
    R = 6371000  # Earth radius in meters

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2) ** 2 +
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return int(R * c)  # return meters (integer)




def serialize_datetime(value):
    if value is None:
        return None

    if isinstance(value, datetime):
        return value.isoformat()

    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value).isoformat()
        except ValueError:
            return value

    return str(value)




def generate_rsa_key_pair():
    # Generate private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )

    # Generate public key
    public_key = private_key.public_key()

    # Convert to PEM format
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    # Save keys
    # Path("private_key.pem").write_bytes(private_pem)
    # Path("public_key.pem").write_bytes(public_pem)

    # # Print public key
    # print("Public Key:\n")
    # print(public_pem.decode())

    # # Return public key as a string
    # return public_pem.decode()
    
    volume_path = Path("/etc/keys")
    storage_dir = volume_path if volume_path.exists() else Path(".")

    private_path = storage_dir / "private_key.pem"
    public_path = storage_dir / "public_key.pem"

    # Save keys securely
    private_path.write_bytes(private_pem)
    public_path.write_bytes(public_pem)

    return public_pem.decode()

def decrypt_with_private_key(ciphertext_b64: str, private_key_pem) -> bytes:

    # Load private key
    if isinstance(private_key_pem, str):
        private_key_pem = private_key_pem.encode("utf-8")

    private_key = serialization.load_pem_private_key(
        private_key_pem,
        password=None
    )

    # Decode Base64 ciphertext
    ciphertext = base64.b64decode(ciphertext_b64)

    # Decrypt
    plaintext = private_key.decrypt(
        ciphertext,
        padding.OAEP(
            mgf=padding.MGF1(
                algorithm=hashes.SHA256()
            ),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    return plaintext




def get_location(ip: str) -> str:
    """Resolve IP to city, region, country using ipinfo.io"""
    try:
        res = requests.get(f"https://ipinfo.io/{ip}/json", timeout=2)
        if res.status_code == 200:
            data = res.json()
            city = data.get("city")
            region = data.get("region")
            country = data.get("country")
            return ", ".join(filter(None, [city, region, country]))
    except Exception:
        pass
    return "Unknown"


def get_device_brand(ua_string: str) -> dict:
    ua = ua_string.lower()

    # --- Mobile brands ---
    if "iphone" in ua:
        return {"brand": "Apple", "model": "iPhone"}
    if "ipad" in ua:
        return {"brand": "Apple", "model": "iPad"}
    if "samsung" in ua:
        return {"brand": "Samsung", "model": "Android"}
    if "tecno" in ua:
        return {"brand": "Tecno", "model": "Android"}
    if "infinix" in ua:
        return {"brand": "Infinix", "model": "Android"}
    if "itel" in ua:
        return {"brand": "Itel", "model": "Android"}
    if "redmi" in ua or "xiaomi" in ua:
        return {"brand": "Xiaomi", "model": "Android"}
    if "huawei" in ua:
        return {"brand": "Huawei", "model": "Android"}
    if "oppo" in ua:
        return {"brand": "Oppo", "model": "Android"}
    if "vivo" in ua:
        return {"brand": "Vivo", "model": "Android"}

    # --- Laptops / PCs ---
    if "dell" in ua:
        return {"brand": "Dell", "model": "PC"}
    if "asus" in ua:
        return {"brand": "ASUS", "model": "PC"}
    if "hp" in ua or "hewlett-packard" in ua:
        return {"brand": "HP", "model": "PC"}
    if "lenovo" in ua:
        return {"brand": "Lenovo", "model": "PC"}
    if "acer" in ua:
        return {"brand": "Acer", "model": "PC"}
    if "macintosh" in ua or "mac os" in ua:
        return {"brand": "Apple", "model": "Mac"}

    # --- API Clients ---
    if "postman" in ua:
        return {"brand": "Postman", "model": "API Client"}
    if "insomnia" in ua:
        return {"brand": "Insomnia", "model": "API Client"}

    return {"brand": "Unknown", "model": "Unknown"}




def get_device_info() -> dict:
    """
    Extract device information from both web browsers
    and React Native mobile applications.
    """

    # --------------------------------------------------
    # Basic request information
    # --------------------------------------------------

    ua_string = request.headers.get("User-Agent", "Unknown")

    ip = (
        request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        or request.remote_addr
        or "Unknown"
    )

    ua_lower = ua_string.lower()

    parsed_ua = user_agents.parse(ua_string)

    # --------------------------------------------------
    # Mobile app headers
    # --------------------------------------------------

    # device_id = request.headers.get("X-Device-ID")
    device_id = request.headers.get("X-Device-ID") or f"DEV-{uuid.uuid4().hex[:10].upper()}"
    device_name = request.headers.get("X-Device-Name")
    platform = request.headers.get("X-Platform")
    app_version = request.headers.get("X-App-Version")

    # Normalize platform
    if platform:
        platform = platform.lower().strip()

    allowed_platforms = {
        "android",
        "ios",
        "windows",
        "macos",
        "linux",
        "web"
    }

    if platform not in allowed_platforms:
        platform = None

    # --------------------------------------------------
    # Browser detection
    # --------------------------------------------------

    browser_family = parsed_ua.browser.family

    if browser_family in ("Other", "Unknown"):
        if "edg/" in ua_lower or "edge" in ua_lower:
            browser_family = "Edge"

        elif "chrome" in ua_lower:
            browser_family = "Chrome"

        elif "firefox" in ua_lower:
            browser_family = "Firefox"

        elif "safari" in ua_lower:
            browser_family = "Safari"

        elif "insomnia" in ua_lower:
            browser_family = "Insomnia"

        elif "postman" in ua_lower:
            browser_family = "Postman"

        else:
            browser_family = "Unknown"

    # --------------------------------------------------
    # OS detection
    # --------------------------------------------------

    os_family = parsed_ua.os.family

    if os_family in ("Other", "Unknown"):

        if "android" in ua_lower:
            os_family = "Android"

        elif "iphone" in ua_lower or "ipad" in ua_lower:
            os_family = "iOS"

        elif "windows" in ua_lower:
            os_family = "Windows"

        elif "macintosh" in ua_lower or "mac os" in ua_lower:
            os_family = "MacOS"

        elif "linux" in ua_lower:
            os_family = "Linux"

        else:
            os_family = "Unknown"

    # --------------------------------------------------
    # Device detection
    # --------------------------------------------------

    device_family = parsed_ua.device.family

    if device_family in ("Other", "Unknown"):

        if "ipad" in ua_lower or "tablet" in ua_lower:
            device_family = "Tablet"

        elif "mobile" in ua_lower or "android" in ua_lower:
            device_family = "Mobile"

        elif "iphone" in ua_lower:
            device_family = "iPhone"

        elif "insomnia" in ua_lower or "postman" in ua_lower:
            device_family = "PC (API Client)"

        else:
            device_family = "PC"

    # --------------------------------------------------
    # Mobile app overrides
    # --------------------------------------------------

    if platform == "android":

        os_family = "Android"

        if device_name:
            device_family = device_name
        else:
            device_family = "Android Device"

        browser_family = "UniCampus App"

    elif platform == "ios":

        os_family = "iOS"

        if device_name:
            device_family = device_name
        else:
            device_family = "iOS Device"

        browser_family = "UniCampus App"

    # --------------------------------------------------
    # Device brand/model
    # --------------------------------------------------

    device_brand_info = get_device_brand(ua_string)

    brand = device_brand_info.get("brand")
    model = device_brand_info.get("model")

    # Mobile apps can explicitly provide the device name,
    # so use it when the User-Agent cannot identify the model.

    if platform in ("android", "ios") and device_name:

        model = device_name

        if not brand:
            brand = "Unknown"

    # --------------------------------------------------
    # Location
    # --------------------------------------------------

    location = get_location(ip)

    # --------------------------------------------------
    # Return
    # --------------------------------------------------
    return {
        "device_id": device_id or "UNKNOWN-DEVICE",
        "device_name": device_name or "Android Device",
        "platform": platform or "android",
        "app_version": app_version or "1.0.0",

        "browser": browser_family or "Unknown",
        "os": os_family or "Android",
        "device": device_family or "Mobile",
        "device_brand": brand or "Unknown",
        "device_model": model or "Unknown",

        "ip": ip or "0.0.0.0",
        "location": location or "Unknown",
        "user_agent": ua_string or "Unknown"
    }




def get_imagekit():

    # imagekit = ImageKit(
    #     private_key=os.getenv("IMAGEKIT_PRIVATE_KEY"),
    #     public_key=os.getenv("IMAGEKIT_PUBLIC_KEY"),
    #     url_endpoint=os.getenv("IMAGEKIT_URL_ENDPOINT")
    # )

    imagekit = ImageKit(
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEY")
    )


    return imagekit

