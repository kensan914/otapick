import React from "react";
import LinkButton from "../atoms/LinkButton";
import { isMobile } from "../modules/utils";


const ProfileButtonGroup = (props) => {
  const { username } = props;

  return (
    <div className="row mt-4 mt-sm-5 mb-3">
      <LinkButton to={`/users/${username}/`} className={`ml-3 rounded-pill profile-mode-select-button active ${isMobile ? "mobile" : ""}`}>
        <b>マイフォルダ</b>
      </LinkButton>
    </div>
  );
}

export default ProfileButtonGroup;