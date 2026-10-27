import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import RoboLogo from "./RoboLogo";

export default function SplashScreen({ onStart, logoRef }) {
  const buttonRef = useRef(null);
  const brandRef = useRef(null);
  const detailsRef = useRef(null);

  return (
    <section className="splash" aria-label="Robo Rupee introduction">
      <div className="splash__stars" aria-hidden="true" />
      <div className="splash__glow splash__glow--blue" aria-hidden="true" />
      <div className="splash__glow splash__glow--violet" aria-hidden="true" />
      <div className="splash__noise" aria-hidden="true" />

      <div className="splash__content">
        <div className="splash__brand" ref={brandRef}>
          <div className="splash__logo" ref={logoRef}  data-presentation-logo="true">
            <RoboLogo />
          </div>

          {/* <p className="splash__tagline">
            A brand of KN FIN MF SERVICES LLP
          </p> */}
        </div>

        <div className="splash__bottom" ref={detailsRef}>
          <p className="splash__registration">AMFI-ARN_365415</p>

          <button
            ref={buttonRef}
            className="splash__button"
            onClick={() => onStart({
              button: buttonRef.current,
              brand: brandRef.current,
              details: detailsRef.current,
            })}
          >
            <span>UNICORN DETAILS</span>
            <ArrowUpRight size={17} strokeWidth={1.6} />
          </button>

          <span className="splash__hint">SCROLL TO EXPLORE</span>
        </div>
      </div>
    </section>
  );
}