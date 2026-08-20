from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db

from app.models.video import Video
from app.models.learning_history import LearningHistory
from app.models.bookmark import Bookmark
from app.models.user import User

from app.core.dependencies import require_role
from app.core.roles import CONTENT_CREATOR


router = APIRouter(
    prefix="/content-analytics",
    tags=["Content Analytics"]
)


@router.get("/")
def get_content_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([CONTENT_CREATOR])
    )
):

    # ==========================================
    # GET CONTENT CREATOR'S VIDEOS
    # ==========================================

    videos = (
        db.query(Video)
        .filter(Video.uploaded_by == current_user.id)
        .all()
    )

    video_ids = [video.id for video in videos]


    # ==========================================
    # EMPTY STATE
    # ==========================================

    if not video_ids:
        return {
            "overview": {
                "total_videos": 0,
                "total_activities": 0,
                "unique_learners": 0,
                "total_bookmarks": 0
            },
            "video_analytics": [],
            "top_video": None
        }


    # ==========================================
    # OVERVIEW
    # ==========================================

    total_activities = (
        db.query(LearningHistory)
        .filter(
            LearningHistory.video_id.in_(video_ids)
        )
        .count()
    )


    unique_learners = (
        db.query(
            func.count(
                func.distinct(LearningHistory.user_id)
            )
        )
        .filter(
            LearningHistory.video_id.in_(video_ids)
        )
        .scalar()
    )


    total_bookmarks = (
        db.query(Bookmark)
        .filter(
            Bookmark.video_id.in_(video_ids)
        )
        .count()
    )


    # ==========================================
    # VIDEO ANALYTICS
    # ==========================================

    video_analytics = []

    for video in videos:

        activity_count = (
            db.query(LearningHistory)
            .filter(
                LearningHistory.video_id == video.id
            )
            .count()
        )


        learner_count = (
            db.query(
                func.count(
                    func.distinct(
                        LearningHistory.user_id
                    )
                )
            )
            .filter(
                LearningHistory.video_id == video.id
            )
            .scalar()
        )


        bookmark_count = (
            db.query(Bookmark)
            .filter(
                Bookmark.video_id == video.id
            )
            .count()
        )


        video_analytics.append({
            "video_id": video.id,
            "video_title": video.title,
            "activities": activity_count,
            "unique_learners": learner_count or 0,
            "bookmarks": bookmark_count
        })


    # ==========================================
    # TOP PERFORMING VIDEO
    # Engagement score = activities + bookmarks
    # ==========================================

    top_video = max(
        video_analytics,
        key=lambda video:
            video["activities"] + video["bookmarks"]
    )


    # ==========================================
    # RETURN DATA
    # ==========================================

    return {
        "overview": {
            "total_videos": len(videos),
            "total_activities": total_activities,
            "unique_learners": unique_learners or 0,
            "total_bookmarks": total_bookmarks
        },

        "video_analytics": video_analytics,

        "top_video": top_video
    }