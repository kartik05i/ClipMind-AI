from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse

from authlib.integrations.starlette_client import OAuth

from app.core.config import settings
from app.core.security import hash_password
from app.utils.jwt import create_access_token

from app.database.session import get_db

from app.schemas.auth import (
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

from app.services.auth_service import (
    register_user,
    login_user,
    forgot_password,
    reset_password,
    update_profile,
)

from app.core.dependencies import get_current_user
from app.models.user import User

oauth = OAuth()

oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url=(
        "https://accounts.google.com/"
        ".well-known/openid-configuration"
    ),
    client_kwargs={
        "scope": "openid email profile"
    },
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# REGISTER
# ==========================================

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


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    result = login_user(form_data, db)

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return result


# ==========================================
# FORGOT PASSWORD
# ==========================================

@router.post("/forgot-password")
def request_password_reset(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    user = forgot_password(
        email=data.email,
        db=db
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="No account found with this email"
        )

    return {
        "message": "Email verified successfully"
    }


# ==========================================
# RESET PASSWORD
# ==========================================

@router.post("/reset-password")
def reset_user_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    user = reset_password(
        email=data.email,
        new_password=data.new_password,
        db=db
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Password reset successfully"
    }


# ==========================================
# CURRENT USER
# ==========================================

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }

# ==========================================
# UPDATE PROFILE
# ==========================================

@router.put("/profile")
def update_current_user_profile(
    name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Prevent empty names
    if not name.strip():
        raise HTTPException(
            status_code=400,
            detail="Name cannot be empty"
        )

    updated_user = update_profile(
        user=current_user,
        name=name.strip(),
        db=db
    )

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": updated_user.id,
            "name": updated_user.name,
            "email": updated_user.email,
            "role": updated_user.role,
            "is_active": updated_user.is_active
        }
    }

# ==========================================
# GOOGLE LOGIN
# ==========================================

@router.get("/google/login")
async def google_login(
    request: Request
):

    redirect_uri = request.url_for(
        "google_callback"
    )

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )


# ==========================================
# GOOGLE CALLBACK
# ==========================================

@router.get(
    "/google/callback",
    name="google_callback"
)
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):

    token = await oauth.google.authorize_access_token(
        request
    )

    user_info = token.get("userinfo")

    if not user_info:

        user_info = await oauth.google.parse_id_token(
            request,
            token
        )


    email = user_info.get("email")
    name = user_info.get("name")


    if not email:

        raise HTTPException(
            status_code=400,
            detail="Google account email not available"
        )


    # ==========================================
    # CHECK IF USER EXISTS
    # ==========================================

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


    # ==========================================
    # CREATE NEW USER
    # ==========================================

    if not user:

        user = User(
            name=name or "Google User",
            email=email,
            hashed_password=hash_password(
                "google_oauth_user"
            ),
            role="Learner",
            is_active=True
        )

        db.add(user)
        db.commit()
        db.refresh(user)


    # ==========================================
    # CREATE JWT
    # ==========================================

    access_token = create_access_token(
        {
            "sub": user.email
        }
    )


    # ==========================================
    # REDIRECT TO FRONTEND
    # ==========================================

    return RedirectResponse(
        url=(
            "http://localhost:5173/"
            f"?token={access_token}"
        )
    )