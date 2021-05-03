import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useProfileState } from "~/contexts/ProfileContext";
import { useAxios } from "~/hooks/useAxios";
import { BASE_URL } from "~/constants/env";
import { updateMeta, URLJoin } from "~/utils";
import UsersDetailTemplate from "~/components/templates/UsersDetailTemplate";

const UserPage = () => {
  const profileState = useProfileState();
  const location = useLocation();
  const accessKey = location?.state?.accessKey;

  const params = useParams();
  const [username] = useState(params?.username);
  const isMe = profileState.profile.username === username;
  const [isReadyProfile, setIsReadyProfile] = useState(false);

  const [userProfile, setUserProfile] = useState();
  const { isLoading, request } = useAxios(
    URLJoin(BASE_URL, "users/", username),
    "get",
    {
      thenCallback: (res, resData) => {
        const _profile = resData;
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

  useEffect(() => {
    // 2回目以降レンダリング時にupdateMeta
    if (isReadyProfile) {
      updateMeta({
        title: `${profileState.profile.name}(@${profileState.profile.username})`,
        description: "",
      });
    }
  }, [accessKey]);

  return (
    <UsersDetailTemplate
      isLoading={isLoading}
      profile={userProfile}
      username={username}
      isMe={isMe}
      accessKey={accessKey} // accessKeyが付与された遷移元の時、FavoriteListを更新
      isReadyProfile={isReadyProfile}
    />
  );
};

export default UserPage;
