from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    action = Column(
        String,
        nullable=False
    )

    resource = Column(
        String,
        nullable=True
    )

    details = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    user = relationship("User")