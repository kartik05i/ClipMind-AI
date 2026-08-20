from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.database.database import get_db
from app.models.audit_log import AuditLog


router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"]
)


@router.get("/")
def get_audit_logs(
    search: str = Query(None),
    category: str = Query("All"),
    db: Session = Depends(get_db)
):

    query = (
        db.query(AuditLog)
        .options(joinedload(AuditLog.user))
    )


    # ================= CATEGORY FILTER =================

    if category != "All":

        query = query.filter(
            AuditLog.resource == category
        )


    # ================= SEARCH =================

    if search:

        search_value = f"%{search}%"

        query = query.filter(
            (AuditLog.action.ilike(search_value))
            |
            (AuditLog.details.ilike(search_value))
        )


    # ================= GET LOGS =================

    logs = (
        query
        .order_by(AuditLog.created_at.desc())
        .limit(20)
        .all()
    )


    logs_data = []

    for log in logs:

        logs_data.append({
            "id": log.id,
            "time": log.created_at,
            "user": (
                log.user.name
                if log.user
                else "System"
            ),
            "action": log.action,
            "category": log.resource,
            "details": log.details,
        })


    # ================= OVERVIEW =================

    total_activities = db.query(
        func.count(AuditLog.id)
    ).scalar() or 0


    # User related activities
    user_activities = db.query(
        func.count(AuditLog.id)
    ).filter(
        AuditLog.resource == "User"
    ).scalar() or 0


    # Content related activities
    content_activities = db.query(
        func.count(AuditLog.id)
    ).filter(
        AuditLog.resource.in_([
            "Content",
            "Video"
        ])
    ).scalar() or 0


    # Admin related activities
    admin_activities = db.query(
        func.count(AuditLog.id)
    ).filter(
        AuditLog.resource == "Admin"
    ).scalar() or 0


    return {
        "overview": {
            "total_activities": total_activities,
            "user_activities": user_activities,
            "content_activities": content_activities,
            "admin_activities": admin_activities,
        },

        "logs": logs_data
    }