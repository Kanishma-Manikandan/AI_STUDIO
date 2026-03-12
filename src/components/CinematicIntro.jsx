const RING_LABELS = ["UPLOAD", "ANALYZE", "LISTING", "PACKAGING", "PRICING"];

const TOP_TAGS = ["Studio", "Motion", "Launch", "AI Product"];

function CinematicIntro() {
  return (
    <section className="cinematic-intro" aria-label="Product launch visual intro">
      <div className="cinematic-tags">
        {TOP_TAGS.map((tag) => (
          <span key={tag} className="cinematic-tag">
            {tag}
          </span>
        ))}
        <span className="cinematic-tag right">@zeno-launch</span>
      </div>

      <div className="cinematic-stage">
        <div className="stage-copy">
          <p className="stage-kicker">Product Launch Studio</p>
          <h2>Photo to marketplace-ready listing in one cinematic workflow</h2>
          <p>
            Vision AI, content generation, pricing intelligence, and packaging in one
            guided launch board.
          </p>
        </div>

        <button type="button" className="nav-circle nav-prev" aria-label="Previous">
          &lt;
        </button>
        <button type="button" className="nav-circle nav-next" aria-label="Next">
          &gt;
        </button>

        <div className="ring-wrap" aria-hidden="true">
          <div className="ring ring-outer" />
          <div className="ring ring-inner" />

          {RING_LABELS.map((label, index) => (
            <span key={label} className={`ring-label ring-label-${index + 1}`}>
              {label}
            </span>
          ))}

          <div className="focus-product">
            <div className="product-cap" />
            <span>ZENO</span>
          </div>

          <span className="berry berry-a" />
          <span className="berry berry-b" />
          <span className="berry berry-c" />
          <span className="berry berry-d" />
        </div>
      </div>
    </section>
  );
}

export default CinematicIntro;