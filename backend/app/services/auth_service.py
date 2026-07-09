from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.schemas.login import LoginRequest
from app.core.security import hash_password
from app.utils.jwt import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def register_user(
    db: Session,
    user: RegisterRequest
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        return None

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(
    user_data: LoginRequest,
    db: Session
):

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        return None

    if not pwd_context.verify(
        user_data.password,
        user.hashed_password
    ):
        return None

    token = create_access_token(
        {"sub": user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }