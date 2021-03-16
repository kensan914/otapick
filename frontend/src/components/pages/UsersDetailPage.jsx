import React, { useEffect, useState } from "react";
import { useLocation, useParams, withRouter } from "react-router-dom";
import { useProfileState } from "../contexts/ProfileContext";
import { useAxios } from "../modules/axios";
import { BASE_URL } from "../modules/env";
import {
  checkNotCached,
  deepCvtKeyFromSnakeToCamel,
  updateMeta,
  URLJoin,
} from "../modules/utils";
import UsersDetailTemplate from "../templates/UsersDetailTemplate";

const UserPage = (props) => {
  const profileState = useProfileState();

  const params = useParams();
  const [username] = useState(checkNotCached(props) ? params.username : "");
  const isMe = profileState.profile.username === username;

  const [userProfile, setUserProfile] = useState({});
  const { isLoading, request } = useAxios(
    URLJoin(BASE_URL, "users/", username),
    "get",
    {
      thenCallback: (res) => {
        const _profile = deepCvtKeyFromSnakeToCamel(res.data);
        setUserProfile(_profile);
        updateMeta({ title: _profile.name, description: "" });
      },
    }
  );

  useEffect(() => {
    if (isMe) {
      setUserProfile({ ...profileState.profile });
    } else {
      request();
    }
  }, [username]);

  useEffect(() => {
    if (isMe) {
      setUserProfile({ ...profileState.profile });
    }
  }, [profileState.profile]);

  const location = useLocation();
  return (
    <UsersDetailTemplate
      isLoading={isLoading}
      profile={userProfile}
      username={username}
      isMe={isMe}
      accessKey={location?.state?.accessKey} // accessKeyが付与された遷移元の時、FavoriteListを更新
    />
  );
};

export default withRouter(UserPage);
