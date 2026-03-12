const pipelineSteps = [
  "Vision Analysis",
  "Title + Description Generation",
  "Category Mapping",
  "Image Enhancement",
  "Packaging Template",
  "Compliance Validation",
  "Pricing Intelligence"
];

function PipelineTracker({ currentStep, isComplete }) {
  return (
    <section className="card tracker-card">
      <div>
        <h2>2. AI Pipeline Status</h2>
        <p>Watch your product launch stack build in real time.</p>
      </div>
      <ul className="pipeline-list">
        {pipelineSteps.map((step, index) => {
          const isDone = isComplete || index < currentStep;
          const isActive = !isComplete && index === currentStep;
          return (
            <li
              key={step}
              className={`pipeline-item ${isDone ? "done" : ""} ${
                isActive ? "active" : ""
              }`}
            >
              <span className="dot" aria-hidden="true" />
              <span>{step}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default PipelineTracker;
