from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.core.roles import LEARNER

from app.models.user import User
from app.models.video import Video
from app.models.learning_history import LearningHistory


router = APIRouter(
    prefix="/learning-history",
    tags=["Learning History"]
)


# ==========================================
# SAVE LEARNING ACTIVITY
# ==========================================

@router.post("/save/{video_id}")
def save_learning_history(
    video_id: int,
    activity: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Only learners should have learning history
    if current_user.role != LEARNER:
        return {
            "message": "Learning history is only available for learners"
        }

    # Check if video exists
    video = (
        db.query(Video)
        .filter(Video.id == video_id)
        .first()
    )

    if not video:
        return {
            "message": "Video not found"
        }

    # Save activity
    history = LearningHistory(
        user_id=current_user.id,
        video_id=video_id,
        activity=activity
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return {
        "message": "Learning activity saved successfully",
        "history_id": history.id
    }


# ==========================================
# GET LEARNING HISTORY
# ==========================================

@router.get("/")
def get_learning_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Get only the current learner's history
    history = (
        db.query(LearningHistory)
        .filter(
            LearningHistory.user_id == current_user.id
        )
        .order_by(
            LearningHistory.created_at.desc()
        )
        .all()
    )

    result = []

    for item in history:

        video = (
            db.query(Video)
            .filter(Video.id == item.video_id)
            .first()
        )

        result.append({
            "history_id": item.id,
            "video_id": item.video_id,
            "video_title": video.title if video else "Unknown Video",
            "activity": item.activity,
            "created_at": item.created_at
        })

    return result