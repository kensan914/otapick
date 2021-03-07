import React from "react";
import ProfileIcon from "../atoms/ProfileIcon";
import { isSmp } from "../modules/utils";

const ProfileView = (props) => {
  const { profile } = props;
  const titleFontSize = isSmp ? 16 : 26;

  return (
    <div className="row my-2 my-sm-4">
      <div className="col-3 d-flex justify-content-end justify-content-sm-center px-1">
        <ProfileIcon imageUrl={profile.image} />
      </div>
      <div className="col-9">
        <h1
          className="profile-title mb-0 mb-sm-2"
          style={{ fontSize: titleFontSize }}
        >
          {profile.name}
        </h1>
        <div>@{profile.username}</div>
      </div>
    </div>
  );
};

export default ProfileView;
