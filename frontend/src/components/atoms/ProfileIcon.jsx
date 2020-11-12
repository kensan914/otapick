import React from "react";
import { isSmp } from "../modules/utils";


const ProfileIcon = (props) => {
  const { imageUrl, size } = props;
  const imageSize = size ? size : (isSmp ? 49 : 60);
  const imageWrapperSize = imageSize + imageSize / 9;

  return (
    <div className="profile-icon-wrapper rounded-circle"
      style={{ height: imageWrapperSize, width: imageWrapperSize }}>
      <img className="profile-icon-image rounded-circle" src={imageUrl}
        style={{ height: imageSize, width: imageSize }} />
    </div>
  );
}


export default ProfileIcon;