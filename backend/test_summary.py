from app.services.summary_service import generate_summary

transcript = """
Try to measure a circle. The diameter and radius are easy.
To get the circumference, you need measuring tape or a piece of string.
The ratio between the circumference and diameter is called pi.
Pi is an irrational number and continues forever.
It is widely used in mathematics, engineering, physics, and science.
"""

summary = generate_summary(transcript)

print(summary)