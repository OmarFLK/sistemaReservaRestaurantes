from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.auth import TokenResponse, UserLogin, UserRegister
from app.schemas.user import UserPublic
from app.services.auth_service import authenticate_user, register_customer

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(
    user_data: UserRegister,
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
    return register_customer(db, user_data)


@router.post("/login", response_model=TokenResponse)
def login(
    credentials: UserLogin,
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
    return authenticate_user(db, credentials)


@router.get("/me", response_model=UserPublic)
def read_current_user(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    return current_user
