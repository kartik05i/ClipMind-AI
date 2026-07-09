from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password, verify_password
from app.utils.jwt import create_access_token


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
    form_data: OAuth2PasswordRequestForm,
    db: Session
):

    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user:
        return None

    if not verify_password(
        form_data.password,
        user.hashed_password
    ):
        return None

    access_token = create_access_token(
        {"sub": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }