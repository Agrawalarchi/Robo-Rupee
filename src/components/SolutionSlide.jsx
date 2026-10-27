
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Heart,
  Clock3,
  MessageCircle,
  Languages,
  ChartNoAxesCombined,
} from "lucide-react";
import { gsap } from "gsap";
import SlideNavigation from "./SlideNavigation";

const SOLUTIONS = [
  {
    id: 1,
    title: "Our vision of AI",
    description:
      "Along with educating, why can’t AI execute transactions with your consent?",
    label: "AI THAT TAKES ACTION",
    Icon: BrainCircuit,
  },
  {
    id: 2,
    title: "Meet Samridhi",
    description:
      "The friend who never judges you. Built to keep ‘India 2’ investors calm, compliant and on track.",
    label: "YOUR FINANCIAL COMPANION",
    Icon: Heart,
  },
  {
    id: 3,
    title: "Zero-Jargon translation",
    description:
      "Every day, Samridhi scans the web, analyzes what news moved your specific funds, and explains it in plain human language.",
    label: "INSIGHTS MADE SIMPLE",
    Icon: Languages,
  },
  {
    id: 4,
    title: "Behavioral Handholding",
    description:
      "Markets backflipping on you? Samridhi calms you down, explains what is happening, and shows what panic selling does to your net returns.",
    label: "INVEST WITH CONFIDENCE",
    Icon: MessageCircle,
  },
  {
    id: 5,
    title: "Automated Tax Harvesting",
    description:
      "Tracks portfolio gains throughout the year and alerts users when they may be able to lock in eligible tax-free gains of up to ₹1.25 lakh, subject to applicable tax rules.",
    label: "TAX-AWARE INVESTING",
    Icon: ChartNoAxesCombined,
  },
  {
    id: 6,
    title: "24/7 Availability",
    description:
      "Talk to Samridhi while driving, or text at 2 am. She is ready to calculate, guide or listen.",
    label: "ALWAYS WITH YOU",
    Icon: Clock3,
  },
];

