import React, { useState } from "react";

const TooltipComponent = (props) => {
  const {
    children,
    title,
    backgroundColor = "rgb(50, 50, 50)",
    placement = "top" /* ?: "bottom"|"top" */,
  } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  if (!title) return <></>;

  const renderTooltipBody = (placement) => (
    <div
      className={`tooltip-body rounded-pill px-2 py-1 ${placement}`}
      style={{
        ...(backgroundColor ? { background: backgroundColor } : {}),
      }}
    >
      {title}
    </div>
  );
  return (
    <div className={`tooltip-container ${tooltipOpen ? "active" : ""}`}>
      <span className="tooltip-wrapper">
        {placement === "top" && renderTooltipBody(placement)}
        <div
          onMouseEnter={() => {
            setTooltipOpen(true);
          }}
          onMouseLeave={() => {
            setTooltipOpen(false);
          }}
        >
          {children}
        </div>
        {placement === "bottom" && renderTooltipBody(placement)}
      </span>
    </div>
  );
};

export default TooltipComponent;
