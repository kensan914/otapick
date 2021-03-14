import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useProfileState } from "../contexts/ProfileContext";
import { useAxios } from "../modules/axios";
import { BASE_URL } from "../modules/env";
import { checkNotCached, updateMeta, URLJoin } from "../modules/utils";
import UsersDetailTemplate from "../templates/UsersDetailTemplate";

const User = (props) => {
  const profileState = useProfileState();
  const [username] = useState(
    checkNotCached(props) ? props.match.params.username : ""
  );
  const isMe = profileState.profile.username === username;

  const [userProfile, setUserProfile] = useState({});
  const { isLoading, request } = useAxios(
    URLJoin(BASE_URL, "users/", username),
    "get",
    {
      thenCallback: (res) => {
        setUserProfile(res.data);
        updateMeta({ title: res.data.name, description: "" });
      },
    }
  );

  useEffect(() => {
    request();
  }, [username]);

  return (
    <UsersDetailTemplate
      isLoading={isLoading}
      profile={userProfile}
      username={username}
      isMe={isMe}
      accessKey={props.location?.state?.accessKey} // accessKeyが付与された遷移元の時、FavoriteListを更新
    />
  );
};

export default withRouter(User);
