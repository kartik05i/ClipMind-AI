from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Inactive user"
        )

    return user


def require_role(allowed_roles: list):

    def role_checker(
        current_user: User = Depends(get_current_user)
    ):

        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this resource"
            )

        return current_user

    return role_checker