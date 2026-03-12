function UploadPanel({ file, onFileChange, onGenerate, isGenerating }) {
  return (
    <section className="card upload-card">
      <div>
        <h2>1. Upload Product Photo</h2>
        <p>Supported formats: JPG, PNG, WEBP</p>
      </div>

      <label className="upload-zone" htmlFor="product-upload">
        <input
          id="product-upload"
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <span className="upload-title">
          {file ? file.name : "Drop image here or click to browse"}
        </span>
        <span className="upload-hint">
          Tip: clean, front-facing photos produce better listing output.
        </span>
      </label>

      <button type="button" onClick={onGenerate} disabled={!file || isGenerating}>
        {isGenerating ? "Generating Launch Package..." : "Generate Listing Package"}
      </button>
    </section>
  );
}

export default UploadPanel;
