from transformers import pipeline
from sqlalchemy.orm import Session

from app.models.summary import Summary

# Load the model only once
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)


def generate_summary(transcript: str) -> str:
    """
    Generate AI summary from transcript.
    """

    result = summarizer(
        transcript,
        max_length=min(150, len(transcript.split()) // 2 + 20),
        min_length=20,
        do_sample=False,
    )

    return result[0]["summary_text"]


def save_summary(db: Session, video_id: int, summary_text: str):
    """
    Save summary into database.
    """

    summary = Summary(
        video_id=video_id,
        summary=summary_text
    )

    db.add(summary)
    db.commit()
    db.refresh(summary)

    return summary