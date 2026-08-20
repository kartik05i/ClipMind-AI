from sqlalchemy import Column, Integer, String, Boolean, Text

from app.database.base import Base


class PlatformSettings(Base):

    __tablename__ = "platform_settings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    platform_name = Column(
        String,
        nullable=False,
        default="ClipMind AI"
    )

    platform_description = Column(
        Text,
        nullable=True
    )

    maintenance_mode = Column(
        Boolean,
        default=False
    )

    max_upload_size = Column(
        Integer,
        default=500
    )

    allowed_formats = Column(
        String,
        default="MP4,MOV,AVI"
    )

    default_visibility = Column(
        String,
        default="Private"
    )

    default_language = Column(
        String,
        default="English"
    )

    auto_processing = Column(
        Boolean,
        default=True
    )