export default function SolutionSlide({ onPrevious, onContinue }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const cardRefs = useRef([]);
  const viewportRef = useRef(null);
  const timelineRef = useRef(null);
  const activeIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const autoPlayRef = useRef(null);

  const getCardState = useCallback((index, active) => {
    const distance = index - active;
    const absDistance = Math.abs(distance);
    const width = window.innerWidth;
    const compact = width <= 780;
    const viewportWidth = viewportRef.current?.clientWidth || width;
    const cardWidth = cardRefs.current[0]?.offsetWidth || Math.min(280, viewportWidth * 0.72);

    const spacing =
  compact ? cardWidth * 0.82 :
  width <= 1100 ? 190 :
  width <= 1500 ? 250 : 285;

    return {
      x: distance * spacing,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      scale:
        absDistance === 0 ? 1 :
        absDistance === 1 ? (compact ? 0.9 : 0.88) : 0.78,
      opacity:
        absDistance === 0 ? 1 :
        absDistance === 1 ? (compact ? 0.72 : 0.58) :
        compact ? 0 : 0.2,
      rotationY: compact || distance === 0 ? 0 : distance * -2,
      zIndex: 10 - absDistance,
      pointerEvents: absDistance === 0 ? "auto" : "none",
    };
  }, []);

  const setCardStates = useCallback(
    (active, immediate = false) => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const state = getCardState(index, active);

        if (immediate) {
          gsap.set(card, state);
        } else {
          gsap.to(card, {
            ...state,
            duration: 0.7,
            ease: "power3.inOut",
            overwrite: "auto",
          });
        }
      });
    },
    [getCardState]
  );

  const animateTo = useCallback(
    (nextIndex) => {
      if (
        animatingRef.current ||
        nextIndex < 0 ||
        nextIndex >= SOLUTIONS.length ||
        nextIndex === activeIndexRef.current
      ) {
        return;
      }

      timelineRef.current?.kill();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      animatingRef.current = true;
      setIsAnimating(true);

      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      const timeline = gsap.timeline({
        defaults: {
          duration: reducedMotion ? 0.01 : 0.7,
          ease: reducedMotion ? "none" : "power3.inOut",
        },
        onComplete: () => {
          animatingRef.current = false;
          setIsAnimating(false);
        },
      });

      timelineRef.current = timeline;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        timeline.to(
          card,
          getCardState(index, nextIndex),
          0
        );
      });
    },
    [getCardState]
  );

  const goPrevious = useCallback(() => {
    if (animatingRef.current) return;

    if (activeIndexRef.current > 0) {
      animateTo(activeIndexRef.current - 1);
    } else {
      onPrevious?.();
    }
  }, [animateTo, onPrevious]);

  const goNext = useCallback(() => {
    if (animatingRef.current) return;

    if (activeIndexRef.current < SOLUTIONS.length - 1) {
      animateTo(activeIndexRef.current + 1);
    } else {
      onContinue?.();
    }
  }, [animateTo, onContinue]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    setCardStates(0, true);

    const handleResize = () => {
      setCardStates(activeIndexRef.current, true);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      timelineRef.current?.kill();
      gsap.killTweensOf(cards);
    };
  }, [setCardStates]);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    autoPlayRef.current = window.setInterval(() => {
      if (animatingRef.current) return;

      const current = activeIndexRef.current;
      const next = current >= SOLUTIONS.length - 1 ? 0 : current + 1;

      animateTo(next);
    }, 8000);

    return () => {
      window.clearInterval(autoPlayRef.current);
    };
  }, [animateTo]);

  return (
    <section
      id="solution"
      className="solution-slide deck-section"
      aria-label="Our solutions"
    >
      <div className="solution-slide__stars" aria-hidden="true" />

      <div
        className="solution-slide__ambient solution-slide__ambient--blue"
        aria-hidden="true"
      />

      <div
        className="solution-slide__ambient solution-slide__ambient--violet"
        aria-hidden="true"
      />

      <div className="solution-slide__inner">
        <header className="solution-slide__header slide-heading">
          <div className="solution-slide__heading-group slide-heading__content">
            <p className="solution-slide__eyebrow slide-heading__eyebrow">
              <span />
              OUR SOLUTION
            </p>

            <h2 className="solution-slide__heading">
              How we <span>solve it.</span>
            </h2>
          </div>

        </header>

        <div className="solution-slide__carousel">
          <button
            type="button"
            className="solution-slide__arrow solution-slide__arrow--previous"
            onClick={goPrevious}
            aria-label="Previous solution"
            disabled={isAnimating}
          >
            <ArrowLeft size={23} strokeWidth={1.5} />
          </button>

          <div className="solution-slide__viewport" ref={viewportRef}>
            {SOLUTIONS.map((solution, index) => {
              const Icon = solution.Icon;
              const isActive = index === activeIndex;

              return (
                <article
                  key={solution.id}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className={`solution-card ${
                    isActive ? "solution-card--active" : ""
                  }`}
                  aria-hidden={!isActive}
                  inert={!isActive}
                >
                  <div className="solution-card__badge" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <div className="solution-card__topline">
                    <span className="solution-card__number">
                      {String(solution.id).padStart(2, "0")}
                      <span> / 06</span>
                    </span>

                    <span className="solution-card__label">
                      {solution.label}
                    </span>
                  </div>

                  <h3 className="solution-card__title">
                    {solution.title}
                  </h3>

                  <p className="solution-card__description">
                    {solution.description}
                  </p>

                  {/* <button
                    type="button"
                    className="solution-card__learn"
                    onClick={goNext}
                    tabIndex={isActive ? 0 : -1}
                    aria-label={
                      index === SOLUTIONS.length - 1
                        ? "Continue to business model"
                        : "Show next solution"
                    }
                  >
                    <span>
                      {index === SOLUTIONS.length - 1
                        ? "BUSINESS MODEL"
                        : "NEXT SOLUTION"}
                    </span>
                    <ArrowRight size={20} strokeWidth={1.5} />
                  </button> */}
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="solution-slide__arrow solution-slide__arrow--next"
            onClick={goNext}
            aria-label="Next solution"
            disabled={isAnimating}
          >
            <ArrowRight size={23} strokeWidth={1.5} />
          </button>
        </div>

        <SlideNavigation onPrevious={onPrevious} onContinue={onContinue}>
          <div
            className="solution-slide__pagination"
            aria-label="Choose a solution"
          >
            {SOLUTIONS.map((solution, index) => (
              <button
                key={solution.id}
                type="button"
                className={
                  index === activeIndex
                    ? "solution-slide__dot solution-slide__dot--active"
                    : "solution-slide__dot"
                }
                onClick={() => animateTo(index)}
                disabled={isAnimating}
                aria-label={`Show solution ${index + 1}`}
                aria-current={index === activeIndex ? "step" : undefined}
              />
            ))}
          </div>

        </SlideNavigation>
      </div>
    </section>
  );
}
