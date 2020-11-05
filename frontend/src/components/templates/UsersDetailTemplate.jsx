import React, { useEffect, useState } from "react";
import { KeepAlive } from "react-keep-alive";
import { withRouter } from "react-router-dom";
import { BASE_URL } from "../modules/env";
import { generateKeepAliveName, isMobile, URLJoin } from "../modules/utils";
import { HorizontalLoader } from "../molecules/Loader";
import ProfileButtonGroup from "../molecules/ProfileButtonGroup";
import ImageList from "../organisms/List/ImageList";
import ProfileView from "../organisms/ProfileView";


const UserTemplate = (props) => {
  const { profile, username, isMe, isLoading } = props;
  const [keepAliveName, setKeepAliveName] = useState(generateKeepAliveName(props.location.key));

  useEffect(() => {
    setKeepAliveName(generateKeepAliveName(props.location.key));
  }, [props.location]);

  return (
    <>
      {/* KeepAliveが初期レンダー時のHorizontalLoaderのheightを記憶し、ProfileViewとのheightの差により描画がずれるためheight固定 */}
      <div className="container mt-3 text-muted" style={{ height: isMobile ? 90 : 130 }}>
        {isLoading ?
          <HorizontalLoader /> :
          <ProfileView profile={profile} />
        }
      </div>

      {isMe ?
        <>
          <div className="container mt-3 text-muted">
            <ProfileButtonGroup username={username} />
          </div>
          {/* KeepAliveコンポーネントは初期レンダー時に必ずレンダーされるように設計する。初回はローディング中でレンダーせず、後からレンダーし始めるとエラーになる。 */}
          <KeepAlive name={keepAliveName}>
            <div className="container-fluid text-muted mt-3 list-container-fluid">
              <ImageList url={URLJoin(BASE_URL, "images/")} keepAliveName={keepAliveName} related />
            </div>
          </KeepAlive>
        </> :
        <div style={{ marginTop: 300 }} />
      }
    </>
  );
}


export default withRouter(UserTemplate);