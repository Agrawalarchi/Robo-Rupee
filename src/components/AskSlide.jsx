import { useState } from "react";
import SlideNavigation from "./SlideNavigation";

const ALLOCATIONS = [
  {
    id: "marketing",
    label: "Marketing",
    percentage: 60,
    amount: "₹1.20 Cr",
    color: "#36B8FF",
  },
  {
    id: "salaries",
    label: "Salaries",
    percentage: 20,
    amount: "₹40 Lakh",
    color: "#9861FF",
  },
  {
    id: "legal",
    label: "Legal & Compliance",
    percentage: 10,
    amount: "₹20 Lakh",
    color: "#C19AFF",
  },
  {
    id: "product",
    label: "Product & AI Costs",
    percentage: 6,
    amount: "₹12 Lakh",
    color: "#45D6BD",
  },
  {
    id: "reserve",
    label: "Rainy Day Reserve",
    percentage: 4,
    amount: "₹8 Lakh",
    color: "#F2B85B",
  },
];

const CHART_SIZE = 360;
const CENTER = CHART_SIZE / 2;
const RADIUS = 126;
const STROKE_WIDTH = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function FundingDonut() {
  const [activeIndex, setActiveIndex] = useState(null);

  const activeAllocation =
    activeIndex === null ? null : ALLOCATIONS[activeIndex];

  let cumulativePercentage = 0;

  const slices = ALLOCATIONS.map((allocation, index) => {
    const startPercentage = cumulativePercentage;
    cumulativePercentage += allocation.percentage;

    const segmentLength =
      (allocation.percentage / 100) * CIRCUMFERENCE;

    const offset =
      -(startPercentage / 100) * CIRCUMFERENCE;

    return {
      ...allocation,
      index,
      segmentLength,
      offset,
    };
  });

  return (
    <div className="funding-chart">
      <div className="funding-chart__visual">
        <svg
          className="funding-chart__svg"
          viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
          role="group"
          aria-label="Interactive funding allocation donut chart"
        >
          <defs>
            <filter
              id="funding-chart-glow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur
                stdDeviation="5"
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Single background track */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#20243B"
            strokeWidth={STROKE_WIDTH}
          />

          {/* Five interactive segments */}
          {slices.map((slice) => {
            const isActive = activeIndex === slice.index;

            return (
              <circle
                key={slice.id}
                className={`funding-chart__segment ${
                  isActive
                    ? "funding-chart__segment--active"
                    : ""
                }`}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={slice.color}
                strokeWidth={
                  isActive ? STROKE_WIDTH + 9 : STROKE_WIDTH
                }
                strokeDasharray={`${slice.segmentLength} ${
                  CIRCUMFERENCE - slice.segmentLength
                }`}
                strokeDashoffset={slice.offset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
                filter={isActive ? "url(#funding-chart-glow)" : undefined}
                tabIndex={0}
                role="button"
                aria-label={`${slice.label}: ${slice.percentage}%, ${slice.amount}`}
                aria-pressed={isActive}
                onMouseEnter={() => setActiveIndex(slice.index)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(slice.index)}
                onBlur={() => setActiveIndex(null)}
                onClick={() =>
                  setActiveIndex((current) =>
                    current === slice.index ? null : slice.index
                  )
                }
              />
            );
          })}
        </svg>

        {/* Center content remains inside the chart */}
        <div className="funding-chart__center" aria-live="polite">
          {activeAllocation ? (
            <>
              <span
                className="funding-chart__center-dot"
                style={{
                  backgroundColor: activeAllocation.color,
                }}
              />

              <span className="funding-chart__center-label">
                {activeAllocation.label}
              </span>

              <strong
                className="funding-chart__percentage"
                style={{
                  color: activeAllocation.color,
                }}
              >
                {activeAllocation.percentage}%
              </strong>

              <span className="funding-chart__amount">
                {activeAllocation.amount}
              </span>
            </>
          ) : (
            <>
              <span className="funding-chart__total-label">
                TOTAL RAISE
              </span>

              <strong className="funding-chart__total">
                ₹2 Cr
              </strong>

              <span className="funding-chart__center-caption">
                FUNDING ASK
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="funding-chart__legend">
        {ALLOCATIONS.map((allocation, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={allocation.id}
              type="button"
              className={`funding-chart__legend-item ${
                isActive
                  ? "funding-chart__legend-item--active"
                  : ""
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              onClick={() =>
                setActiveIndex((current) =>
                  current === index ? null : index
                )
              }
              aria-pressed={isActive}
              style={{
                "--allocation-color": allocation.color,
              }}
            >
              <span className="funding-chart__legend-dot" />

              <span className="funding-chart__legend-name">
                {allocation.label}
              </span>

              <strong className="funding-chart__legend-percent">
                {allocation.percentage}%
              </strong>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AskSlide({ onPrevious, onContinue }) {
  return (
    <section
      id="ask"
      className="ask-slide deck-section"
      aria-labelledby="ask-heading"
    >
      <div className="ask-slide__stars" aria-hidden="true" />

      <div
        className="ask-slide__glow ask-slide__glow--blue"
        aria-hidden="true"
      />

      <div
        className="ask-slide__glow ask-slide__glow--violet"
        aria-hidden="true"
      />

      <div className="ask-slide__inner">
        <header className="ask-slide__header slide-heading">
          <p className="ask-slide__eyebrow slide-heading__eyebrow">
            <span />
            THE ASK
          </p>

          <h2 id="ask-heading" className="ask-slide__heading">
            Fueling the <span>next phase.</span>
          </h2>

        </header>

        <main className="ask-slide__main">
          <div className="ask-slide__chart-heading">
            <span className="ask-slide__heading-line" />
            <h3>Where it goes</h3>
            <span className="ask-slide__total-pill">
              ₹2 Cr total
            </span>
          </div>

          <FundingDonut />

          <p className="ask-slide__hint">
            Hover over a segment to explore how the funding will be used.
          </p>
        </main>

        <SlideNavigation onPrevious={onPrevious} onContinue={onContinue} />
      </div>
    </section>
  );
}
