import { useEffect, useMemo, useState } from "react";
import UploadPanel from "./components/UploadPanel";
import PipelineTracker from "./components/PipelineTracker";
import ResultDeck from "./components/ResultDeck";

const RESULT_TEMPLATES = {
  bottle: {
    detectedProduct: "Insulated Water Bottle",
    dimensions: "7 cm x 7 cm x 26 cm",
    weight: "420 g",
    title:
      "Stainless Steel Insulated Water Bottle - Leakproof Sports Flask - 750ml",
    description:
      "A durable insulated water bottle designed for all-day hydration. Double-wall stainless steel body helps maintain temperature, while the leakproof cap and slim profile make it ideal for travel, gym, and office use.",
    category: "Home & Kitchen > Kitchen & Dining > Water Bottles",
    compliance: [
      "Add capacity (ml) and material details on listing",
      "Mention BPA-free claim only if validated",
      "Include care instructions and warranty terms"
    ],
    price: "INR 699",
    competitiveBand: "INR 499 - INR 899",
    packaging: "Bottle carton with neck support, 8 x 8 x 28 cm"
  },
  mug: {
    detectedProduct: "Ceramic Coffee Mug",
    dimensions: "9 cm x 9 cm x 10 cm",
    weight: "360 g",
    title: "Premium Ceramic Coffee Mug - 350ml - Microwave Safe Tea Cup",
    description:
      "A modern ceramic mug built for daily coffee and tea moments. Comfortable grip, heat-resistant body, and clean finish make it perfect for home and office setups.",
    category: "Home & Kitchen > Kitchen & Dining > Cups, Mugs & Saucers",
    compliance: [
      "Mention food-safe glaze details",
      "Add microwave and dishwasher compatibility",
      "Include quantity per pack"
    ],
    price: "INR 499",
    competitiveBand: "INR 299 - INR 599",
    packaging: "Mug-safe box with inserts, 11 x 11 x 12 cm"
  },
  candle: {
    detectedProduct: "Handcrafted Soy Wax Candle",
    dimensions: "8 cm x 8 cm x 10 cm",
    weight: "280 g",
    title:
      "Handmade Lavender Soy Wax Candle - Long Burn Aromatherapy Jar for Home Decor",
    description:
      "A premium handcrafted soy wax candle infused with calming lavender notes. Designed for clean burning and long-lasting fragrance, this candle is ideal for bedrooms, meditation corners, and gifting.",
    category: "Home & Kitchen > Home Decor > Candles",
    compliance: [
      "Label: ingredient list and net quantity required",
      "Add flammability caution on outer box",
      "No BIS mandate detected for this product type"
    ],
    price: "INR 349",
    competitiveBand: "INR 299 - INR 399",
    packaging: "Tuck-end carton, 9 x 9 x 12 cm"
  },
  pouch: {
    detectedProduct: "Stand-up Snack Pouch",
    dimensions: "14 cm x 4 cm x 22 cm",
    weight: "90 g (pack)",
    title: "Crunchy Millet Snack Pouch - Roasted - Travel Friendly Resealable Pack",
    description:
      "A shelf-ready snack pouch with clean front branding and practical storage. Suitable for quick bites, gifting packs, and modern retail shelves.",
    category: "Grocery & Gourmet Foods > Snacks > Chips & Crisps",
    compliance: [
      "Display FSSAI number on artwork",
      "Add net quantity and nutrition table",
      "Mention allergen information if applicable"
    ],
    price: "INR 199",
    competitiveBand: "INR 149 - INR 249",
    packaging: "Primary pouch + mono-carton, 15 x 5 x 23 cm"
  },
  generic: {
    detectedProduct: "Lifestyle Product",
    dimensions: "10 cm x 10 cm x 12 cm",
    weight: "300 g",
    title: "Premium Lifestyle Product - Marketplace Ready Listing",
    description:
      "A versatile product listing generated from your uploaded image with SEO-ready content, packaging guidance, and launch pricing recommendations.",
    category: "Home & Kitchen > Everyday Essentials",
    compliance: [
      "Add accurate material specification",
      "Mention country of origin",
      "Include size and usage details"
    ],
    price: "INR 399",
    competitiveBand: "INR 299 - INR 499",
    packaging: "Protective carton, 12 x 12 x 14 cm"
  }
};

