from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.dashboard_service import (
    get_dashboard_data,
    get_usage_report
)

from app.models.user import User
from app.core.dependencies import require_role
from app.core.roles import (
    EDUCATOR,
    CONTENT_CREATOR,
    ADMINISTRATOR,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/analytics")
def dashboard_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([
            EDUCATOR,
            CONTENT_CREATOR,
            ADMINISTRATOR,
        ])
    )
):
    return get_dashboard_data(db)


@router.get("/usage-report")
def usage_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([
            ADMINISTRATOR,
        ])
    )
):
    return get_usage_report(db)