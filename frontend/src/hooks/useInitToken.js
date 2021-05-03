import { useEffect, useState } from "react";
import { getItem } from "~/utils";

/**
 * App.jsxで用いるアプリ起動時のtokenの初期化
 * localstorage(優先), cookiesからtokenを取得
 * @param {*} cookies
 * @returns
 */
export const useInitToken = (cookies) => {
  const [token, setToken] = useState(getItem("token"));

  useEffect(() => {
    if (!token && Object.keys(cookies.cookies).indexOf("token") !== -1) {
      setToken(cookies.get("token"));
      cookies.remove("token");
    }
  }, []);

  return token;
};
