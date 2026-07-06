function Features() {

    const features = [
        {
            icon: "🎥",
            title: "Video Upload",
            desc: "Upload videos of any length in seconds."
        },
        {
            icon: "📝",
            title: "AI Transcript",
            desc: "Generate highly accurate transcripts automatically."
        },
        {
            icon: "📄",
            title: "Smart Summary",
            desc: "Understand long videos with concise summaries."
        },
        {
            icon: "⭐",
            title: "Key Moments",
            desc: "Jump directly to the most important parts."
        },
        {
            icon: "📊",
            title: "Analytics",
            desc: "View insights about your processed videos."
        },
        {
            icon: "⬇️",
            title: "Export Notes",
            desc: "Download summaries as PDF or text."
        }
    ];

    return (
        <section className="py-24 px-8 bg-slate-950">

            <h2 className="text-4xl font-bold text-center mb-16">
                Powerful Features
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

                {features.map((feature) => (

                    <div
                        key={feature.title}
                        className="bg-slate-800 rounded-2xl p-8 hover:bg-slate-700 transition duration-300"
                    >

                        <div className="text-5xl mb-5">
                            {feature.icon}
                        </div>

                        <h3 className="text-2xl font-semibold mb-4">
                            {feature.title}
                        </h3>

                        <p className="text-gray-400">
                            {feature.desc}
                        </p>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default Features;