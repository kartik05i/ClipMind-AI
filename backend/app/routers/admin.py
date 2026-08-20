from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.models.audit_log import AuditLog

from app.core.dependencies import require_role
from app.core.roles import ADMINISTRATOR


router = APIRouter(
    prefix="/admin",
    tags=["Administrator"]
)


# ==========================================
# GET ALL USERS
# ==========================================

@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([ADMINISTRATOR])
    )
):

    users = db.query(User).order_by(User.id).all()

    result = []

    for user in users:
        result.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active
        })

    return result


# ==========================================
# UPDATE USER ROLE
# ONLY:
# Learner -> Administrator
# Educator -> Administrator
# Content Creator -> Administrator
# ==========================================

@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([ADMINISTRATOR])
    )
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Prevent changing an Administrator's role
    if user.role == ADMINISTRATOR:
        raise HTTPException(
            status_code=400,
            detail="Administrator role cannot be changed"
        )

    # Only promotion to Administrator is allowed
    if role != ADMINISTRATOR:
        raise HTTPException(
            status_code=400,
            detail=(
                "Users can only be promoted to Administrator"
            )
        )

    old_role = user.role

    user.role = ADMINISTRATOR

    # Create audit log
    audit_log = AuditLog(
        user_id=current_user.id,
        action="USER_ROLE_CHANGED",
        resource="User",
        details=(
            f"Changed role of {user.name} "
            f"from {old_role} to {ADMINISTRATOR}"
        )
    )

    db.add(audit_log)
    db.commit()
    db.refresh(user)

    return {
        "message": "User promoted to Administrator successfully",
        "user_id": user.id,
        "role": user.role
    }


# ==========================================
# ACTIVATE / DEACTIVATE USER
# ==========================================

@router.put("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([ADMINISTRATOR])
    )
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.is_active = is_active

    audit_log = AuditLog(
        user_id=current_user.id,
        action=(
            "USER_ACTIVATED"
            if is_active
            else "USER_DEACTIVATED"
        ),
        resource="User",
        details=(
            f"Activated user: {user.name}"
            if is_active
            else f"Deactivated user: {user.name}"
        )
    )

    db.add(audit_log)
    db.commit()
    db.refresh(user)

    return {
        "message": "User status updated successfully",
        "user_id": user.id,
        "is_active": user.is_active
    }


# ==========================================
# DELETE USER
# ==========================================

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([ADMINISTRATOR])
    )
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Prevent admin from deleting themselves
    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account"
        )

    user_name = user.name

    audit_log = AuditLog(
        user_id=current_user.id,
        action="USER_DELETED",
        resource="User",
        details=f"Deleted user: {user_name}"
    )

    db.add(audit_log)

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }