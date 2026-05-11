from datetime import datetime, timedelta
from jose import jwt
import os

SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')
ALGORITHM = 'HS256'

def create_access_token(subject: str):
    payload = {
        'sub': subject,
        'exp': datetime.utcnow() + timedelta(hours=12)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