const TOTAL_STEPS = 7;
const PRODUCT_SCENES = [
  {
    id: "snack-pouch",
    name: "Snack Pouch",
    strap: "Market Fit Output",
    desc:
      "Create a polished snack listing with dimension estimates, category placement, compliance tags, and pricing.",
    badge: "Food",
    price: "INR 199",
    tone: "sky",
    shape: "pouch",
    highlights: ["FSSAI prompt hints", "Shelf appeal visuals", "Competitive pricing"],
    defaultImage: "/scene-images/01-snack-pouch.jpg"
  },
  {
    id: "ceramic-mug",
    name: "Ceramic Mug",
    strap: "Photo to Listing",
    desc:
      "Convert a simple mug photo into marketplace-ready content with title, category, packaging fit, and launch price.",
    badge: "Home & Kitchen",
    price: "INR 499",
    tone: "peach",
    shape: "mug",
    highlights: ["White background images", "SEO title draft", "Box size suggestion"],
    defaultImage: "/scene-images/02-ceramic-mug.jpg"
  },
  {
    id: "glow-serum",
    name: "Glow Serum",
    strap: "Packaging Intelligence",
    desc:
      "Detect bottle profile, generate compliance hints, and prepare launch visuals for beauty marketplace listings.",
    badge: "Beauty",
    price: "INR 799",
    tone: "mint",
    shape: "bottle",
    highlights: ["Ingredient claim notes", "Lifestyle visual prompt", "Premium price band"],
    defaultImage: "/scene-images/03-glow-serum.jpg"
  },
  {
    id: "soy-candle",
    name: "Soy Candle",
    strap: "Visual Launch Kit",
    desc:
      "Generate warm branding copy, category mapping, and carton dimensions from one handcrafted candle image.",
    badge: "Decor",
    price: "INR 349",
    tone: "lavender",
    shape: "jar",
    highlights: ["Aromatherapy copy", "Giftable packaging", "Amazon-ready bullets"],
    defaultImage: "/scene-images/04-soy-candle.jpg"
  }
];

function App() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [enhancedPreview, setEnhancedPreview] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [pendingResult, setPendingResult] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneDirection, setSceneDirection] = useState("next");

  useEffect(() => {
    if (!file) {
      setImagePreview("");
      setEnhancedPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    let isDisposed = false;
    enhanceImageFromFile(file).then((url) => {
      if (!isDisposed) {
        setEnhancedPreview(url || objectUrl);
      }
    });

    return () => {
      isDisposed = true;
      URL.revokeObjectURL(objectUrl);
    };
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
          setResult(pendingResult || RESULT_TEMPLATES.generic);
          return TOTAL_STEPS;
        }
        return next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isGenerating, pendingResult]);

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
    setPendingResult(null);
    setCurrentStep(0);
    setIsComplete(false);
    setIsGenerating(false);
  }

  function handleGenerate() {
    if (!file) return;
    setResult(null);
    setPendingResult(buildResultForFile(file, activeScene.shape));
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

  const activeSceneImage = activeScene.defaultImage || "";

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

          <div
            key={`stage-${sceneIndex}`}
            className={`hero-stage scene-copy scene-copy-${sceneDirection}`}
          >
            <div className="stage-glow" />
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="orbit orbit-c" />

            <div className={`product product-${activeScene.shape}`}>
              {activeSceneImage ? (
                <img
                  className="scene-photo"
                  src={activeSceneImage}
                  alt={`${activeScene.name} showcase`}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
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

        <ResultDeck
          result={result}
          imagePreview={imagePreview}
          enhancedPreview={enhancedPreview || imagePreview}
        />
      </div>
    </main>
  );
}

function inferProductKey(fileName, fallbackShape) {
  const name = (fileName || "").toLowerCase();
  if (/(bottle|flask|serum|water)/.test(name)) return "bottle";
  if (/(mug|cup|coffee|tea)/.test(name)) return "mug";
  if (/(candle|jar|wax)/.test(name)) return "candle";
  if (/(snack|chips|pouch|pack)/.test(name)) return "pouch";

  if (fallbackShape === "bottle") return "bottle";
  if (fallbackShape === "mug") return "mug";
  if (fallbackShape === "jar") return "candle";
  if (fallbackShape === "pouch") return "pouch";
  return "generic";
}

function buildResultForFile(selectedFile, fallbackShape) {
  const key = inferProductKey(selectedFile?.name, fallbackShape);
  return RESULT_TEMPLATES[key] || RESULT_TEMPLATES.generic;
}

function enhanceImageFromFile(selectedFile) {
  return new Promise((resolve) => {
    const sourceUrl = URL.createObjectURL(selectedFile);
    const image = new Image();

    image.onload = () => {
      const maxDim = 1300;
      const scale = Math.min(1, maxDim / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(sourceUrl);
        resolve("");
        return;
      }

      ctx.filter = "contrast(1.12) saturate(1.18) brightness(1.06)";
      ctx.drawImage(image, 0, 0, width, height);

      // Soft focus center light to mimic studio-style enhancement.
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        width * 0.1,
        width * 0.5,
        height * 0.5,
        width * 0.9
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.14)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      URL.revokeObjectURL(sourceUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };

    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      resolve("");
    };

    image.src = sourceUrl;
  });
}

export default App;
