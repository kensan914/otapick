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
       * @param {Object} action [type, token, startUpLogind] */

      storeItem("token", action.token);
      action.startUpLogind();
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

const AuthStateContext = createContext({ ...initAuthState });
const AuthDispatchContext = createContext(undefined);

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  return context;
};
export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  return context;
};

const AuthProvider = ({ children, cookies }) => {
  const [authState, authDispatch] = useReducer(authReducer, { ...initAuthState });

  useEffect(() => {
    let _token = getItem("token");

    if (Object.keys(cookies.cookies).indexOf("token") !== -1) {
      _token = cookies.get("token");
      storeItem("token", _token);
      cookies.remove("token");
    }

    if (_token) authDispatch({ type: "COMPLETE_SIGNIN", token: _token, startUpLogind: () => { } });
  }, []);

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={authDispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export default withCookies(AuthProvider);