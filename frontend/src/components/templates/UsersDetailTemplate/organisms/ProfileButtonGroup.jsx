import React, { useState } from "react";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LinkButton from "~/components/atoms/LinkButton";
import { useAuthState } from "~/contexts/AuthContext";
import { useAxios } from "~/hooks/useAxios";
import { BASE_URL } from "~/constants/env";
import { isMobile, isSmp, URLJoin } from "~/utils";

const ProfileButtonGroup = (props) => {
  const { username, favoriteListKey } = props;
  const authState = useAuthState();

  const [favoritesNum, setFavoritesNum] = useState(0);
  const [maxFavoritesNum, setMaxFavoritesNum] = useState(0);

  useAxios(URLJoin(BASE_URL, "favorites/info/"), "get", {
    thenCallback: (res, resData) => {
      setFavoritesNum(resData.favoritesNum);
      setMaxFavoritesNum(resData.maxFavoritesNum);
    },
    token: authState.token,
    shouldRequestDidMount: true,
  });

  return (
    <div className="row mt-4 mt-sm-5 mx-0 mx-sm-3 mx-md-0">
      <LinkButton
        to={{
          pathname: `/users/${username}/`,
          state: { accessKey: favoriteListKey },
        }}
        className={`rounded-pill profile-mode-select-button active ${
          isMobile ? "mobile" : ""
        } ${isSmp ? "ml-0" : "ml-3"}`}
      >
        <FontAwesomeIcon icon={faFolder} className="mr-2" />
        <b>マイフォルダ</b>

        {/* バッジ */}
        <div className="ml-2 px-1 rounded-pill profile-mode-select-button-badge">
          <b>{favoritesNum}</b>
          {`/${maxFavoritesNum}`}
        </div>
      </LinkButton>
    </div>
  );
};

export default ProfileButtonGroup;
