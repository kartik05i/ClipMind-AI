from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.base import Base


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    video_id = Column(
        Integer,
        ForeignKey("videos.id"),
        nullable=False
    )

    content_type = Column(
        String,
        nullable=False
    )

    content = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )