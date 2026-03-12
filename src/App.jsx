import { useEffect, useMemo, useState } from "react";
import UploadPanel from "./components/UploadPanel";
import PipelineTracker from "./components/PipelineTracker";
import ResultDeck from "./components/ResultDeck";

const mockResult = {
  detectedProduct: "Handcrafted Soy Wax Candle",
  dimensions: "8 cm x 8 cm x 10 cm",
  weight: "280 g",
  title:
    "Handmade Lavender Soy Wax Candle - Long Burn Aromatherapy Jar for Home Decor",
  description:
    "A premium handcrafted soy wax candle infused with calming lavender notes. Designed for clean burning and long-lasting fragrance, this candle is ideal for bedrooms, meditation corners, and gifting. Eco-friendly wax blend, minimal soot, and reusable glass jar included.",
  category: "Home & Kitchen > Home Decor > Candles",
  compliance: [
    "Label: ingredient list and net quantity required",
    "Add flammability caution on outer box",
    "No BIS mandate detected for this product type"
  ],
  price: "INR 349",
  competitiveBand: "INR 299 - INR 399",
  packaging: "Tuck-end carton, 9 x 9 x 12 cm"
};

const TOTAL_STEPS = 7;
const PRODUCT_SCENES = [
  {
    name: "Ceramic Mug",
    strap: "Photo to Listing",
    desc:
      "Convert a simple mug photo into marketplace-ready content with title, category, packaging fit, and launch price.",
    badge: "Home & Kitchen",
    price: "INR 499",
    tone: "peach",
    shape: "mug",
    highlights: ["White background images", "SEO title draft", "Box size suggestion"]
  },
  {
    name: "Glow Serum",
    strap: "Packaging Intelligence",
    desc:
      "Detect bottle profile, generate compliance hints, and prepare launch visuals for beauty marketplace listings.",
    badge: "Beauty",
    price: "INR 799",
    tone: "mint",
    shape: "bottle",
    highlights: ["Ingredient claim notes", "Lifestyle visual prompt", "Premium price band"]
  },
  {
    name: "Soy Candle",
    strap: "Visual Launch Kit",
    desc:
      "Generate warm branding copy, category mapping, and carton dimensions from one handcrafted candle image.",
    badge: "Decor",
    price: "INR 349",
    tone: "lavender",
    shape: "jar",
    highlights: ["Aromatherapy copy", "Giftable packaging", "Amazon-ready bullets"]
  },
  {
    name: "Snack Pouch",
    strap: "Market Fit Output",
    desc:
      "Create a polished snack listing with dimension estimates, category placement, compliance tags, and pricing.",
    badge: "Food",
    price: "INR 199",
    tone: "sky",
    shape: "pouch",
    highlights: ["FSSAI prompt hints", "Shelf appeal visuals", "Competitive pricing"]
  }
];

