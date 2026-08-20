from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db

from app.models.user import User
from app.models.video import Video
from app.models.learning_history import LearningHistory
from app.models.bookmark import Bookmark

from app.core.dependencies import require_role
from app.core.roles import EDUCATOR


router = APIRouter(
    prefix="/classroom-analytics",
    tags=["Classroom Analytics"]
)


@router.get("/")
def get_classroom_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([EDUCATOR])
    )
):

    # ==========================================
    # GET EDUCATOR'S VIDEOS
    # ==========================================

    videos = (
        db.query(Video)
        .filter(Video.uploaded_by == current_user.id)
        .all()
    )

    video_ids = [video.id for video in videos]


    # If educator has no videos
    if not video_ids:
        return {
            "overview": {
                "total_videos": 0,
                "total_activities": 0,
                "unique_learners": 0,
                "total_bookmarks": 0
            },
            "content_analytics": [],
            "student_engagement": []
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
    # CONTENT ANALYTICS
    # ==========================================

    content_analytics = []

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


        content_analytics.append({
            "video_id": video.id,
            "video_title": video.title,
            "activities": activity_count,
            "unique_learners": learner_count or 0,
            "bookmarks": bookmark_count
        })


    # ==========================================
    # STUDENT ENGAGEMENT
    # ==========================================

    learner_activity = (
        db.query(
            LearningHistory.user_id,
            func.count(
                LearningHistory.id
            ).label("activity_count"),
            func.count(
                func.distinct(
                    LearningHistory.video_id
                )
            ).label("videos_accessed"),
            func.max(
                LearningHistory.created_at
            ).label("last_activity")
        )
        .filter(
            LearningHistory.video_id.in_(video_ids)
        )
        .group_by(
            LearningHistory.user_id
        )
        .order_by(
            func.count(
                LearningHistory.id
            ).desc()
        )
        .all()
    )


    student_engagement = []

    for learner in learner_activity:

        user = (
            db.query(User)
            .filter(
                User.id == learner.user_id
            )
            .first()
        )

        student_engagement.append({
            "user_id": learner.user_id,
            "name": (
                user.name
                if user
                else f"Learner {learner.user_id}"
            ),
            "activity_count": learner.activity_count,
            "videos_accessed": learner.videos_accessed,
            "last_activity": learner.last_activity
        })


    # ==========================================
    # RETURN ANALYTICS
    # ==========================================

    return {
        "overview": {
            "total_videos": len(videos),
            "total_activities": total_activities,
            "unique_learners": unique_learners or 0,
            "total_bookmarks": total_bookmarks
        },

        "content_analytics": content_analytics,

        "student_engagement": student_engagement
    }