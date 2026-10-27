import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SlideNavigation from "./SlideNavigation";

// Relative heights and market hierarchy: TAM (94%) > SAM (68%) > SOM (42%).
const MARKET_LAYERS = [
  {
    id: "tam",
    name: "TAM",
    fullName: "Total Addressable Market",
    color: "#4b91ff",
    height: "94%",
    secondaryHeight: "82%",
    numericValue: 94,
    secondaryNumericValue: 82,
    value: "94%",
    secondaryValue: "82%",
  },
  {
    id: "sam",
    name: "SAM",
    fullName: "Serviceable Available Market",
    color: "#8464ff",
    height: "68%",
    secondaryHeight: "58%",
    numericValue: 68,
    secondaryNumericValue: 58,
    value: "68%",
    secondaryValue: "58%",
  },
  {
    id: "som",
    name: "SOM",
    fullName: "Serviceable Obtainable Market",
    color: "#b79aff",
    height: "42%",
    secondaryHeight: "34%",
    numericValue: 42,
    secondaryNumericValue: 34,
    value: "42%",
    secondaryValue: "34%",
  },
];

// Ordered from left (smaller) to right (larger):
// Left: MSME Owners, First Jobbers (smaller)
// Center: Resident Doctors, Content Creators (medium)
// Right: Govt Employees, CFO Homemakers (larger)
const MARKET_BUBBLES = [
  { id: "msme-owners", line1: "MSME", line2: "Owners", color: "purple", sizeType: "small" },
  { id: "first-jobbers", line1: "First", line2: "Jobbers", color: "blue", sizeType: "small" },
  { id: "resident-doctors", line1: "Resident", line2: "Doctors", color: "cyan", sizeType: "medium" },
  { id: "content-creators", line1: "Content", line2: "Creators", color: "cyan", sizeType: "medium" },
  { id: "govt-employees", line1: "Govt", line2: "Employees", color: "violet", sizeType: "large" },
  { id: "cfo-homemakers", line1: "CFO", line2: "Homemakers", color: "blue", sizeType: "large" },
];

