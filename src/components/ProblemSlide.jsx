
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { gsap } from "gsap";
import SlideNavigation from "./SlideNavigation";

const PROBLEMS = [
  {
    id: 1,
    title: "The DIY problem",
    description:
      "Why do ‘India 2’ citizens have to be finance bros and be good at their daily jobs simultaneously!?",
    label: "THE DAILY STRUGGLE",
  },
  {
    id: 2,
    title: "Handholding should not cost 10 Lakhs",
    description:
      "What you mean by ‘I have to maintain a 10 lakh bank TRV to get a personalized RM who’ll probably mis-sell Mutual Funds.",
    label: "ACCESS TO GUIDANCE",
  },
  {
    id: 3,
    title: "AXIS MF says panic selling is costing Indians billions.",
    description:
      "Every time markets fall, I panic and sell. What else to do, there is no one to talk to.",
    label: "EMOTIONAL INVESTING",
    link: "https://www.moneycontrol.com/news/business/personal-finance/investors-earn-fewer-returns-than-mutual-funds-axis-mf-study-9155791.html",
  },
  {
    id: 4,
    title: "We did some chit-chatting....",
    description:
      "Our own tier 2 city survey shows, 56% of the people find investing too complex and they need guidance.",
    label: "WHAT PEOPLE TOLD US",
  },
];

export default function ProblemSlide({ onContinue, onPrevious }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const cardRefs = useRef([]);
  const viewportRef = useRef(null);
  const timelineRef = useRef(null);
  const activeIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const autoPlayRef = useRef(null);

  // Keep all four cards positioned around the carousel center.
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
      // Keep the card centered while x animates between carousel positions.
      xPercent: -50,
      yPercent: -50,
      x: distance * spacing,
      y: 0,
      scale:
        absDistance === 0 ? 1 :
        absDistance === 1 ? (compact ? 0.9 : 0.88) :
        0.78,
      opacity:
        absDistance === 0 ? 1 :
        absDistance === 1 ? (compact ? 0.72 : 0.58) :
        compact ? 0 : 0.2,
      rotationY: compact || distance === 0 ? 0 : distance * -2,
      zIndex: 10 - absDistance,
    };
  }, []);

  const setCardStates = useCallback((active, immediate = false) => {
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
  }, [getCardState]);

  const animateTo = useCallback((nextIndex) => {
    if (
      animatingRef.current ||
      nextIndex < 0 ||
      nextIndex >= PROBLEMS.length ||
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

      const state = getCardState(index, nextIndex);

      timeline.to(
        card,
        {
          ...state,
          duration: reducedMotion ? 0.01 : 0.7,
        },
        0
      );
    });
  }, [getCardState]);

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

    if (activeIndexRef.current < PROBLEMS.length - 1) {
      animateTo(activeIndexRef.current + 1);
    } else {
      onContinue?.();
    }
  }, [animateTo, onContinue]);

  useEffect(() => {
    setCardStates(0, true);

    const handleResize = () => {
      // Recalculate card spacing for the current viewport.
      setCardStates(activeIndexRef.current, true);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      timelineRef.current?.kill();
      gsap.killTweensOf(cardRefs.current.filter(Boolean));
    };
  }, [setCardStates]);

  useEffect(() => {
  const startAutoPlay = () => {
    window.clearInterval(autoPlayRef.current);

    // Respect reduced-motion preferences.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    autoPlayRef.current = window.setInterval(() => {
      if (animatingRef.current) return;

      const nextIndex =
        (activeIndexRef.current + 1) % PROBLEMS.length;

      animateTo(nextIndex);
    }, 8000);
  };

  startAutoPlay();

  return () => {
    window.clearInterval(autoPlayRef.current);
  };
}, [animateTo]);

  return (
    <section
      id="problem"
      className="problem-slide deck-section"
      aria-label="Problem statements"
    >
      <div className="problem-slide__stars" aria-hidden="true" />

      <div
        className="problem-slide__ambient problem-slide__ambient--blue"
        aria-hidden="true"
      />

      <div
        className="problem-slide__ambient problem-slide__ambient--violet"
        aria-hidden="true"
      />

      <div className="problem-slide__inner">
        <div className="problem-slide__intro slide-heading">
          <div className="problem-slide__eyebrow slide-heading__eyebrow">
            <span />
            THE PROBLEM
          </div>

          <div className="problem-slide__headline-row slide-heading__content">
            <h2 className="problem-slide__heading">
              Why it{" "}
              <span>matters.</span>
            </h2>

          </div>
        </div>

        <div className="problem-slide__carousel">
          <button
            type="button"
            className="problem-slide__arrow problem-slide__arrow--previous"
            onClick={goPrevious}
            aria-label="Previous problem"
            disabled={isAnimating}
          >
            <ArrowLeft size={23} strokeWidth={1.5} />
          </button>

          <div className="problem-slide__viewport" ref={viewportRef}>
            {PROBLEMS.map((problem, index) => (
              <article
                key={problem.id}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className={`problem-card ${
                  index === activeIndex
                    ? "problem-card--active"
                    : ""
                }`}
                aria-hidden={index !== activeIndex}
                inert={index !== activeIndex}
              >
                <div className="problem-card__topline">
                  <span className="problem-card__number">
                    {String(problem.id).padStart(2, "0")}
                    <span> / 04</span>
                  </span>

                  <span className="problem-card__label">
                    {problem.label}
                  </span>
                </div>

                <h3 className="problem-card__title">
                  {problem.title}
                </h3>

                <p className="problem-card__description">
                  {problem.description}
                </p>

                {problem.link && (
                  <a
                    className="problem-card__source"
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={index === activeIndex ? 0 : -1}
                  >
                    Read the study
                    <ArrowUpRight size={15} />
                  </a>
                )}

                {/* <button
                  type="button"
                  className="problem-card__learn"
                  onClick={goNext}
                  tabIndex={index === activeIndex ? 0 : -1}
                  aria-label="Show next problem"
                >
                  <span>
                    {index === PROBLEMS.length - 1
                      ? "OUR SOLUTION"
                      : "Learn more"}
                  </span>

                  <ArrowRight size={22} strokeWidth={1.5} />
                </button> */}
              </article>
            ))}
          </div>

          <button
            type="button"
            className="problem-slide__arrow problem-slide__arrow--next"
            onClick={goNext}
            aria-label="Next problem"
            disabled={isAnimating}
          >
            <ArrowRight size={23} strokeWidth={1.5} />
          </button>
        </div>

        <SlideNavigation onPrevious={onPrevious} onContinue={onContinue}>
          {/* Pagination */}
          <div
            className="problem-slide__pagination"
            aria-label="Choose a problem"
          >
            {PROBLEMS.map((problem, index) => (
              <button
                key={problem.id}
                type="button"
                className={
                  index === activeIndex
                    ? "problem-slide__dot problem-slide__dot--active"
                    : "problem-slide__dot"
                }
                onClick={() => animateTo(index)}
                disabled={isAnimating}
                aria-label={`Show problem ${index + 1}`}
                aria-current={
                  index === activeIndex ? "step" : undefined
                }
              />
            ))}
          </div>

        </SlideNavigation>
      </div>
    </section>
  );
}
