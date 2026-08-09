from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.video import Video
from app.models.transcript import Transcript
from app.models.summary import Summary
from app.models.keymoment import KeyMoment

from app.services.ffmpeg_service import extract_audio
from app.services.whisper_service import generate_transcript
from app.services.keymoment_service import detect_key_moments

router = APIRouter(
    prefix="/keymoments",
    tags=["Key Moments"]
)


@router.post("/generate/{video_id}")
def generate_key_moments(
    video_id: int,
    db: Session = Depends(get_db)
):
    """
    Generate important video segments.
    """

    # Check if video exists
    video = (
        db.query(Video)
        .filter(Video.id == video_id)
        .first()
    )

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )

    # Check transcript
    transcript = (
        db.query(Transcript)
        .filter(Transcript.video_id == video_id)
        .first()
    )

    if not transcript:
        raise HTTPException(
            status_code=404,
            detail="Transcript not found"
        )

    # Check summary
    summary = (
        db.query(Summary)
        .filter(Summary.video_id == video_id)
        .first()
    )

    if not summary:
        raise HTTPException(
            status_code=404,
            detail="Summary not found"
        )

    # Extract timestamps again
    audio_path = extract_audio(video.filepath)

    _, timestamp_data = generate_transcript(audio_path)

    # Detect key moments
    key_moments = detect_key_moments(
        timestamp_data,
        summary.summary
    )

    # Remove previously generated key moments
    db.query(KeyMoment).filter(
        KeyMoment.video_id == video_id
    ).delete()

    # Save new key moments
    for moment in key_moments:

        db.add(
            KeyMoment(
                video_id=video_id,
                start_time=moment["start"],
                end_time=moment["end"],
                text=moment["text"],
                score=moment["score"],
            )
        )

    db.commit()

    saved_key_moments = (
        db.query(KeyMoment)
        .filter(KeyMoment.video_id == video_id)
        .order_by(KeyMoment.start_time)
        .all()
    )

    return {
        "message": "Key moments generated successfully",
        "video_id": video_id,
        "key_moments": [
            {
                "start": item.start_time,
                "end": item.end_time,
                "text": item.text,
                "score": item.score,
            }
            for item in saved_key_moments
        ]
    }


@router.get("/{video_id}")
def get_key_moments(
    video_id: int,
    db: Session = Depends(get_db)
):
    key_moments = (
        db.query(KeyMoment)
        .filter(KeyMoment.video_id == video_id)
        .order_by(KeyMoment.start_time)
        .all()
    )

    if not key_moments:
        raise HTTPException(
            status_code=404,
            detail="Key moments not found"
        )

    return {
        "video_id": video_id,
        "key_moments": [
            {
                "start": item.start_time,
                "end": item.end_time,
                "text": item.text,
                "score": item.score,
            }
            for item in key_moments
        ]
    }