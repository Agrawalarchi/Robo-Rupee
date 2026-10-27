
import { useCallback, useRef, useState } from "react";
import SlideNavigation from "./SlideNavigation";
import { gsap } from "gsap";

const ROADMAP = [
  {
    year: "2026",
    title: "The Foundation",
    subtitle: "Launch and Lock-in",
    description:
      "Introduce our core automated AI among our young Tier-2 users.",
    color: "#36B8FF",
    theme: "blue",
  },
  {
    year: "2027",
    title: "Unlock Liquidity & B2B scale",
    subtitle: "Expand the ecosystem",
    description:
      "Introduce instant Loan against MF so users never have to break their investments, plus a lean B2B layer to ease the life of a legacy distributor.",
    color: "#36B8FF",
    theme: "violet",
  },
  {
    year: "2028",
    title: "The global play",
    subtitle: "Connect India globally",
    description:
      "Frictionless cross-border and NRI investing pathways straight into India.",
    color: "#36B8FF",
    theme: "lavender",
  },
];

export default function RoadmapSlide({ onPrevious, onContinue }) {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const circleRefs = useRef([]);
  const yearRefs = useRef([]);
  const titleRefs = useRef([]);
  const descriptionRefs = useRef([]);
  const activeTimelineRef = useRef(null);

  // Card shown on small screens, where only one card is visible at a time
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef(null);

  const showMilestone = (index) => {
    setActiveIndex(Math.min(Math.max(index, 0), ROADMAP.length - 1));
  };

  // Swipe left / right on small screens
  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartXRef.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) < 40) return;
    showMilestone(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  const animateMilestone = useCallback((index, isActive) => {
    const circle = circleRefs.current[index];
    const year = yearRefs.current[index];
    const title = titleRefs.current[index];
    const description = descriptionRefs.current[index];

    if (!circle || !year || !title || !description) return;

    gsap.killTweensOf([circle, year, title, description]);

    if (isActive) {
      gsap.to(circle, {
        scale: 1.22,
        duration: 0.35,
        ease: "back.out(1.7)",
        overwrite: true,
      });

      gsap.to(year, {
        scale: 1.12,
        duration: 0.3,
        color: ROADMAP[index].color,
        fontWeight: 800,
        overwrite: true,
      });

      gsap.to(title, {
        y: -3,
        duration: 0.25,
        color: "#FFFFFF",
        overwrite: true,
      });

      gsap.to(description, {
        duration: 0.25,
        color: "#F1F5FF",
        overwrite: true,
      });
    } else {
      gsap.to(circle, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });

      gsap.to(year, {
        scale: 1,
        duration: 0.25,
        color: ROADMAP[index].color,
        fontWeight: 700,
        overwrite: true,
      });

      gsap.to(title, {
        y: 0,
        duration: 0.25,
        color: "#F7F8FF",
        overwrite: true,
      });

      gsap.to(description, {
        duration: 0.25,
        color: "#B5C0D7",
        overwrite: true,
      });
    }
  }, []);

  const handlePointerEnter = (index) => {
    animateMilestone(index, true);
  };

  const handlePointerLeave = (index) => {
    animateMilestone(index, false);
  };

  const handleFocus = (index) => {
    animateMilestone(index, true);
  };

  const handleBlur = (index) => {
    animateMilestone(index, false);
  };

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      className="roadmap-slide deck-section"
      aria-labelledby="roadmap-heading"
      style={{ "--roadmap-active": activeIndex }}
    >
      <div className="roadmap-slide__stars" aria-hidden="true" />
      <div
        className="roadmap-slide__glow roadmap-slide__glow--blue"
        aria-hidden="true"
      />
      <div
        className="roadmap-slide__glow roadmap-slide__glow--purple"
        aria-hidden="true"
      />

      <div className="roadmap-slide__inner">
        <header className="roadmap-slide__header slide-heading">
          <p className="roadmap-slide__eyebrow slide-heading__eyebrow">
            <span />
            THE BLUEPRINT
          </p>

          <h2
            id="roadmap-heading"
            className="roadmap-slide__heading"
          >
            Where are we <span>taking this?</span>
          </h2>

        </header>

        <div
          className="roadmap-journey"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="roadmap-journey__cards">
            {ROADMAP.map((milestone, index) => (
              <article
                key={milestone.year}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className={`roadmap-card roadmap-card--${milestone.theme}${
                  index === activeIndex ? " is-active" : ""
                }`}
                onMouseEnter={() => handlePointerEnter(index)}
                onMouseLeave={() => handlePointerLeave(index)}
                onFocus={() => handleFocus(index)}
                onBlur={() => handleBlur(index)}
                onClick={() => showMilestone(index)}
                tabIndex={0}
                aria-label={`${milestone.year}: ${milestone.title}. ${milestone.description}`}
              >
                <p
                  className="roadmap-card__year"
                  ref={(element) => {
                    yearRefs.current[index] = element;
                  }}
                >
                  {milestone.year}
                </p>

                <h3
                  className="roadmap-card__title"
                  ref={(element) => {
                    titleRefs.current[index] = element;
                  }}
                >
                  {milestone.title}
                </h3>

                <p className="roadmap-card__subtitle">
                  {milestone.subtitle}
                </p>

                <span
                  className="roadmap-card__accent"
                  aria-hidden="true"
                />

                <p
                  className="roadmap-card__description"
                  ref={(element) => {
                    descriptionRefs.current[index] = element;
                  }}
                >
                  {milestone.description}
                </p>
              </article>
            ))}
          </div>

          <div className="roadmap-connectors" aria-hidden="true">
            {ROADMAP.map((milestone) => (
              <span
                key={milestone.year}
                className={`roadmap-connectors__stem roadmap-connectors__stem--${milestone.theme}`}
              />
            ))}
          </div>

          <div className="roadmap-track" aria-label="Roadmap timeline">
            <div className="roadmap-track__line" aria-hidden="true">
  <span className="roadmap-track__arrow roadmap-track__arrow--one" />
  <span className="roadmap-track__arrow roadmap-track__arrow--two" />
  <span className="roadmap-track__arrow roadmap-track__arrow--end" />
