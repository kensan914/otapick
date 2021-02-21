import React from "react";
import LinkButton from "../atoms/LinkButton";
import { isMobile, isSmp } from "../modules/utils";


const ProfileButtonGroup = (props) => {
  const { username } = props;

  return (
    <div className="row mt-4 mt-sm-5 mx-0 mx-sm-3 mx-md-0">
      <LinkButton
        to={`/users/${username}/`}
        className={`rounded-pill profile-mode-select-button active ${isMobile ? "mobile" : ""} ${isSmp ? "ml-0" : "ml-3"}`}>
        <b>マイフォルダ</b>
      </LinkButton>
    </div>
  );
}

export default ProfileButtonGroup;