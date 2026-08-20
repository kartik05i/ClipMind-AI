from transformers import pipeline
from sqlalchemy.orm import Session

from app.models.summary import Summary


summarizer = None


def get_summarizer():
    global summarizer

    if summarizer is None:
        print("Loading summarization model...", flush=True)

        summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn"
        )

        print("Summarization model loaded!", flush=True)

    return summarizer


def generate_summary(transcript: str) -> str:
    """
    Generate AI summary from transcript.
    """

    model = get_summarizer()

    result = model(
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