function App() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneDirection, setSceneDirection] = useState("next");

  useEffect(() => {
    if (!file) {
      setImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    if (!isGenerating) return undefined;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= TOTAL_STEPS) {
          clearInterval(interval);
          setIsGenerating(false);
          setIsComplete(true);
          setResult(mockResult);
          return TOTAL_STEPS;
        }
        return next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSceneDirection("next");
      setSceneIndex((prev) => (prev + 1) % PRODUCT_SCENES.length);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  const subtitle = useMemo(() => {
    if (!file) return "Waiting for product image";
    if (isGenerating) return "AI agents are building your launch package";
    if (result) return "Launch package ready for export";
    return "Image uploaded";
  }, [file, isGenerating, result]);

  const activeScene = PRODUCT_SCENES[sceneIndex];

  function jumpTo(sectionId) {
    const node = document.getElementById(sectionId);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    setResult(null);
    setCurrentStep(0);
    setIsComplete(false);
    setIsGenerating(false);
  }

  function handleGenerate() {
    if (!file) return;
    setResult(null);
    setCurrentStep(0);
    setIsComplete(false);
    setIsGenerating(true);
  }

  function changeScene(step) {
    setSceneDirection(step > 0 ? "next" : "prev");
    setSceneIndex((prev) => (prev + step + PRODUCT_SCENES.length) % PRODUCT_SCENES.length);
  }

  function jumpScene(index) {
    if (index === sceneIndex) return;
    setSceneDirection(index > sceneIndex ? "next" : "prev");
    setSceneIndex(index);
  }

  return (
    <main className="app-shell">
      <div className="bg-orb orb-left" aria-hidden="true" />
      <div className="bg-orb orb-right" aria-hidden="true" />

      <div className="content-wrap">
        <header className="top-strip" id="home">
          <div className="brand-mark">Zeno Studio</div>
          <nav className="top-nav">
            <button type="button" onClick={() => jumpTo("home")}>
              Home
            </button>
            <button type="button" onClick={() => jumpTo("products")}>
              Products
            </button>
            <button type="button" onClick={() => jumpTo("workflow")}>
              Workflow
            </button>
            <button type="button" onClick={() => jumpTo("launch")}>
              Launch
            </button>
          </nav>
          <p className="handle">Pastel Motion UI</p>
        </header>

        <section className={`hero-frame tone-${activeScene.tone}`} aria-label="Animated product showcase">
          <div key={`scene-copy-${sceneIndex}`} className={`hero-copy scene-copy scene-copy-${sceneDirection}`}>
            <p className="eyebrow">AI Product Launch Studio</p>
            <h1>{activeScene.name}</h1>
            <h2>{activeScene.strap}</h2>
            <p>{activeScene.desc}</p>

            <div className="scene-points">
              {activeScene.highlights.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>

            <div className="hero-actions">
              <button type="button" className="primary-cta" onClick={() => jumpTo("launch")}>
                Start Building
              </button>
              <button type="button" className="secondary-cta" onClick={() => jumpTo("workflow")}>
                Watch Workflow
              </button>
            </div>
          </div>

          <div key={`stage-${sceneIndex}`} className={`hero-stage scene-copy scene-copy-${sceneDirection}`}>
            <div className="stage-glow" />
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="orbit orbit-c" />

            <div className={`product product-${activeScene.shape}`}>
              <span className="product-badge">{activeScene.badge}</span>
              <span className="product-price">{activeScene.price}</span>
            </div>

            <div className="floating-card floating-card-top">
              <strong>AI Visuals</strong>
              <span>Studio background + lifestyle shot</span>
            </div>

            <div className="floating-card floating-card-right">
              <strong>Packaging</strong>
              <span>Auto carton suggestion</span>
            </div>

            <div className="floating-card floating-card-left">
              <strong>Pricing</strong>
              <span>Competitive launch band</span>
            </div>

            <span className="pastel-orb orb-small orb-small-a" />
            <span className="pastel-orb orb-small orb-small-b" />
            <span className="pastel-orb orb-small orb-small-c" />
          </div>

          <button type="button" className="hero-nav hero-left" onClick={() => changeScene(-1)}>
            &lt;
          </button>
          <button type="button" className="hero-nav hero-right" onClick={() => changeScene(1)}>
            &gt;
          </button>

          <div className="scene-dots">
            {PRODUCT_SCENES.map((scene, index) => (
              <button
                key={scene.name}
                type="button"
                className={`scene-dot ${index === sceneIndex ? "active" : ""}`}
                onClick={() => jumpScene(index)}
                aria-label={`Go to ${scene.name}`}
              />
            ))}
          </div>
        </section>

        <section id="products" className="product-strip">
          {PRODUCT_SCENES.map((scene, index) => (
            <button
              key={scene.name}
              type="button"
              className={`product-pill ${index === sceneIndex ? "active" : ""}`}
              onClick={() => jumpScene(index)}
            >
              <span>{scene.name}</span>
              <small>{scene.badge}</small>
            </button>
          ))}
        </section>

        <section id="studio" className="section-intro soft-card">
          <h2>One Photo. Full Launch Kit.</h2>
          <p>
            Product recognition, listing copy, packaging guidance, compliance prompts,
            and pricing intelligence are all presented in a single pastel motion-first UI.
          </p>
        </section>

        <p className="status-line" id="workflow">
          <span className="pulse" aria-hidden="true" />
          {subtitle}
        </p>

        <section className="layout-grid" id="launch">
          <UploadPanel
            file={file}
            onFileChange={handleFileChange}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          <PipelineTracker currentStep={currentStep} isComplete={isComplete} />
        </section>

        <ResultDeck result={result} imagePreview={imagePreview} />
      </div>
    </main>
  );
}

export default App;
