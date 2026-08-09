from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.video import Video
from app.models.summary import Summary
from app.models.transcript import Transcript
from app.models.highlight import Highlight

from app.services.ffmpeg_service import extract_audio
from app.services.whisper_service import generate_transcript
from app.services.keymoment_service import detect_key_moments
from app.services.highlight_service import generate_highlight_report

router = APIRouter(
    prefix="/highlights",
    tags=["Highlights"]
)


@router.post("/generate/{video_id}")
def generate_highlights(
    video_id: int,
    db: Session = Depends(get_db)
):

    # Check video
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

    # Generate timestamps
    audio_path = extract_audio(video.filepath)

    _, timestamp_data = generate_transcript(audio_path)

    # Detect key moments
    key_moments = detect_key_moments(
        timestamp_data,
        summary.summary
    )

    # Generate report
    report = generate_highlight_report(
        key_moments
    )

    # Delete previous report
    db.query(Highlight).filter(
        Highlight.video_id == video_id
    ).delete()

    # Save report
    db.add(
        Highlight(
            video_id=video_id,
            report=report
        )
    )

    db.commit()

    saved_report = (
        db.query(Highlight)
        .filter(Highlight.video_id == video_id)
        .first()
    )

    return {
        "message": "Highlight report generated successfully",
        "video_id": video_id,
        "highlight_report": saved_report.report
    }


@router.get("/{video_id}")
def get_highlights(
    video_id: int,
    db: Session = Depends(get_db)
):

    report = (
        db.query(Highlight)
        .filter(Highlight.video_id == video_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Highlight report not found"
        )

    return {
        "video_id": video_id,
        "highlight_report": report.report
    }