export default function MarketSizeSlide({ onPrevious, onContinue }) {
  const chartRef = useRef(null);
  const bubbleOrbRef = useRef(null);
  const mobileFloatingRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;
    const orb = bubbleOrbRef.current;
    const mobileFloating = mobileFloatingRef.current;
    if (!chart) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        MARKET_LAYERS.forEach((layer) => {
          const valEl = chart.querySelector(`#val-${layer.id}`);
          if (valEl) valEl.textContent = layer.value;
          const pBar = chart.querySelector(`.market-bar--primary-${layer.id}`);
          if (pBar) pBar.style.height = layer.height;
          const sBar = chart.querySelector(`.market-bar--secondary-${layer.id}`);
          if (sBar) sBar.style.height = layer.secondaryHeight;
        });
        return;
      }

      // 1. Animate bar heights rising from baseline
      MARKET_LAYERS.forEach((layer, i) => {
        const pBar = chart.querySelector(`.market-bar--primary-${layer.id}`);
        const sBar = chart.querySelector(`.market-bar--secondary-${layer.id}`);

        if (pBar) {
          gsap.fromTo(
            pBar,
            { height: "0%", opacity: 0.2 },
            {
              height: layer.height,
              opacity: 1,
              duration: 1.1,
              delay: i * 0.12,
              ease: "power2.out",
            }
          );
        }

        if (sBar) {
          gsap.fromTo(
            sBar,
            { height: "0%", opacity: 0.2 },
            {
              height: layer.secondaryHeight,
              opacity: 0.75,
              duration: 1.1,
              delay: i * 0.12 + 0.05,
              ease: "power2.out",
            }
          );
        }

        // 2. Animate percentage counter
        const valEl = chart.querySelector(`#val-${layer.id}`);
        if (valEl) {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: layer.numericValue,
            duration: 1.1,
            delay: i * 0.12,
            ease: "power2.out",
            onUpdate: () => {
              valEl.textContent = `${Math.round(counter.val)}%`;
            },
          });
        }
      });

      // 3. Animate mobile free-floating bubbles with smooth sine float curves
      if (mobileFloating) {
        const mobileBubbles = mobileFloating.querySelectorAll(".market-mobile-bubble");
        const floatParams = [
          { y: -6, x: 4, dur: 2.8 },
          { y: 7, x: -4, dur: 3.1 },
          { y: -7, x: 4, dur: 2.7 },
          { y: 6, x: -4, dur: 3.0 },
          { y: -6, x: 5, dur: 3.3 },
          { y: 7, x: -4, dur: 2.9 },
        ];

        mobileBubbles.forEach((bubble, index) => {
          const param = floatParams[index % floatParams.length];
          gsap.to(bubble, {
            y: param.y,
            x: param.x,
            duration: param.dur,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.16,
          });
        });
      }

      // 4. Desktop large bubble orb animation (completely preserved)
      if (orb) {
        const bubbles = orb.querySelectorAll(".market-bubble");
        bubbles.forEach((bubble, index) => {
          gsap.to(bubble, {
            y: index % 2 === 0 ? -8 : 8,
            x: index % 2 === 0 ? 4 : -4,
            duration: 2.5 + index * 0.35,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.18,
          });
        });

        gsap.to(orb, {
          scale: 1.015,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, chart);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="market-size"
      className="market-size-slide deck-section"
      aria-label="TAM, SAM and SOM market opportunity"
    >
      <div className="market-size-slide__stars" aria-hidden="true" />

      <div className="market-size-slide__inner">
        <header className="market-size-slide__header slide-heading">
          <div className="slide-heading__content">
            <p className="market-size-slide__eyebrow slide-heading__eyebrow">
              <span />
              MARKET OPPORTUNITY
            </p>
            <h2 className="market-size-slide__heading">
              A market <span>within reach.</span>
            </h2>
          </div>
        </header>

        <div className="market-size-slide__content">
          {/* L-Shaped Bar Chart (Used on Desktop AND Mobile) */}
          <figure className="market-size-slide__visual">
            <div className="market-graphic">
              <div
                ref={chartRef}
                className="market-chart-desktop"
                role="img"
                aria-label="Conventional L-shaped chart for TAM, SAM and SOM. Heights show the broad-to-focused hierarchy with dual series."
              >
                {/* Chart Header & Legend */}
                <div className="market-chart__header">
                  <span className="market-chart__title">MARKET SCALE (% RELATIVE)</span>
                  <div className="market-chart__legend">
                    <span className="market-legend-item">
                      <span className="market-legend-dot market-legend-dot--primary" />
                      Primary
                    </span>
                    <span className="market-legend-item">
                      <span className="market-legend-dot market-legend-dot--secondary" />
                      Secondary
                    </span>
                  </div>
                </div>

                {/* Mobile Free-Floating Audience Bubbles (<600px, smaller left, larger right) */}
                <div
                  ref={mobileFloatingRef}
                  className="market-mobile-floating-area"
                  aria-hidden="true"
                >
                  {MARKET_BUBBLES.map((bubble, index) => (
                    <div
                      key={bubble.id}
                      className={`market-mobile-bubble market-mobile-bubble--${index + 1} market-mobile-bubble--${bubble.sizeType} market-bubble--${bubble.color}`}
                    >
                      <div className="market-mobile-bubble__ring" />
                      <span className="market-mobile-bubble__text">
                        {bubble.line1}
                        <br />
                        {bubble.line2}
                      </span>
                    </div>
                  ))}
                </div>

                {/* L-Shaped Chart Body */}
                <div className="market-chart__body">
                  {/* Thin vertical Y-axis with tick marks */}
                  <div className="market-chart__y-axis" aria-hidden="true">
                    <div className="market-chart__y-tick" style={{ bottom: "100%" }}>
                      <span>100%</span>
                    </div>
                    <div className="market-chart__y-tick" style={{ bottom: "75%" }}>
                      <span>75%</span>
                    </div>
                    <div className="market-chart__y-tick" style={{ bottom: "50%" }}>
                      <span>50%</span>
                    </div>
                    <div className="market-chart__y-tick" style={{ bottom: "25%" }}>
                      <span>25%</span>
                    </div>
                    <div className="market-chart__y-tick" style={{ bottom: "0%" }}>
                      <span>0%</span>
                    </div>
                    <div className="market-chart__y-axis-line" />
                  </div>

                  {/* Plot Area with horizontal gridlines and thin horizontal X-axis baseline */}
                  <div className="market-chart__plot">
                    {/* Horizontal reference gridlines */}
                    <div className="market-chart__gridlines" aria-hidden="true">
                      <div className="market-chart__gridline" style={{ bottom: "100%" }} />
                      <div className="market-chart__gridline" style={{ bottom: "75%" }} />
                      <div className="market-chart__gridline" style={{ bottom: "50%" }} />
                      <div className="market-chart__gridline" style={{ bottom: "25%" }} />
                    </div>

                    {/* Bars originating from horizontal baseline */}
                    <div className="market-chart__bars-track">
                      {MARKET_LAYERS.map((layer) => (
                        <div
                          key={layer.id}
                          className="market-chart__group"
                          style={{ "--layer-color": layer.color }}
                        >
                          {/* Counting percentage indicator above bars */}
                          <div
                            id={`val-${layer.id}`}
                            className="market-chart__group-value"
                            style={{ bottom: `calc(${layer.height} + 6px)` }}
                          >
                            {layer.value}
                          </div>

                          {/* Dual well-proportioned bars side by side */}
                          <div className="market-chart__group-bars">
                            <span
                              className={`market-bar market-bar--primary market-bar--primary-${layer.id}`}
                              style={{ height: layer.height }}
                              title={`${layer.name} Primary: ${layer.value}`}
                            />
                            <span
                              className={`market-bar market-bar--secondary market-bar--secondary-${layer.id}`}
                              style={{ height: layer.secondaryHeight }}
                              title={`${layer.name} Secondary: ${layer.secondaryValue}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Thin horizontal X-axis baseline */}
                    <div className="market-chart__x-axis-line" aria-hidden="true" />
                  </div>
                </div>

                {/* X-axis labels below the baseline */}
                <div className="market-chart__labels" aria-hidden="true">
                  {MARKET_LAYERS.map((layer) => (
                    <div key={layer.id} className="market-chart__label-item">
                      <strong style={{ color: layer.color }}>{layer.name}</strong>
                      <span>{layer.fullName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <figcaption className="market-size-slide__visual-caption">
              CONVENTIONAL L-SHAPED MARKET HIERARCHY
            </figcaption>
          </figure>

          {/* Desktop Right: Bubble Orb Area (Hidden on mobile <600px, 100% intact on desktop) */}
          <figure className="market-bubble-area">
            <div className="market-graphic">
              <div className="market-bubble-orb" ref={bubbleOrbRef}>
                <div className="market-bubble-orb__core" aria-hidden="true" />
                <div className="market-bubble-orbit market-bubble-orbit--one" aria-hidden="true" />
                <div className="market-bubble-orbit market-bubble-orbit--two" aria-hidden="true" />
                <div className="market-bubble-orbit market-bubble-orbit--three" aria-hidden="true" />

                {[
                  { id: "first-jobbers", text: "First Jobbers", size: "bubble--large", color: "blue" },
                  { id: "resident-doctors", text: "Resident Doctors", size: "bubble--medium", color: "cyan" },
                  { id: "cfo-homemakers", text: "CFO Homemakers", size: "bubble--large", color: "blue" },
                  { id: "content-creators", text: "Content Creators", size: "bubble--medium", color: "cyan" },
                  { id: "govt-employees", text: "Govt Employees", size: "bubble--medium", color: "violet" },
                  { id: "msme-owners", text: "MSME Owners", size: "bubble--large", color: "purple" },
                ].map((bubble, index) => (
                  <div
                    className={`market-bubble-position market-bubble-position--${index + 1}`}
                    key={bubble.id}
                  >
                    <div className={`market-bubble ${bubble.size} market-bubble--${bubble.color}`}>
                      <span>{bubble.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="market-bubble-caption">
              GROWTH. INNOVATION. OPPORTUNITY.
            </figcaption>
          </figure>
        </div>

        <SlideNavigation onPrevious={onPrevious} onContinue={onContinue} />
      </div>
    </section>
  );
}
