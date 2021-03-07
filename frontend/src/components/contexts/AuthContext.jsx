import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getItem, removeItem, storeItem } from "../modules/utils";
import { withCookies } from "react-cookie";

const authReducer = (prevState, action) => {
  switch (action.type) {
    case "WHILE_SIGNIN":
      /** signin未完状態. signup⇒signinが完了し、plan選択に入る際に実行.
       * @param {Object} action [type, token] */

      storeItem("token", action.token);
      return {
        ...prevState,
        status: "Loading",
        token: action.token,
      };

    case "COMPLETE_SIGNIN":
      /** state関連の初期化 signin時に実行
       * @param {Object} action [type, token, startUpLoggedin] */

      storeItem("token", action.token);
      action.startUpLoggedin();
      return {
        ...prevState,
        status: "Authenticated",
        token: action.token,
      };

    case "COMPLETE_LOGOUT":
      /** state関連の削除処理 logout時に実行
       * @param {Object} action [type, profileDispatch] */

      removeItem("token");
      action.profileDispatch({ type: "RESET_PROFILE_TO_LOGOUT" });
      return {
        ...prevState,
        status: "Unauthenticated",
        token: undefined,
      };

    case "SET_TOKEN":
      /** set token.
       * @param {Object} action [type, token] */

      storeItem("token", action.token);
      return {
        ...prevState,
        status: "Authenticated",
        token: action.token,
      };

    default:
      console.error(`Not found "${action.type}" action.type.`);
      return;
  }
};

const initAuthState = {
  status: "Unauthenticated",
  token: undefined,
};

Object.freeze(initAuthState);

export const AuthStateContext = createContext({ ...initAuthState });
export const AuthDispatchContext = createContext(undefined);

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  return context;
};
export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  return context;
};

const AuthProvider = ({ children, token }) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    ...initAuthState,
    ...(token ? { status: "Authenticated" } : {}),
    ...(token ? { token: token } : {}),
  });

  useEffect(() => {
    if (token)
      authDispatch({
        type: "COMPLETE_SIGNIN",
        token: token,
        startUpLoggedin: () => {},
      });
  }, []);

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={authDispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export default AuthProvider;
