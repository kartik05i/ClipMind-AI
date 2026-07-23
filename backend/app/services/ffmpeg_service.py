import os
import ffmpeg

PROCESSED_DIR = "processed"


def extract_audio(video_path: str) -> str:
    """
    Extract audio from uploaded video.
    """

    os.makedirs(PROCESSED_DIR, exist_ok=True)

    filename = os.path.splitext(os.path.basename(video_path))[0]
    audio_path = os.path.join(PROCESSED_DIR, f"{filename}.wav")

    (
        ffmpeg
        .input(video_path)
        .output(audio_path, ac=1, ar=16000)
        .overwrite_output()
        .run(quiet=True)
    )

    return audio_path