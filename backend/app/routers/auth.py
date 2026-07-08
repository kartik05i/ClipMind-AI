from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import RegisterRequest
from app.services.auth_service import register_user

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