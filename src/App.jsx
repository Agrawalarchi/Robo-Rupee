
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import RoboLogo from "./components/RoboLogo";

import SplashScreen from "./components/SplashScreen";
import TeamSlide from "./components/TeamSlide";
import ProblemSlide from "./components/ProblemSlide";
import SolutionSlide from "./components/SolutionSlide";
import MarketSizeSlide from "./components/MarketSizeSlide";
import RoadmapSlide from "./components/RoadmapSlide";
import AskSlide from "./components/AskSlide";
import BusinessModelSlide from "./components/BusinessModelSlide";

const SLIDE_IDS = [
  "team",
  "problem",
  "solution",
  "market-size",
  "roadmap",
  "ask",
  "business-model",
];

export default function App() {
 const [activeSlide, setActiveSlide] = useState(() => {
  const savedSlide = sessionStorage.getItem("robo-rupee-active-slide");
  const parsedSlide = savedSlide === null ? 0 : Number(savedSlide);

  // Valid slide indexes are 0 through 6.
  return Number.isInteger(parsedSlide) &&
    parsedSlide >= 0 &&
    parsedSlide < SLIDE_IDS.length
    ? parsedSlide
    : 0;
});

const [started, setStarted] = useState(() => {
  return sessionStorage.getItem("robo-rupee-presentation-started") === "true";
});

const [presentationRevealed, setPresentationRevealed] = useState(() => {
  return sessionStorage.getItem("robo-rupee-presentation-started") === "true";
});

  const splashRef = useRef(null);
  const logoRef = useRef(null);
  const headerLogoRef = useRef(null); // New presentation header logo
  const presentationRef = useRef(null);
  const progressRef = useRef(null);
  const animationRef = useRef(null);
  const slideViewportRef = useRef(null);
  const slideContentRef = useRef(null);

const flipLogo = useCallback(() => {
  const logo = headerLogoRef.current;

  if (!logo || !presentationRevealed) return;

  gsap.killTweensOf(logo);

  gsap.fromTo(
    logo,
    {
      rotationY: 0,
    },
    {
      rotationY: 360,
      duration: 0.8,
      ease: "power2.inOut",
      transformPerspective: 800,
      transformOrigin: "center center",
      overwrite: true,
      onComplete: () => {
        gsap.set(logo, { rotationY: 0 });
      },
    }
  );
}, [presentationRevealed]);

  const startPresentation = useCallback(() => {
    if (started || !logoRef.current || !splashRef.current) return;

    const logo = logoRef.current;
    const splash = splashRef.current;
    const presentation = presentationRef.current;

    if (!presentation) return;

    setStarted(true);
sessionStorage.setItem("robo-rupee-presentation-started", "true");

    const rect = logo.getBoundingClientRect();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targetLeft = window.innerWidth <= 520 ? 20 : 36;
    const targetTop = window.innerWidth <= 520 ? 9 : 12;
    // const targetScale = window.innerWidth <= 720 ? 0.3 : 0.27;
    // Slightly smaller final logo so the spiral stays comfortably inside the screen.
const targetScale = window.innerWidth <= 520 ? 0.40 : 0.27;

    gsap.set(logo, {
      position: "fixed",
      left: rect.left,
      top: rect.top,
      width: rect.width,
      zIndex: 100,
      margin: 0,
      transformOrigin: "top left",
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    });

    const timeline = gsap.timeline({
  onComplete: () => {
    // Final compact position after the animation settles.
    gsap.set(logo, {
      position: "fixed",
      left: targetLeft,
      top: targetTop,
      width: rect.width,
      height: "auto",
      margin: 0,
      padding: 0,
      transformOrigin: "top left",
      x: 0,
      y: 0,
      scale: targetScale,
      rotation: 0,
      rotationY: 0,
      zIndex: 10001,
      autoAlpha: 1,
    });

    // Hide the original splash logo after its animation.
    splash.classList.add("splash-layer--finished");

    presentation.classList.add("presentation--visible");
    presentation.setAttribute("aria-hidden", "false");

    setPresentationRevealed(true);
  },
});

animationRef.current = timeline;

if (reducedMotion) {
  timeline
    .to(logo, {
      duration: 0.01,
      left: targetLeft,
      top: targetTop,
      scale: targetScale,
      rotation: 0,
    })
    .to(
      ".splash__tagline, .splash__bottom, .splash__stars, .splash__glow, .splash__noise",
      {
        duration: 0.01,
        opacity: 0,
      },
      0
    )
    .to(
      presentation,
      {
        duration: 0.01,
        opacity: 1,
        onStart: () => {
          presentation.classList.add("presentation--visible");
          presentation.setAttribute("aria-hidden", "false");
        },
      },
      0
    );

  return;
}

// Phase 1: rotate and travel toward the header.
// Phase 2: gently ease into the final position.
timeline
  .to(logo, {
    duration: 1.8,
    left: targetLeft,
    top: targetTop,
    scale: targetScale,
    rotation: 720,
    ease: "power2.inOut",
  })
  .to(logo, {
    duration: 0.65,
    left: targetLeft,
    top: targetTop,
    scale: targetScale,
    rotation: 720,
    ease: "power4.out",
  })
  .to(
    {},
    {
      duration: 0.25,
    }
  )
  .to(
    ".splash__tagline, .splash__bottom, .splash__stars, .splash__glow, .splash__noise",
    {
      duration: 0.8,
      opacity: 0,
      ease: "power2.out",
      stagger: 0.06,
    },
    "-=0.25"
  )
  .to(
    presentation,
    {
      duration: 0.7,
      opacity: 1,
      ease: "power2.out",
      onStart: () => {
        presentation.classList.add("presentation--visible");
        presentation.setAttribute("aria-hidden", "false");
      },
    },
    "-=0.2"
  );
  }, [started]);

  /*
   * Change slides only through explicit navigation.
   * Reset the internal scroll position when a new slide becomes active.
   */
  const navigateToSlide = useCallback((id) => {
    const index = SLIDE_IDS.indexOf(id);

    if (index === -1) {
      console.warn(`Unknown slide: ${id}`);
      return;
    }

    setActiveSlide(index);
  }, []);

  const returnToSplash = useCallback(() => {
  // Reset the presentation state
  setStarted(false);
  setPresentationRevealed(false);

  // Reset to the first slide for the next time the presentation starts
  setActiveSlide(0);

  // Update session storage
  sessionStorage.setItem("robo-rupee-presentation-started", "false");
  sessionStorage.setItem("robo-rupee-active-slide", "0");

  // Reset the splash logo's GSAP styles so it returns to its original position
  if (logoRef.current) {
    gsap.killTweensOf(logoRef.current);

    gsap.set(logoRef.current, {
      clearProps: "all",
    });
  }

  // Reset the splash screen visibility
  if (splashRef.current) {
    splashRef.current.classList.remove("splash-layer--finished");
  }

  // Hide the presentation
  if (presentationRef.current) {
    presentationRef.current.classList.remove("presentation--visible");
    presentationRef.current.setAttribute("aria-hidden", "true");
  }
}, []);

  useEffect(() => {
  const viewport = slideViewportRef.current;

  if (!presentationRevealed) return;

  if (viewport) {
    viewport.scrollTop = 0;
  }

  if (slideContentRef.current) {
    slideContentRef.current.scrollTop = 0;
  }

  if (progressRef.current) {
    gsap.to(progressRef.current, {
      width: `${((activeSlide + 1) / SLIDE_IDS.length) * 100}%`,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });
  }

  flipLogo();
}, [activeSlide, presentationRevealed, flipLogo]);

  useEffect(() => {
    return () => {
      animationRef.current?.kill();
    };
  }, []);

  const handleHeaderNavigation = (event, id) => {
    event.preventDefault();
    navigateToSlide(id);
  };

  const slideProps = (index, previousId, nextId) => ({
  onPrevious: () => {
    if (previousId) navigateToSlide(previousId);
  },
  onContinue: () => {
    if (nextId) navigateToSlide(nextId);
  },
});

  useEffect(() => {
  sessionStorage.setItem(
    "robo-rupee-active-slide",
    String(activeSlide)
  );
}, [activeSlide]);

  return (
    <main className="app-shell">
      <div
  ref={splashRef}
  className={`splash-layer ${
    presentationRevealed ? "splash-layer--finished" : ""
  }`}
>
  <SplashScreen onStart={startPresentation} logoRef={logoRef} />
</div>

      <div
        ref={progressRef}
        className="deck-progress__bar deck-progress__bar--fixed"
        aria-hidden="true"
        style={{ width: "0%" }}
      />

      <div
  ref={presentationRef}
  className={`presentation ${
    presentationRevealed ? "presentation--visible" : ""
  }`}
  aria-hidden={!presentationRevealed}
  inert={!presentationRevealed}
>
  <div
    ref={slideViewportRef}
    className="slide-viewport"
    key={activeSlide}
  >
    {presentationRevealed && (
      <header className="deck-header deck-header--visible">
        <div className="deck-header__logo" ref={headerLogoRef}>
          <RoboLogo className="robo-brand--header" />
        </div>
      </header>
    )}
          {activeSlide === 0 && (
  <TeamSlide
    isPresentationVisible={presentationRevealed}
    onPrevious={returnToSplash}
    onContinue={() => navigateToSlide("problem")}
  />
)}

          {activeSlide === 1 && (
            <ProblemSlide {...slideProps(1, "team", "solution")} />
          )}

          {activeSlide === 2 && (
            <SolutionSlide
              {...slideProps(2, "problem", "market-size")}
            />
          )}

          {activeSlide === 3 && (
            <MarketSizeSlide
              {...slideProps(3, "solution", "roadmap")}
            />
          )}

          {activeSlide === 4 && (
            <RoadmapSlide
              {...slideProps(4, "market-size", "ask")}
            />
          )}

          {activeSlide === 5 && (
            <AskSlide {...slideProps(5, "roadmap", "business-model")} />
          )}

          {
            activeSlide === 6 && (<BusinessModelSlide {...slideProps(6, "ask", null)} />)
          }
          {/* {activeSlide === 7 && (
            <section
              id="closing"
              className="deck-section deck-section--closing"
              aria-label="Closing slide"
            >
              <div className="deck-section__inner">
                <p className="deck-eyebrow">THE NEXT CHAPTER</p>

                <h2 className="deck-heading">
                  Let's build
                  <br />
                  <span className="deck-heading__accent">
                    what comes next.
                  </span>
                </h2>

                <p className="deck-description">
                  Thank you for exploring our vision.
                </p>

                <button
                  type="button"
                  className="deck-button"
                  onClick={() => navigateToSlide("team")}
                >
                  Back to the beginning
                </button>
              </div>
            </section>
          )} */}
        </div>
      </div>
    </main>
  );
}
