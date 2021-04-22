import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useProfileState } from "../contexts/ProfileContext";
import { useAxios } from "../modules/axios";
import { BASE_URL } from "../modules/env";
import {
  deepCvtKeyFromSnakeToCamel,
  gtagTo,
  updateMeta,
  URLJoin,
} from "../modules/utils";
import UsersDetailTemplate from "../templates/UsersDetailTemplate";

const UserPage = () => {
  const profileState = useProfileState();
  const location = useLocation();

  const params = useParams();
  const [username] = useState(params?.username);
  const isMe = profileState.profile.username === username;
  const [isReadyProfile, setIsReadyProfile] = useState(false);

  const [userProfile, setUserProfile] = useState();
  const { isLoading, request } = useAxios(
    URLJoin(BASE_URL, "users/", username),
    "get",
    {
      thenCallback: (res) => {
        const _profile = deepCvtKeyFromSnakeToCamel(res.data);
        setUserProfile(_profile);
        updateMeta({
          title: `${_profile.name}(@${_profile.username})`,
          description: "",
        });
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
      updateMeta({
        title: `${profileState.profile.name}(@${profileState.profile.username})`,
        description: "",
      });
    }
  }, [profileState.profile]);

  useEffect(() => {
    if (typeof userProfile !== "undefined" && !isReadyProfile) {
      setIsReadyProfile(true);
    }
  }, [userProfile]);

  return (
    <UsersDetailTemplate
      isLoading={isLoading}
      profile={userProfile}
      username={username}
      isMe={isMe}
      accessKey={location?.state?.accessKey} // accessKeyが付与された遷移元の時、FavoriteListを更新
      isReadyProfile={isReadyProfile}
    />
  );
};

export default UserPage;
