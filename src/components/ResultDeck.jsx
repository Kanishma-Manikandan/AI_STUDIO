function ResultDeck({ result, imagePreview }) {
  if (!result) {
    return (
      <section className="card result-card muted">
        <h2>3. Generated Launch Package</h2>
        <p>Your marketplace-ready content will appear here after generation.</p>
      </section>
    );
  }

  return (
    <section className="card result-card">
      <h2>3. Generated Launch Package</h2>
      <div className="result-grid">
        <article className="panel">
          <h3>Listing Content</h3>
          <p className="field-label">Title</p>
          <p>{result.title}</p>
          <p className="field-label">Description</p>
          <p>{result.description}</p>
          <p className="field-label">Suggested Category</p>
          <p>{result.category}</p>
        </article>

        <article className="panel">
          <h3>Product Intelligence</h3>
          <p className="field-label">Detected Product</p>
          <p>{result.detectedProduct}</p>
          <p className="field-label">Estimated Dimensions</p>
          <p>{result.dimensions}</p>
          <p className="field-label">Estimated Weight</p>
          <p>{result.weight}</p>
          <p className="field-label">Compliance Flags</p>
          <ul className="simple-list">
            {result.compliance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h3>Pricing + Packaging</h3>
          <p className="field-label">Suggested MRP</p>
          <p>{result.price}</p>
          <p className="field-label">Competitive Band</p>
          <p>{result.competitiveBand}</p>
          <p className="field-label">Packaging Template</p>
          <p>{result.packaging}</p>
          <button type="button" className="ghost">
            Download Dieline (Mock)
          </button>
        </article>

        <article className="panel image-panel">
          <h3>Generated Visual Preview</h3>
          {imagePreview ? (
            <img src={imagePreview} alt="Uploaded product preview" />
          ) : (
            <div className="placeholder-box">No preview</div>
          )}
          <p>Background cleanup and lifestyle variants are ready for export.</p>
        </article>
      </div>
    </section>
  );
}

export default ResultDeck;
