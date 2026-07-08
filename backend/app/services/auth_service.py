from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password


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

        hashed_password=hash_password(
            user.password
        ),

        role=user.role

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user