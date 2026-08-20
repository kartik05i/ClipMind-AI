from transformers import pipeline


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


def generate_notes(transcript: str) -> str:
    """
    Generate study notes from transcript.
    """

    model = get_summarizer()

    result = model(
        transcript,
        max_length=min(250, len(transcript.split()) // 2 + 50),
        min_length=50,
        do_sample=False,
    )

    return result[0]["summary_text"]


def generate_flashcards(transcript: str):
    """
    Generate simple flashcards from transcript.
    """

    model = get_summarizer()

    result = model(
        transcript,
        max_length=min(300, len(transcript.split()) // 2 + 80),
        min_length=80,
        do_sample=False,
    )

    summary = result[0]["summary_text"]

    sentences = [
        sentence.strip()
        for sentence in summary.split(".")
        if sentence.strip()
    ]

    flashcards = []

    for index, sentence in enumerate(sentences[:10]):
        flashcards.append(
            {
                "question": f"What is an important concept {index + 1} from this video?",
                "answer": sentence
            }
        )

    return flashcards


def generate_quiz(transcript: str):
    """
    Generate a simple quiz from transcript.
    """

    model = get_summarizer()

    result = model(
        transcript,
        max_length=min(300, len(transcript.split()) // 2 + 80),
        min_length=80,
        do_sample=False,
    )

    summary = result[0]["summary_text"]

    sentences = [
        sentence.strip()
        for sentence in summary.split(".")
        if sentence.strip()
    ]

    questions = []

    for index, sentence in enumerate(sentences[:5]):
        questions.append(
            {
                "question": f"Explain the following concept: {sentence}?",
                "options": [],
                "answer": sentence
            }
        )

    return questions