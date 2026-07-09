from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import RegisterRequest
from app.services.auth_service import register_user
from app.schemas.login import LoginRequest
from app.services.auth_service import login_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user: RegisterRequest,
    db: Session = Depends(get_db)
):

    new_user = register_user(db, user)

    if new_user is None:

        return {
            "message": "Email already exists"
        }

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }
@router.post("/login")
def login(
    user: LoginRequest,
    db: Session = Depends(get_db)
):

    result = login_user(user, db)

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return result