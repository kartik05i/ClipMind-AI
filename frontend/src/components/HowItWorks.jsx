function HowItWorks() {
  return (
    <section className="py-24 px-8 bg-slate-900">

      <h2 className="text-4xl font-bold text-center mb-16">
        How ClipMind AI Works
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-slate-800 p-8 rounded-2xl text-center">
          <div className="text-6xl mb-4">📤</div>

          <h3 className="text-2xl font-semibold mb-3">
            Upload Video
          </h3>

          <p className="text-gray-400">
            Upload any lecture, meeting, podcast or tutorial.
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl text-center">
          <div className="text-6xl mb-4">🧠</div>

          <h3 className="text-2xl font-semibold mb-3">
            AI Processing
          </h3>

          <p className="text-gray-400">
            Our AI analyzes speech, extracts transcripts and understands content.
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl text-center">
          <div className="text-6xl mb-4">📄</div>

          <h3 className="text-2xl font-semibold mb-3">
            Get Results
          </h3>

          <p className="text-gray-400">
            Receive summaries, key moments and important insights instantly.
          </p>
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;