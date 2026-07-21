import math
from pathlib import Path

from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

import base64

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes


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

def decrypt_with_private_key(ciphertext_b64: str, private_key_pem: str) -> str:

    # Load private key
    private_key = serialization.load_pem_private_key(
        private_key_pem.encode(),
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

    return plaintext.decode("utf-8")