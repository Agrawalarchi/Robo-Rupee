
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SlideNavigation from "./SlideNavigation";
import { gsap } from "gsap";
import RoboLogo from "./RoboLogo";

const BUSINESS_POINTS = [
  {
    id: "free",
    number: "01",
    eyebrow: "USER EXPERIENCE",
    title: "Free for our users",
    description:
      "Access the platform without a user-facing platform fee.",
    position: "top",
    accent: "cyan",
    icon: "₹",
  },
  {
    id: "amc",
    number: "02",
    eyebrow: "REVENUE STREAM",
    title: "AMC trail commissions",
    description:
      "Mutual Fund AMCs pay us trail commissions each year on total AUM, up to 1%.",
    position: "left",
    accent: "blue",
    icon: "↗",
  },
  {
    id: "loan",
    number: "03",
    eyebrow: "LIQUIDITY SOLUTIONS",
    title: "Loans against mutual funds",
    description:
      "Users access liquidity through loans against their mutual funds. We receive a 1.5% processing payout.",
    position: "right",
    accent: "violet",
    icon: "◇",
  },
];

// Below this width the cards become a carousel like the problem slide's
const CAROUSEL_QUERY = "(max-width: 600px)";

// Position of each card around the active one in the carousel
function getCarouselState(index, active, cardWidth) {
  const distance = index - active;
  const absDistance = Math.abs(distance);

  return {
    x: distance * cardWidth * 0.82,
    scale: absDistance === 0 ? 1 : 0.9,
    opacity: absDistance === 0 ? 1 : absDistance === 1 ? 0.55 : 0,
    zIndex: 10 - absDistance,
  };
}

