def format_time(seconds):
    """
    Convert seconds into MM:SS format.
    """

    minutes = int(seconds // 60)
    seconds = int(seconds % 60)

    return f"{minutes:02}:{seconds:02}"


def generate_highlight_report(key_moments):
    """
    Generate a readable highlight report.
    """

    report = []

    report.append("========== VIDEO HIGHLIGHTS ==========\n")

    for moment in key_moments:

        report.append(
            f"{format_time(moment['start'])}"
        )

        report.append(
            moment["text"]
        )

        report.append("")

    return "\n".join(report)