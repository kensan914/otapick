import React from "react";
import { Link } from "react-router-dom";

const RoundButton = (props) => {
  const {
    onClick = () => void 0,
    fontSize = 16,
    colorSet = "nogi", // "nogi" | "gray" | "twitter"
    canSubmit = true,
    isLoading = false,
    children,
    style = {}, // optional
    href = "", // optional, 指定した場合buttonではなく、anchorタグ
    to, // optional, 指定した場合buttonをLink化
    className = "", // optional
  } = props;

  const anchor = (
    <a
      href={href}
      className={`active round-button rounded-pill px-3 py-2 ${
        colorSet ? colorSet : ""
      } ${className ? className : ""}`}
      style={style}
    >
      <b style={{ fontSize: fontSize }}>{children}</b>
    </a>
  );

  const button = (
    <button
      disabled={!canSubmit || isLoading}
      className={`round-button rounded-pill px-3 py-2 ${
        canSubmit ? "active" : ""
      } ${colorSet ? colorSet : ""} ${className ? className : ""}`}
      onClick={onClick}
      style={{
        ...(canSubmit ? {} : { cursor: "default" }),
        ...(isLoading ? { cursor: "wait" } : {}),
        ...style,
      }}
    >
      <b style={{ fontSize: fontSize }}>{children}</b>
    </button>
  );

  if (href) {
    return anchor;
  } else if (to) {
    return (
      <Link to={to} style={{ textDecoration: "none" }}>
        {button}
      </Link>
    );
  } else {
    return button;
  }
};

export default RoundButton;
