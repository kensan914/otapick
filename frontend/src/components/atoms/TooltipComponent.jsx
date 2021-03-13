import React, { useState } from "react";

const TooltipComponent = (props) => {
  const {
    children,
    title,
    backgroundColor = "rgb(50, 50, 50)",
    position = "top",
  } = props;

  const [isActive, setIsActive] = useState(false);

  return (
    <div className="tooltip-container">
      <span className="tooltip-wrapper">
        <div
          className={`tooltip-body rounded-pill px-2 py-1 ${position} ${
            isActive ? "active" : ""
          }`}
          style={{ background: backgroundColor }}
        >
          {title}
        </div>
        <div
          onMouseEnter={() => {
            setIsActive(true);
          }}
          onMouseLeave={() => {
            setIsActive(false);
          }}
        >
          {children}
        </div>
      </span>
    </div>
  );
};

export default TooltipComponent;
