from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.repositories.user_repository import create_user, get_user_by_email
from app.schemas.auth import TokenResponse, UserLogin, UserRegister


def register_customer(db: Session, user_data: UserRegister) -> TokenResponse:
    if get_user_by_email(db, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered.",
        )

    user = create_user(
        db,
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
    )
    token = create_access_token(user.email)
    return TokenResponse(access_token=token, user=user)


def authenticate_user(db: Session, credentials: UserLogin) -> TokenResponse:
    user = get_user_by_email(db, credentials.email)

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(user.email)
    return TokenResponse(access_token=token, user=user)
