import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SlideNavigation from "./SlideNavigation";

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Sankalp Tuteja",
    role: "CEO / Founder",
    image: "/assets/team/Sankalp_Sir.png",

    bubbles: [
      {
        title: "BMO",
        image: "/assets/team/sankalp/bmo.jpeg",
      },
      {
        title: "MSCI",
        image: "/assets/team/sankalp/msci.jpeg",
      },
      // {
      //   title: "NISM",
      //   image: "/assets/team/sankalp/in.jpg",
      // },
      {
        title: "Mumbai University",
        image: "/assets/team/sankalp/mu.jpeg",
      },
      {
        title: "York University",
        image: "/assets/team/sankalp/york.jpeg",
      },
      // {
      //   title: "Robo Rupee",
      //   image: "/assets/robo-rupee-logo.svg",
      // },
    ],
  },

  {
    id: 2,
    name: "Vardhaman Jain",
    role: "CTO / Co-Founder",
    image: "/assets/team/vardhman.png",

    bubbles: [
      {
        title: "Technology",
      },
      {
        title: "Engineering",
      },
      {
        title: "Innovation",
      },
      {
        title: "Systems",
      },
      {
        title: "Product",
      },
      {
        title: "Execution",
      },
    ],
  },
];

export default function TeamSlide({
  onContinue,
  onPrevious,
  isPresentationVisible,
}) {
  const sectionRef = useRef(null);
  const personRef = useRef(null);
  const bubbleRefs = useRef([]);
  const headingRef = useRef(null);
  const animationRef = useRef(null);
  const hasEnteredRef = useRef(false);

  const [activeMember, setActiveMember] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const member = TEAM_MEMBERS[activeMember];

  const animateMember = useCallback((index, initial = false) => {
  const person = personRef.current;
  const bubbles = bubbleRefs.current.filter(Boolean);
  const heading = headingRef.current;

  if (!person || !heading || !bubbles.length) return;

  animationRef.current?.kill();

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  setIsAnimating(true);

  /*
   * The portrait's CSS position is the final destination.
   * GSAP only animates the transform from an offset to x: 0, y: 0.
   */
 const timeline = gsap.timeline({
  onComplete: () => {
    gsap.set(person, {
      x: 0,
      y: 0,
      scale: 1,
    });

    setIsAnimating(false);
  },
});

  animationRef.current = timeline;

  // Member 1: enter from below.
  if (index === 0 && initial) {
    gsap.set(person, {
      x: 0,
      y: 140,
      opacity: 0,
      scale: 0.94,
    });

    gsap.set(heading, {
      y: 22,
      opacity: 0,
    });

    gsap.set(bubbles, {
      x: 0,
      y: 18,
      opacity: 0,
      scale: 0.94,
    });

    timeline
      .to(person, {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        duration: reducedMotion ? 0.2 : 1.25,
        ease: reducedMotion ? "none" : "power4.out",
      })
      .to(
        heading,
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0.2 : 0.7,
          ease: "power3.out",
        },
        reducedMotion ? 0 : "-=0.8"
      )
      .to(
        bubbles,
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: reducedMotion ? 0.2 : 0.65,
          stagger: reducedMotion ? 0 : 0.12,
          ease: reducedMotion ? "none" : "power3.out",
        },
        reducedMotion ? 0 : "-=0.4"
      );

    return;
  }

  // Returning to member 1 should also animate from below.
if (index === 0) {
  gsap.set(person, {
    x: 0,
    y: 140,
    opacity: 0,
    scale: 0.94,
  });

  gsap.set(heading, {
    x: 0,
    y: 22,
    opacity: 0,
  });

  gsap.set(bubbles, {
    x: 0,
    y: 18,
    opacity: 0,
    scale: 0.94,
  });

  timeline
    .to(person, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      duration: reducedMotion ? 0.2 : 1.25,
      ease: reducedMotion ? "none" : "power4.out",
    })
    .to(
      heading,
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: reducedMotion ? 0.2 : 0.7,
      },
      reducedMotion ? 0 : "-=0.8"
    )
    .to(
      bubbles,
      {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        duration: reducedMotion ? 0.2 : 0.65,
        stagger: reducedMotion ? 0 : 0.12,
      },
      reducedMotion ? 0 : "-=0.4"
    );

  return;
}

  // Member 2: enter from the right.
  gsap.set(person, {
    x: 180,
    y: 0,
    opacity: 0,
    scale: 0.96,
  });

  gsap.set(heading, {
    x: 30,
    opacity: 0,
  });

  gsap.set(bubbles, {
    x: 28,
    y: 12,
    opacity: 0,
    scale: 0.94,
  });

  timeline
    .to(person, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      duration: reducedMotion ? 0.2 : 1.2,
      ease: reducedMotion ? "none" : "power4.out",
    })
    .to(
      heading,
      {
        x: 0,
        opacity: 1,
        duration: reducedMotion ? 0.2 : 0.7,
        ease: "power3.out",
      },
      reducedMotion ? 0 : "-=0.8"
    )
    .to(
      bubbles,
      {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        duration: reducedMotion ? 0.2 : 0.65,
        stagger: reducedMotion ? 0 : 0.12,
        ease: reducedMotion ? "none" : "power3.out",
      },
      reducedMotion ? 0 : "-=0.4"
    );
}, []);

