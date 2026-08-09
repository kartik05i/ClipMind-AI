from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.video import Video
from app.models.transcript import Transcript
from app.models.keyword import Keyword

from app.services.keyword_service import extract_keywords

router = APIRouter(
    prefix="/keywords",
    tags=["Keywords"]
)


@router.post("/generate/{video_id}")
def generate_keywords(
    video_id: int,
    db: Session = Depends(get_db)
):
    """
    Generate keywords from transcript.
    """

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

    keywords = extract_keywords(
        transcript.transcript
    )

    # Delete previously generated keywords
    db.query(Keyword).filter(
        Keyword.video_id == video_id
    ).delete()

    # Save keywords
    for word in keywords:

        db.add(
            Keyword(
                video_id=video_id,
                keyword=word
            )
        )

    db.commit()

    saved_keywords = (
        db.query(Keyword)
        .filter(Keyword.video_id == video_id)
        .all()
    )

    return {
        "message": "Keywords generated successfully",
        "video_id": video_id,
        "keywords": [
            item.keyword
            for item in saved_keywords
        ]
    }


@router.get("/{video_id}")
def get_keywords(
    video_id: int,
    db: Session = Depends(get_db)
):

    keywords = (
        db.query(Keyword)
        .filter(Keyword.video_id == video_id)
        .all()
    )

    if not keywords:
        raise HTTPException(
            status_code=404,
            detail="Keywords not found"
        )

    return {
        "video_id": video_id,
        "keywords": [
            item.keyword
            for item in keywords
        ]
    }