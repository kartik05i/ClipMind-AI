from sentence_transformers import SentenceTransformer, util

model = None


def get_model():
    global model

    if model is None:
        print("Loading key moment model...", flush=True)

        model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        print("Key moment model loaded!", flush=True)

    return model


def detect_key_moments(timestamp_data, summary, top_k=5):
    """
    Detect important video segments by comparing each
    transcript segment with the generated summary.
    """

    if not timestamp_data:
        return []

    model = get_model()

    segment_texts = [
        segment["text"]
        for segment in timestamp_data
    ]

    summary_embedding = model.encode(
        summary,
        convert_to_tensor=True
    )

    segment_embeddings = model.encode(
        segment_texts,
        convert_to_tensor=True
    )

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

    key_moments.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return key_moments[:top_k]