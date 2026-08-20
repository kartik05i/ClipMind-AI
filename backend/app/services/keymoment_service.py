from sentence_transformers import SentenceTransformer, util

# Load model once
model = SentenceTransformer("all-MiniLM-L6-v2")


def detect_key_moments(timestamp_data, summary, top_k=5):
    """
    Detect important video segments by comparing each
    transcript segment with the generated summary.
    """

    if not timestamp_data:
        return []

    # Transcript segment texts
    segment_texts = [
        segment["text"]
        for segment in timestamp_data
    ]

    # Generate embeddings
    summary_embedding = model.encode(
        summary,
        convert_to_tensor=True
    )

    segment_embeddings = model.encode(
        segment_texts,
        convert_to_tensor=True
    )

    # Similarity scores
    scores = util.cos_sim(
        summary_embedding,
        segment_embeddings
    )[0]

    key_moments = []

    for i, score in enumerate(scores):
        key_moments.append({
            "start": timestamp_data[i]["start"],
            "end": timestamp_data[i]["end"],
            "text": timestamp_data[i]["text"],
            "score": round(float(score), 3)
        })

    # Highest score first
    key_moments.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return key_moments[:top_k]