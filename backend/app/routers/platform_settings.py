from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.platform_settings import PlatformSettings
from app.schemas.platform_settings import (
    PlatformSettingsUpdate,
    PlatformSettingsResponse,
)

from app.models.audit_log import AuditLog
from app.models.user import User
from app.core.dependencies import require_role
from app.core.roles import ADMINISTRATOR


router = APIRouter(
    prefix="/platform-settings",
    tags=["Platform Settings"],
)


@router.get(
    "/",
    response_model=PlatformSettingsResponse,
)
def get_platform_settings(
    db: Session = Depends(get_db),
):

    settings = db.query(PlatformSettings).first()

    # Create default settings if none exist
    if not settings:

        settings = PlatformSettings(
            platform_name="ClipMind AI",
            platform_description=(
                "AI-powered video summarization "
                "and learning platform."
            ),
            maintenance_mode=False,
            max_upload_size=500,
            allowed_formats="MP4, MOV, AVI",
            default_visibility="Private",
            default_language="English",
            auto_processing=True,
        )

        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


@router.put(
    "/",
    response_model=PlatformSettingsResponse,
)
def update_platform_settings(
    data: PlatformSettingsUpdate,
    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role([
            ADMINISTRATOR
        ])
    )
):

    settings = db.query(PlatformSettings).first()

    # Create settings if they don't exist
    if not settings:

        settings = PlatformSettings()

        db.add(settings)

    settings.platform_name = data.platform_name
    settings.platform_description = data.platform_description
    settings.maintenance_mode = data.maintenance_mode
    settings.max_upload_size = data.max_upload_size
    settings.allowed_formats = data.allowed_formats
    settings.default_visibility = data.default_visibility
    settings.default_language = data.default_language
    settings.auto_processing = data.auto_processing

    # Create audit log
    audit_log = AuditLog(
        user_id=current_user.id,
        action="PLATFORM_SETTINGS_UPDATED",
        resource="Admin",
        details="Updated platform settings"
    )

    db.add(audit_log)

    db.commit()
    db.refresh(settings)

    return settings