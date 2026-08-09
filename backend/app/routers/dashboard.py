from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.dashboard_service import (
    get_dashboard_data,
    get_usage_report
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/analytics")
def dashboard_analytics(
    db: Session = Depends(get_db)
):
    """
    Return analytics dashboard data.
    """

    return get_dashboard_data(db)


@router.get("/usage-report")
def usage_report(
    db: Session = Depends(get_db)
):
    """
    Return usage report data.
    """

    return get_usage_report(db)