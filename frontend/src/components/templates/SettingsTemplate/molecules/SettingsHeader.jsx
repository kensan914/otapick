import React from "react";

const SettingsHeader = (props) => {
  const { title, description, className = "" } = props;

  return (
    <div className={`settings-header ${className}`}>
      <h2 style={{ fontSize: "2rem" }}>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default SettingsHeader;