export default function BusinessModelSlide({
  onPrevious,
  onContinue,
}) {
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const logoRef = useRef(null);
  const activeIndexRef = useRef(0);
  const goToCardRef = useRef(null);
  const touchStartXRef = useRef(null);

  const [isCarousel, setIsCarousel] = useState(
    () => window.matchMedia(CAROUSEL_QUERY).matches
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const query = window.matchMedia(CAROUSEL_QUERY);
    const update = () => setIsCarousel(query.matches);

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;

    if (!section || !scene) return undefined;

    // Rebuilt from scratch at each breakpoint, so transforms from one
    // layout never leak into another
    const mm = gsap.matchMedia(section);

    mm.add(
      {
        carousel: CAROUSEL_QUERY,
        stacked: "(max-width: 760px)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
      const { carousel, reducedMotion } = context.conditions;

      const cards = gsap.utils.toArray(
        ".business-model-card",
        scene
      );

      const rings = gsap.utils.toArray(
        ".business-model__orbit",
        scene
      );

      const particles = gsap.utils.toArray(
        ".business-model__particle",
        scene
      );

      const logo = logoRef.current;

      const placeCards = (active, immediate) => {
        const cardWidth = cards[0]?.offsetWidth || 0;

        cards.forEach((card, index) => {
          const state = getCarouselState(index, active, cardWidth);

          if (immediate) {
            gsap.set(card, state);
          } else {
            gsap.to(card, {
              ...state,
              duration: reducedMotion ? 0.01 : 0.7,
              ease: reducedMotion ? "none" : "power3.inOut",
              overwrite: "auto",
            });
          }
        });
      };

      let handleResize;

      if (carousel) {
        placeCards(activeIndexRef.current, true);
        goToCardRef.current = context.add((index) => placeCards(index));

        // Card width changes with the screen, and so does the spacing
        handleResize = () => placeCards(activeIndexRef.current, true);
        window.addEventListener("resize", handleResize);
      } else {
        goToCardRef.current = null;
      }

      const cleanup = () => {
        goToCardRef.current = null;
        if (handleResize) {
          window.removeEventListener("resize", handleResize);
        }
      };

      if (reducedMotion) {
        gsap.set(
          [
            ...(carousel ? [] : cards),
            ...rings,
            ...particles,
            ".business-model__logo",
          ],
          { autoAlpha: 1 }
        );
        return cleanup;
      }

      if (carousel) {
        // Cards keep their carousel positions and just rise into place
        gsap.from(cards, {
          autoAlpha: 0,
          y: 22,
          duration: 0.8,
          stagger: 0.12,
          delay: 0.6,
          ease: "power3.out",
        });
      } else {

      // Bring in the cards from their respective directions.
      gsap.set(cards, {
        autoAlpha: 0,
        y: 22,
      });

      gsap.set(cards.find((card) =>
        card.classList.contains("business-model-card--left")
      ), { x: -35 });

      gsap.set(cards.find((card) =>
        card.classList.contains("business-model-card--right")
      ), { x: 35 });

      gsap.set(".business-model-card--top", {
        y: -28,
      });
      }

      gsap.set(".business-model__logo", {
        autoAlpha: 0,
        y: 24,
        scale: 0.82,
      });

      gsap.set(rings, {
        autoAlpha: 0,
        scale: 0.85,
      });

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .to(rings, {
          autoAlpha: 1,
          scale: 1,
          duration: 1.1,
          stagger: 0.12,
        })
        .to(
          ".business-model__logo",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
          },
          "-=0.65"
        );

      if (!carousel) {
        intro.to(
          cards,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            stagger: 0.16,
          },
          "-=0.5"
        );
      }

      intro
        .to(
          particles,
          {
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.07,
          },
          "-=0.4"
        );

      // Keep the logo and cards subtly alive after the entrance.
      // Rotate the emblem continuously like a tire.
gsap.to(".business-model__logo-emblem", {
  rotation: 360,
  duration: 5,
  repeat: -1,
  ease: "none",
  transformOrigin: "50% 50%",
});

// Keep the outer ring glowing subtly.
gsap.to(".business-model__logo-ring", {
  boxShadow:
    "0 0 22px rgba(50, 111, 255, 0.42), 0 0 45px rgba(69, 64, 255, 0.28), inset 0 0 17px rgba(67, 121, 255, 0.2)",
  duration: 1.8,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  delay: 1,
});

      rings.forEach((ring, index) => {
        gsap.to(ring, {
          rotation: index % 2 === 0 ? 360 : -360,
          duration: 38 + index * 12,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
      });

      // The carousel moves the cards itself, so they only float elsewhere
      (carousel ? [] : cards).forEach((card, index) => {
        gsap.to(card, {
          y: index === 0 ? -5 : 5,
          duration: 2.8 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.2 + index * 0.25,
        });
      });

      particles.forEach((particle, index) => {
        gsap.to(particle, {
          y: index % 2 === 0 ? -13 : 13,
          x: index % 2 === 0 ? 7 : -7,
          opacity: 0.35,
          duration: 2 + index * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      });
      return cleanup;
      }
    );

    return () => mm.revert();
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    goToCardRef.current?.(activeIndex);
  }, [activeIndex]);

  // Auto-advance every 8 seconds; any manual change restarts the wait
  useEffect(() => {
    if (
      !isCarousel ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % BUSINESS_POINTS.length);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [isCarousel, activeIndex]);

  const showPrevious = useCallback(() => {
    setActiveIndex((index) => Math.max(index - 1, 0));
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((index) =>
      Math.min(index + 1, BUSINESS_POINTS.length - 1)
    );
  }, []);

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartXRef.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) showNext();
    else showPrevious();
  };

  return (
    <section
      ref={sectionRef}
      className="business-model-slide deck-section"
      aria-label="Robo Rupee business model"
    >
      <div
        className="business-model__stars"
        aria-hidden="true"
      />

      <div
        className="business-model__ambient business-model__ambient--blue"
        aria-hidden="true"
      />

      <div
        className="business-model__ambient business-model__ambient--violet"
        aria-hidden="true"
      />

      <div className="business-model__inner">
        <header className="business-model__heading slide-heading">
          <p className="business-model__eyebrow slide-heading__eyebrow">
            <span />
            BUSINESS MODEL
            <span />
          </p>

          <h2>
            Simple for users.
            <span> Sustainable for us.</span>
          </h2>

        </header>

        <div
          ref={sceneRef}
          className={`business-model__scene${
            isCarousel ? " business-model__scene--carousel" : ""
          }`}
          onTouchStart={isCarousel ? handleTouchStart : undefined}
          onTouchEnd={isCarousel ? handleTouchEnd : undefined}
        >
          <div
            className="business-model__halo"
            aria-hidden="true"
          />

          <div
            className="business-model__orbit business-model__orbit--one"
            aria-hidden="true"
          />

          <div
            className="business-model__orbit business-model__orbit--two"
            aria-hidden="true"
          />

          <div
            className="business-model__orbit business-model__orbit--three"
            aria-hidden="true"
          />

          <span className="business-model__particle business-model__particle--one" />
          <span className="business-model__particle business-model__particle--two" />
          <span className="business-model__particle business-model__particle--three" />
          <span className="business-model__particle business-model__particle--four" />
          <span className="business-model__particle business-model__particle--five" />

          {BUSINESS_POINTS.map((point, index) => {
            const isHidden = isCarousel && index !== activeIndex;

            return (
            <article
              key={point.id}
              className={[
                "business-model-card",
                `business-model-card--${point.position}`,
                `business-model-card--${point.accent}`,
                isCarousel && index === activeIndex
                  ? "business-model-card--active"
                  : "",
              ].join(" ")}
              aria-hidden={isHidden || undefined}
              inert={isHidden || undefined}
            >
              <div className="business-model-card__topline">
                <span className="business-model-card__number">
                  {point.number}
                </span>

                <span className="business-model-card__eyebrow">
                  {point.eyebrow}
                </span>

                <span
                  className="business-model-card__icon"
                  aria-hidden="true"
                >
                  {point.icon}
                </span>
              </div>

              <h3>{point.title}</h3>

              <p>{point.description}</p>

              {point.id === "amc" && (
                <div className="business-model-card__metric">
                  <strong>Up to 1%</strong>
                  <span>Annual trail commission</span>
                </div>
              )}

              {point.id === "loan" && (
                <div className="business-model-card__metric">
                  <strong>1.5%</strong>
                  <span>Processing payout</span>
                </div>
              )}

              {point.id === "free" && (
                <div className="business-model-card__tag">
                  <span />
                  No platform fee for users
                </div>
              )}
            </article>
            );
          })}

          {isCarousel && (
            <>
              <button
                type="button"
                className="business-model__arrow business-model__arrow--previous"
                onClick={showPrevious}
                disabled={activeIndex === 0}
                aria-label="Previous revenue point"
              >
                <ArrowLeft size={19} strokeWidth={1.5} />
              </button>

              <button
                type="button"
                className="business-model__arrow business-model__arrow--next"
                onClick={showNext}
                disabled={activeIndex === BUSINESS_POINTS.length - 1}
                aria-label="Next revenue point"
              >
                <ArrowRight size={19} strokeWidth={1.5} />
              </button>
            </>
          )}

          <div
            className="business-model__logo"
            ref={logoRef}
            aria-label="Robo Rupee"
          >
            <div className="business-model__logo-ring">
              <div className="business-model__logo-emblem">
                <RoboLogo />
              </div>
            </div>
            {/* <span className="business-model__logo-caption">
              ROBO RUPEE
            </span> */}
          </div>
        </div>

        <SlideNavigation onPrevious={onPrevious} onContinue={onContinue}>
          {isCarousel && (
            <div
              className="business-model__pagination"
              aria-label="Choose a revenue point"
            >
              {BUSINESS_POINTS.map((point, index) => (
                <button
                  key={point.id}
                  type="button"
                  className={`business-model__dot${
                    index === activeIndex
                      ? " business-model__dot--active"
                      : ""
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${point.title}`}
                  aria-current={index === activeIndex ? "step" : undefined}
                />
              ))}
            </div>
          )}
        </SlideNavigation>
      </div>
    </section>
  );
}
