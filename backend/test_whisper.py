from app.services.whisper_service import generate_transcript

audio_path = "processed/circle.wav"

transcript = generate_transcript(audio_path)

print(transcript)