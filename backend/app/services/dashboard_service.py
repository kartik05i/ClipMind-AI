from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.video import Video
from app.models.transcript import Transcript
from app.models.summary import Summary

from app.models.keymoment import KeyMoment
from app.models.highlight import Highlight
from app.models.keyword import Keyword


def get_dashboard_data(db: Session):

    videos = db.query(Video).all()
    transcripts = db.query(Transcript).all()
    summaries = db.query(Summary).all()

    total_videos = len(videos)
    total_transcripts = len(transcripts)
    total_summaries = len(summaries)

    latest_video = (
        db.query(Video)
        .order_by(Video.id.desc())
        .first()
    )

    # -----------------------------
    # Content Insights
    # -----------------------------

    avg_transcript_words = 0

    if transcripts:
        total_words = sum(
            len(t.transcript.split())
            for t in transcripts
        )

        avg_transcript_words = round(
            total_words / len(transcripts),
            2
        )

    avg_summary_words = 0

    if summaries:
        total_words = sum(
            len(s.summary.split())
            for s in summaries
        )

        avg_summary_words = round(
            total_words / len(summaries),
            2
        )

    # -----------------------------
    # Usage Report
    # -----------------------------

    completed = total_summaries

    pending = max(
        total_videos - completed,
        0
    )

    failed = len([
        v for v in videos
        if v.status.startswith("Failed")
    ])

    success_rate = 0

    if total_videos > 0:
        success_rate = round(
            completed / total_videos * 100,
            2
        )

    return {

        "overview": {

            "total_videos": total_videos,

            "total_transcripts": total_transcripts,

            "total_summaries": total_summaries,

            "latest_video":
                latest_video.filename
                if latest_video
                else None
        },

        "content_insights": {

            "average_transcript_words":
                avg_transcript_words,

            "average_summary_words":
                avg_summary_words
        },

        "usage_report": {

            "completed_processing":
                completed,

            "pending_processing":
                pending,

            "failed_processing":
                failed,

            "success_rate":
                success_rate
        }
    }

from sqlalchemy import func

from app.models.keymoment import KeyMoment
from app.models.highlight import Highlight
from app.models.keyword import Keyword


def get_usage_report(db: Session):

    total_videos = db.query(Video).count()

    total_storage = (
        db.query(func.sum(Video.file_size))
        .scalar() or 0
    )

    transcript_count = db.query(Transcript).count()

    summary_count = db.query(Summary).count()

    keymoment_count = db.query(KeyMoment).count()

    highlight_count = db.query(Highlight).count()

    keyword_count = db.query(Keyword).count()

    ai_reports = (
        transcript_count +
        summary_count +
        keymoment_count +
        highlight_count +
        keyword_count
    )

    recent_activity = (
        db.query(Video)
        .order_by(Video.uploaded_at.desc())
        .limit(5)
        .all()
    )

    return {

        "total_videos": total_videos,

        "storage_used_mb": round(
            total_storage / (1024 * 1024),
            2
        ),

        "ai_reports": ai_reports,

        "transcripts": transcript_count,

        "summaries": summary_count,

        "key_moments": keymoment_count,

        "highlights": highlight_count,

        "keywords": keyword_count,

        "recent_activity": [
            {
                "title": video.title,
                "status": video.status,
                "uploaded_at": video.uploaded_at
            }
            for video in recent_activity
        ]
    }