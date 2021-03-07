import React from "react";
import { withRouter } from "react-router-dom";
import { isMobile } from "../modules/utils";
import { HorizontalLoader } from "../molecules/Loader";
import ProfileButtonGroup from "../molecules/ProfileButtonGroup";
import ImageList from "../organisms/List/ImageList";
import ProfileView from "../organisms/ProfileView";

const UserTemplate = (props) => {
  const { profile, username, isMe, isLoading } = props;

  return (
    <>
      {/* KeepAliveが初期レンダー時のHorizontalLoaderのheightを記憶し、ProfileViewとのheightの差により描画がずれるためheight固定 */}
      <div
        className="container mt-3 text-muted"
        style={{ height: isMobile ? 90 : 130 }}
      >
        {isLoading ? <HorizontalLoader /> : <ProfileView profile={profile} />}
      </div>

      {isMe ? (
        <>
          <div className="container-fluid mt-3 text-muted">
            <ProfileButtonGroup username={username} />
          </div>
          <div className="container-fluid text-muted mt-3 list-container-fluid favorite-images-container">
            <ImageList type="FAVORITE_IMAGES" />
          </div>
        </>
      ) : (
        <div style={{ marginTop: 300 }} />
      )}
    </>
  );
};

export default withRouter(UserTemplate);
