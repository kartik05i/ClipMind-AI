from sqlalchemy.orm import Session

from app.models.transcript import Transcript


def save_transcript(
    db: Session,
    video_id: int,
    transcript_text: str
):
    transcript = Transcript(
        video_id=video_id,
        transcript=transcript_text
    )

    db.add(transcript)
    db.commit()
    db.refresh(transcript)

    return transcript