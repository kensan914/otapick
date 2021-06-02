import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";

import { initAxios, useCommonCatch } from "~/hooks/useAxios";
import {
  checkCorrectKey,
  deepCvtKeyFromSnakeToCamel,
  URLJoin,
} from "~/utils/index";

/** axios × React Query
 * 
 * フェッチしたデータをキャッシュする機能を持ったaxios hooks (メソッドはGET固定・didMount時リクエスト実行).
 * useAxiosと異なり, thenCallbackはキャッシュが存在した場合, レスポンスを待たずにそのキャッシュを用いて即時実行される.
 * Query keyは第一引数のurlである.
 * @param {string} url
 * @param {object} action [thenCallback, catchCallback, didRequestCallback, token, csrftoken, headers]
 * @return {object} UseQueryResult
 * @example
  const { data, isLoading, isError } = useAxios(URLJoin(BASE_URL, ".../"), {
    thenCallback: (res, resData) => { }, // resDataは, 整形済みであり型安全が保証されているためasしても構わない
    catchCallback: err => { },
    token: authState.token,
  });
 * */
export const useAxiosInfiniteQuery = (url, action) => {
  //---------- constants ----------//
  // ↓変更があれば都度追加していく↓
  const correctActionKeys = [
    "thenCallback",
    "catchCallback",
    "didRequestCallback",
    "token",
    "csrftoken",
    "headers",
  ];
  //---------- constants ----------//

  // init axios
  const [axiosInstance, axiosSettings] = initAxios(url, "get", action);

  axiosInstance.interceptors.response.use(
    (response) => {
      // set didRequestCallback
      if ("didRequestCallback" in action) {
        action.didRequestCallback();
      }
      return Promise.resolve(response);
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const resultQuery = useInfiniteQuery(
    url,
    async ({ pageParam = 1 }) => {
      // actionのエラーハンドリング
      checkCorrectKey(correctActionKeys, action, (incorrectkey) => {
        console.error(`"${incorrectkey}" action key is not supported.`);
      });

      axiosSettings["url"] = URLJoin(
        axiosSettings["url"],
        `?page=${pageParam}`
      );

      try {
        const res = await axiosInstance.request(axiosSettings);
        return deepCvtKeyFromSnakeToCamel(res.data);
      } catch (err) {
        useCommonCatch(err, action);
        throw err.response;
      }
    },
    {
      getPreviousPageParam: (firstPage) => {
        return firstPage.previousId ?? false;
      },
      getNextPageParam: (lastPage) => {
        if (Array.isArray(lastPage)) return lastPage.nextId ?? false;
      },
    }
  );

  useEffect(() => {
    // APIフェッチが成功し、resultQuery.data にデータが格納されたとき. または更新されたとき
    if (typeof resultQuery.data !== "undefined") {
      if ("thenCallback" in action) {
        action.thenCallback(resultQuery.data);
      }
    }
  }, [resultQuery.data]);

  return resultQuery;
};
