from keybert import KeyBERT

# Load model once
kw_model = KeyBERT()


def extract_keywords(transcript: str, top_n: int = 10):
    """
    Extract important keywords from transcript.
    """

    keywords = kw_model.extract_keywords(
        transcript,
        keyphrase_ngram_range=(1, 2),
        stop_words="english",
        top_n=top_n
    )

    return [
        keyword
        for keyword, score in keywords
    ]