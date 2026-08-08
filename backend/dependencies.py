from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from database import get_db
from models.user import User

# SAME SECRET KEY AS auth.py
SECRET_KEY = "taskflow_secret_key_2026"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Token"
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("JWT Payload:", payload)

        email = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError as e:
        print("JWT Error:", str(e))
        raise credentials_exception

    user = db.query(User).filter(
        User.email == email
    ).first()

    print("Database User:", user)

    if user is None:
        raise credentials_exception

    return user