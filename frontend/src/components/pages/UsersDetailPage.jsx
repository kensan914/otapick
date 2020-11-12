import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useProfileState } from "../contexts/ProfileContext";
import { useAxios } from "../modules/axios";
import { BASE_URL } from "../modules/env";
import { URLJoin } from "../modules/utils";
import UsersDetailTemplate from "../templates/UsersDetailTemplate";


const User = (props) => {
  const profileState = useProfileState();
  const username = props.match.params.username;
  const isMe = profileState.profile.username === username;

  const [userProfile, setUserProfile] = useState({});
  const { isLoading, resData, request } = useAxios(URLJoin(BASE_URL, "users/", username), "get", {
    thenCallback: res => setUserProfile(res.data),
  });

  useEffect(() => {
    request();
  }, [username]);

  return (
    <UsersDetailTemplate isLoading={isLoading} profile={userProfile} username={username} isMe={isMe} />
  );
}


export default withRouter(User);