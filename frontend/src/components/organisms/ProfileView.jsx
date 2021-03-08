import React from "react";
import ProfileIcon from "../atoms/ProfileIcon";
import { isSmp } from "../modules/utils";

const ProfileView = (props) => {
  const { profile } = props;
  const titleFontSize = isSmp ? 16 : 26;

  return (
    <div className="my-2 my-sm-4">
      {/* <div className="col-3 d-flex justify-content-end justify-content-sm-center px-1"> */}
      <div className="d-flex justify-content-end justify-content-center pb-3">
        <ProfileIcon imageUrl={profile.image} />
      </div>
      {/* <div className="col-9"> */}
      <div className="d-flex align-items-center flex-column">
        <h1
          className="profile-title pb-0 pb-sm-2 m-0"
          style={{ fontSize: titleFontSize }}
        >
          {profile.name}
        </h1>
        <div className="">@{profile.username}</div>
      </div>
    </div>
  );
};

export default ProfileView;
