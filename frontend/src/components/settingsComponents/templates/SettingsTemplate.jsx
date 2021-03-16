import React from "react";
import { Link } from "react-router-dom";

const SettingsTemplate = (props) => {
  const { SETTINGS_COLLECTION, type } = props;

  return (
    <div className="container text-muted my-4">
      <div className="row">
        {/* settings menu */}
        <div className="col-3">
          <div className="settings-menu-container p-2 shadow-sm">
            {Object.entries(SETTINGS_COLLECTION).map(
              ([_type, settingsObj], i) => {
                let isActive = type === _type;
                return (
                  <Link
                    to={settingsObj.url}
                    key={i}
                    className={`d-flex settings-menu-item my-1 py-1 px-2 ${
                      isActive ? "active" : ""
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    <b>{settingsObj.title}</b>
                  </Link>
                );
              }
            )}
          </div>
        </div>

        {/* settings content */}
        <div className="col-9">{SETTINGS_COLLECTION[type].contentTemplate}</div>
      </div>
    </div>
  );
};

export default SettingsTemplate;