</div>

            <div className="roadmap-track__milestones">
              {ROADMAP.map((milestone, index) => (
                <button
                  key={milestone.year}
                  type="button"
                  className={`roadmap-node roadmap-node--${milestone.theme}`}
                  onMouseEnter={() => handlePointerEnter(index)}
                  onMouseLeave={() => handlePointerLeave(index)}
                  onFocus={() => handleFocus(index)}
                  onBlur={() => handleBlur(index)}
                  aria-label={`Highlight ${milestone.year}: ${milestone.title}`}
                >
                  <span
                    className="roadmap-node__circle"
                    ref={(element) => {
                      circleRefs.current[index] = element;
                    }}
                  >
                    <span className="roadmap-node__dot" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="roadmap-track__years">
            {ROADMAP.map((milestone, index) => (
              <p
                key={milestone.year}
                className={`roadmap-track__year roadmap-track__year--${milestone.theme}`}
                aria-hidden="true"
              >
                {milestone.year}
              </p>
            ))}
          </div>
        </div>

        {/* Small screens only: a sliding timeline that moves with the cards.
            Each step is "year ——→——" and the next year peeks in at the edge. */}
        <div
          className="roadmap-mobile-track"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="roadmap-mobile-track__back"
            onClick={() => showMilestone(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label={
              activeIndex > 0
                ? `Show ${ROADMAP[activeIndex - 1].year}: ${ROADMAP[activeIndex - 1].title}`
                : "Previous milestone"
            }
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>

          <div className="roadmap-mobile-track__viewport">
          <div className="roadmap-mobile-track__steps">
            {ROADMAP.map((milestone, index) => {
              const nextMilestone = ROADMAP[index + 1];

              return (
                <div
                  key={milestone.year}
                  className={`roadmap-mobile-track__step roadmap-mobile-track__step--${milestone.theme}${
                    index === activeIndex ? " is-active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="roadmap-mobile-track__node"
                    onClick={() => showMilestone(index)}
                    aria-current={index === activeIndex ? "step" : undefined}
                    aria-label={`Show ${milestone.year}: ${milestone.title}`}
                  >
                    <span className="roadmap-mobile-track__circle">
                      <span className="roadmap-mobile-track__dot" />
                    </span>
                    <span className="roadmap-mobile-track__year">
                      {milestone.year}
                    </span>
                  </button>

                  <span className="roadmap-mobile-track__line" aria-hidden="true" />

                  {nextMilestone && (
                    <button
                      type="button"
                      className="roadmap-mobile-track__arrow"
                      onClick={() => showMilestone(index + 1)}
                      aria-label={`Show ${nextMilestone.year}: ${nextMilestone.title}`}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </div>

        <SlideNavigation onPrevious={onPrevious} onContinue={onContinue} />
      </div>
    </section>
  );
}
