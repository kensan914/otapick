import React, { createContext, useReducer, useContext, useEffect } from "react";

import { useAxios } from "~/hooks/useAxios";
import { BASE_URL } from "~/constants/env";
import {
  deepCvtKeyFromSnakeToCamel,
  getJson,
  removeItem,
  storeJson,
  URLJoin,
} from "~/utils";
import { useAuthState } from "~/contexts/AuthContext";
import { useAuthDispatch } from "~/contexts/AuthContext";

const initProfile = Object.freeze({
  id: "",
  username: "",
  email: "",
  name: "",
  image: "",
  me: true,
});

const ProfileReducer = (prevState, action) => {
  let _profile;
  switch (action.type) {
    case "SET_PROFILE":
      /** profileをset。localstorageのloggedoutProfileを削除する。
       * @param {Object} action [type, profile] */

      removeItem("loggedoutProfile");
      _profile = { ...prevState.profile, ...action.profile };
      storeJson("profile", _profile);

      return {
        ...prevState,
        profile: _profile,
      };

    case "RESET_PROFILE_TO_LOGOUT":
      /** ログアウトによるプロフィールのリセット。localstorageのprofileをloggedoutProfileにコピーする。
       * @param {Object} action [type] */

      removeItem("profile");
      storeJson("loggedoutProfile", prevState.profile);
      return {
        ...prevState,
        profile: { ...initProfile },
      };

    default:
      console.error(`Not found "${action.type}" action.type.`);
      return;
  }
};

export const ProfileStateContext = createContext({
  profile: { ...initProfile },
});
export const ProfileDispatchContext = createContext(undefined);

export const useProfileState = () => {
  const context = useContext(ProfileStateContext);
  return context;
};
export const useProfileDispatch = () => {
  const context = useContext(ProfileDispatchContext);
  return context;
};

const ProfileProvider = ({ children }) => {
  const _profile = getJson("profile");
  const [profileState, profileDispatch] = useReducer(ProfileReducer, {
    profile: _profile
      ? deepCvtKeyFromSnakeToCamel(_profile)
      : { ...initProfile },
  });

  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

  const { request } = useAxios(URLJoin(BASE_URL, "me/"), "get", {
    thenCallback: (res, resData) =>
      profileDispatch({
        type: "SET_PROFILE",
        profile: resData,
      }),
    catchCallback: (err) => {
      if (err?.response?.status === 401) {
        // ログアウト (認証エラー時)
        authDispatch({
          type: "COMPLETE_LOGOUT",
          profileDispatch: profileDispatch,
        });
        window.location.href = "/";
      }
    },
    token: authState.token,
  });

  useEffect(() => {
    if (authState.status === "Authenticated") {
      request();
    }
  }, [authState.status]);

  return (
    <ProfileStateContext.Provider value={profileState}>
      <ProfileDispatchContext.Provider value={profileDispatch}>
        {children}
      </ProfileDispatchContext.Provider>
    </ProfileStateContext.Provider>
  );
};

export default ProfileProvider;
