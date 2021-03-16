import React from "react";

const SettingsHeader = (props) => {
  const { title, description, className = "" } = props;

  return (
    <div className={`settings-header ${className}`}>
      <h1 style={{ fontSize: "2rem" }}>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default SettingsHeader;
