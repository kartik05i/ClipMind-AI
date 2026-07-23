from faster_whisper import WhisperModel

# Load the model once when the application starts
model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)


def generate_transcript(audio_path: str) -> str:
    """
    Generate transcript from an audio file.
    """

    segments, info = model.transcribe(audio_path)

    transcript = ""

    for segment in segments:
        transcript += segment.text + " "

    return transcript.strip()