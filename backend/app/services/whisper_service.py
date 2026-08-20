from faster_whisper import WhisperModel

model = None


def get_model():
    global model

    if model is None:
        model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
        )

    return model


def generate_transcript(audio_path: str):
    """
    Generate transcript along with timestamps.
    """

    model = get_model()

    segments, info = model.transcribe(audio_path)

    transcript = ""
    timestamp_data = []

    for segment in segments:
        transcript += segment.text + " "

        timestamp_data.append({
            "start": round(segment.start, 2),
            "end": round(segment.end, 2),
            "text": segment.text.strip()
        })

    return transcript.strip(), timestamp_data