useEffect(() => {
  if (!isPresentationVisible || hasEnteredRef.current) {
    return;
  }

  let secondFrame = 0;

  const firstFrame = requestAnimationFrame(() => {
    secondFrame = requestAnimationFrame(() => {
      if (hasEnteredRef.current) {
        return;
      }

      hasEnteredRef.current = true;
      animateMember(0, true);
    });
  });

  return () => {
    cancelAnimationFrame(firstFrame);

    if (secondFrame) {
      cancelAnimationFrame(secondFrame);
    }
  };
}, [isPresentationVisible, animateMember]);

 const showPreviousMember = () => {
  if (isAnimating) return;

  if (activeMember === 1) {
    setActiveMember(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animateMember(0);
      });
    });

    return;
  }

  onPrevious?.();
};

  const showNextMember = () => {
    if (isAnimating) return;

    if (activeMember === 0) {
      setActiveMember(1);

      /*
       * Wait for React to render the new member's details and image.
       */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => animateMember(1));
      });
    } else {
      onContinue?.();
    }
  };

  return (
    <section
      id="team"
      className="team-slide deck-section"
      ref={sectionRef}
      aria-label="Meet the team"
    >
      <div className="team-slide__stars" aria-hidden="true" />
      <div className="team-slide__ambient team-slide__ambient--blue" />
      <div className="team-slide__ambient team-slide__ambient--violet" />

      <div className="team-slide__layout">
        <div className="team-slide__intro" ref={headingRef}>
          <p className="deck-eyebrow">The people behind the vision</p>

          <h2 className="team-slide__heading">
            Meet the{" "}
            <span>team.</span>
          </h2>

        </div>

        <div className="team-slide__stage">
          <div className="team-slide__visual">
          <div className="team-slide__halo" aria-hidden="true" />

          <div
            key={member.id}
            className={`team-slide__person team-slide__person--${member.id}`}
            ref={personRef}
          >
            <img
              src={member.image}
              alt={`${member.name}, ${member.role}`}
              className="team-slide__portrait"
              draggable="false"
            />

            <div className="team-slide__person-glow" aria-hidden="true" />
          </div>

          {/* Circular badges surrounding the portrait. */}
<div
  className="team-keywords"
  aria-label={`${member.name}'s professional background`}
>
  {member.bubbles.map((bubble, index) => (
    <div
      key={`${member.id}-${bubble.title}`}
      ref={(element) => {
        bubbleRefs.current[index + 1] = element;
      }}
      className={`team-keyword team-keyword--${index + 1}`}
      title={bubble.title}
    >
      {bubble.image ? (
        <img
          src={bubble.image}
          alt={bubble.title}
          className="team-keyword__image"
          loading="eager"
          draggable="false"
        />
      ) : (
        <span className="team-keyword__label">{bubble.title}</span>
      )}
    </div>
  ))}
</div>
          </div>

          <div className="team-bubble team-bubble--identity" ref={(el) => {
            bubbleRefs.current[0] = el;
          }}>
            <div className="team-bubble__identity-copy">
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              {member.id === 1 && (
                <p className="team-bubble__certification">Certified in</p>
              )}
            </div>
          </div>
        </div>

        <SlideNavigation
          onPrevious={showPreviousMember}
          onContinue={showNextMember}
          disabled={isAnimating}
        >
          <div className="team-slide__pagination" aria-label="Team member">
            {TEAM_MEMBERS.map((item, index) => (
              <span
                key={item.id}
                className={
                  index === activeMember
                    ? "team-slide__dot team-slide__dot--active"
                    : "team-slide__dot"
                }
              />
            ))}
          </div>
        </SlideNavigation>
      </div>
    </section>
  );
}
