import { ArrowLeft, ArrowRight } from "lucide-react";
import "../styles/slide-navigation.css";

export default function SlideNavigation({
  onPrevious,
  onContinue,
  children,
  disabled = false,
}) {
  // toArray drops null/false, so `{condition && <x />}` counts as empty
  const hasCenterContent = Children.toArray(children).length > 0;

  return (
    <footer
      className={`slide-navigation${hasCenterContent ? "" : " slide-navigation--empty"}`}
      aria-label="Slide navigation"
    >
      <button
        type="button"
        className="slide-navigation__button slide-navigation__button--back"
        onClick={onPrevious}
        disabled={disabled}
      >
        <ArrowLeft size={18} />
        <span>BACK</span>
      </button>

      {hasCenterContent && (
        <div className="slide-navigation__center">{children}</div>
      )}

      <button
        type="button"
        className="slide-navigation__button slide-navigation__button--next"
        onClick={onContinue}
        disabled={disabled || !onContinue}
      >
        <span>NEXT</span>
        <ArrowRight size={18} />
      </button>
    </footer>
  );
}
import { Children } from "react";
