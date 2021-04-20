import React from "react";
import { Link } from "react-router-dom";
import { isMobile } from "../../modules/utils";
import Headline from "../../molecules/Headline";

const SettingsTemplate = (props) => {
  const { SETTINGS_COLLECTION, type } = props;

  return (
    <div className={`container text-muted ${isMobile ? "" : "mt-3"}`}>
      <Headline title="設定" />

      <div className="my-1 mb-lg-4">
        <div className="row">
          {/* settings menu */}
          <div className="col-lg-3">
            <div className="settings-menu-container p-2 shadow-sm mb-3 mb-lg-0">
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
          <div className="col-lg-9">
            {SETTINGS_COLLECTION[type].contentTemplate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTemplate;
