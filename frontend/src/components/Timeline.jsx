function Timeline() {
  const steps = [
    {
      number: "1",
      title: "Upload Video",
      description: "Upload any lecture, meeting or podcast.",
    },
    {
      number: "2",
      title: "AI Processing",
      description: "AI understands your content.",
    },
    {
      number: "3",
      title: "Generate Transcript",
      description: "Accurate transcript in seconds.",
    },
    {
      number: "4",
      title: "Smart Summary",
      description: "AI creates concise notes instantly.",
    },
  ];

  return (
    <div className="mt-12 space-y-8">
      {steps.map((step) => (
        <div key={step.number} className="flex items-start gap-5">
          {/* Number Circle */}
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
            {step.number}
          </div>

          {/* Text */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {step.title}
            </h3>

            <p className="text-gray-600 mt-1">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;