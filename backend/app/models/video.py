from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    filename = Column(String, nullable=False)

    filepath = Column(String, nullable=False)

    file_size = Column(Integer, nullable=False)

    status = Column(String, default="Uploaded")

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    uploaded_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship("User")