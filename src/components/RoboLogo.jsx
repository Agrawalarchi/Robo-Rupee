export default function RoboLogo({ className = "" }) {
  const isHeader = className.includes("robo-brand--header");

  return (
    <div
      className={`robo-brand ${className}`}
      style={
        isHeader
          ? {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "7px",
              width: "150px",
              height: "44px",
              minWidth: 0,
              maxWidth: "150px",
              flex: "0 0 150px",
              overflow: "visible",
            }
          : undefined
      }
    >
      <img
        className="robo-brand__emblem"
        src="/assets/logo icon.svg"
        alt="Robo Rupee emblem"
        draggable="false"
        style={
          isHeader
            ? {
                display: "block",
                width: "36px",
                height: "36px",
                minWidth: "36px",
                maxWidth: "36px",
                minHeight: "36px",
                maxHeight: "36px",
                flex: "0 0 36px",
                objectFit: "contain",
              }
            : undefined
        }
      />

      <div
        className="robo-brand__wordmark"
        style={
          isHeader
            ? {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "3px",
                width: "auto",
                height: "auto",
                minWidth: 0,
                maxWidth: "105px",
                lineHeight: 1,
              }
            : undefined
        }
      >
        <span
          className="robo-brand__vertical"
          style={
            isHeader
              ? {
                  position: "static",
                  display: "block",
                  width: "auto",
                  height: "auto",
                  writingMode: "horizontal-tb",
                  transform: "none",
                  fontSize: "9px",
                  lineHeight: 1,
                  letterSpacing: "1px",
                }
              : undefined
          }
        >
          ROBO
        </span>

        <span
          className="robo-brand__name"
          style={
            isHeader
              ? {
                  display: "block",
                  fontSize: "16px",
                  lineHeight: 1,
                  letterSpacing: "-0.4px",
                  whiteSpace: "nowrap",
                }
              : undefined
          }
        >
          RUPEE
        </span>
      </div>
    </div>
  );
}