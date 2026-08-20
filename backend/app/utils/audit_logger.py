from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    action: str,
    resource: str = None,
    details: str = None,
    user_id: int = None
):

    log = AuditLog(
        action=action,
        resource=resource,
        details=details,
        user_id=user_id
    )

    db.add(log)
    db.commit()