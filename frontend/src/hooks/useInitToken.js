import { useRef } from "react";
import { getItem } from "~/utils";
import { useConstructor } from "~/hooks/useConstructor";

/**
 * App.jsxで用いるアプリ起動時のtokenの初期化
 * localstorage(優先), cookiesからtokenを取得
 * @param {*} cookies
 * @returns
 */
export const useInitToken = (cookies) => {
  const token = useRef(getItem("token"));

  useConstructor(() => {
    if (
      !token.current &&
      Object.keys(cookies.cookies).indexOf("token") !== -1
    ) {
      token.current = cookies.get("token");
      cookies.remove("token");
    }
  });

  return token.current;
};
