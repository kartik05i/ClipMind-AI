from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models.user import User
from app.models.video import Video
from app.models.transcript import Transcript
from app.models.summary import Summary
from app.models.keymoment import KeyMoment
from app.models.highlight import Highlight
from app.models.keyword import Keyword