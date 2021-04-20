import React, { useEffect, useState } from "react";
import { useLocation, withRouter } from "react-router-dom";
import { gtagTo, isMobile, isSmp } from "../modules/utils";
import { HorizontalLoader } from "../molecules/Loader";
import ProfileButtonGroup from "../molecules/ProfileButtonGroup";
import ImageList from "../organisms/List/ImageList";
import ProfileView from "../organisms/ProfileView";

const UserTemplate = (props) => {
  const {
    profile = {},
    username,
    isMe,
    isLoading,
    accessKey,
    isReadyProfile,
  } = props;

  const location = useLocation();

  // accessKeyがundefined以外で変化した時、FavoriteListを更新
  const [userPageKey, setUserPageKey] = useState(accessKey);
  useEffect(() => {
    if (userPageKey !== accessKey && typeof accessKey !== "undefined") {
      setUserPageKey(accessKey);
    }
  }, [accessKey]);

  useEffect(() => {
    if (isReadyProfile) {
      gtagTo(location.pathname);
    }
  }, [userPageKey, isReadyProfile]);

  return (
    <>
      {/* KeepAliveが初期レンダー時のHorizontalLoaderのheightを記憶し、ProfileViewとのheightの差により描画がずれるためheight固定 */}
      <div
        className="container mt-3 text-muted"
        // style={{ height: isMobile ? 130 : 130 }}
      >
        {isLoading ? (
          <HorizontalLoader />
        ) : (
          <ProfileView profile={profile} isMe={isMe} />
        )}
      </div>

      {isMe ? (
        <>
          <div className="container-fluid mt-3 text-muted">
            <ProfileButtonGroup
              username={username}
              favoriteListKey={userPageKey}
              key={userPageKey}
            />
          </div>
          <div
            className={`container-fluid text-muted mt-3 list-container-fluid favorite-images-container ${
              isSmp ? "smp" : ""
            }`}
          >
            <ImageList key={userPageKey} type="FAVORITE_IMAGES" />
          </div>
        </>
      ) : (
        <div style={{ marginTop: 300 }} />
      )}
    </>
  );
};

export default UserTemplate;
