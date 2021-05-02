import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { checkCorrectKey, deepCvtKeyFromSnakeToCamel } from "./utils";

/**
 * カスタムHooks ver, Function verの共通init処理
 * token, dataをsetしたAxiosSettings・actionKeys・axiosInstanceを返す
 * @param url
 * @param method
 * @param action
 */
const initAxios = (url, method, action) => {
  const actionKeys = Object.keys(action);

  const axiosSettings = {
    url,
    method,
  };

  // set token & set additional headers
  const authHeaders =
    actionKeys.indexOf("token") !== -1 && action.token
      ? {
          Authorization: `JWT ${action.token}`,
        }
      : {};
  const csrftokenHeaders =
    "csrftoken" in action
      ? {
          "X-CSRFToken": action.csrftoken,
        }
      : {};
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...authHeaders,
    ...csrftokenHeaders,
    ...("headers" in action ? action.headers : {}),
  };
  axiosSettings["headers"] = headers;

  // set data
  if (actionKeys.indexOf("data") !== -1) axiosSettings["data"] = action.data;

  // generate axios instance
  const axiosInstance = axios.create();

  return [axiosInstance, axiosSettings, actionKeys];
};

/**
 * カスタムHooks ver, Function verの共通タスク(then)処理
 */
const useCommonThen = (res, action, setResData) => {
  const formattedResData = deepCvtKeyFromSnakeToCamel(res.data);

  if (action.thenCallback !== void 0) {
    action.thenCallback(res, formattedResData);
  }
  setResData && setResData(formattedResData);
};

/**
 * カスタムHooks ver, Function verの共通タスク(catch)処理
 */
const useCommonCatch = (err, action) => {
  if (err.response) {
    console.error(err.response);
  } else {
    console.error(err);
  }
  if (action.catchCallback !== void 0) action.catchCallback(err);
};
/**
 * カスタムHooks ver, Function verの共通タスク(finally)処理
 */
const useCommonFinally = (action) => {
  if (action.finallyCallback !== void 0) action.finallyCallback();
};

/** axiosを使用したリクエストのカスタムHooks
 * @param {string} url
 * @param {string} method [get, post, delete, put, patch]
 * @param {object} action [data, thenCallback, catchCallback, finallyCallback, didRequestCallback, token, shouldRequestDidMount, limitRequest, csrftoken, headers]
 * @return {object} { isLoading, resData, request }
 * @example
  // デフォルトではdidMount時にリクエストは走らない。didMount時の自動リクエストはaction.shouldRequestDidMountにtrueをsetし設定。
  const { isLoading, resData, request } = useAxios(URLJoin(BASE_URL, ".../"), "post", {
    data: {},
    thenCallback: (res, resData) => { }, // resDataは, 整形済みであり型安全が保証されているためasしても構わない
    catchCallback: err => { },
    token: authState.token,
    shouldRequestDidMount: true,
  });
  // request()でリクエスト。urlかdataパラメータをobjectで渡してそのリクエスト間だけで有効な上書き設定が可能。
  request({ url: URLJoin(BASE_URL, ".../"), data: {}, });
 * */
export const useAxios = (url, method, action) => {
  //---------- constants ----------//
  const axiosRequestMethods = ["get", "post", "delete", "put", "patch"];
  // ↓変更があれば都度追加していく↓
  const correctActionKeys = [
    "data",
    "thenCallback",
    "catchCallback",
    "finallyCallback",
    "didRequestCallback",
    "token",
    "shouldRequestDidMount",
    "limitRequest",
    "csrftoken",
    "headers",
  ];
  const correctRequestActionKeys = ["url", "data"];
  //---------- constants ----------//

  // init axios
  const [axiosInstance, axiosSettings, actionKeys] = initAxios(
    url,
    method,
    action
  );

  // set didRequestCallback
  axiosInstance.interceptors.request.use((request) => {
    if (action.didRequestCallback !== void 0) {
      action.didRequestCallback();
    }
    return request;
  });

  const [resData, setResData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [limitRequest] = useState(
    action.limitRequest !== void 0 && !isNaN(action.limitRequest)
      ? Number(action.limitRequest) // limitRequestが指定されている、かつ数値変換可能である
      : -1 // それ以外は-1(リクエスト無制限)
  );
  const requestNum = useRef(0);

  /** 再リクエストしたい時に使用する。最初の設定から変更できるパラメータはurl, dataのみ。どちらも引数も省略し、最初の設定を使用することが可能。
   * @param {string} url
   * @param {Object} data
   * */
  const request = (reAction = null) => {
    // リクエスト回数制限
    if (++requestNum.current > limitRequest && limitRequest >= 0) {
      console.warn(
        `The request limit set to ${limitRequest} has been exceeded. Abort the request.`
      );
      if (action.catchCallback !== void 0) action.catchCallback();
      return;
    }

    setIsLoading(true);

    const _axiosSettings = { ...axiosSettings };
    if (reAction !== null) {
      // actionのエラーハンドリング
      checkCorrectKey(correctRequestActionKeys, reAction, (incorrectkey) => {
        console.error(`"${incorrectkey}" action key is not supported.`);
      });
      if (reAction.url) _axiosSettings["url"] = reAction.url;
      if (reAction.data) _axiosSettings["data"] = reAction.data;
    }

    axiosInstance
      .request(_axiosSettings)
      .then((res) => {
        useCommonThen(res, action, setResData);
      })
      .catch((err) => {
        requestNum.current--; // リクエスト無効
        useCommonCatch(err, action);
      })
      .finally(() => {
        useCommonFinally(action);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // http methodのエラーハンドリング
    if (!axiosRequestMethods.includes(method))
      console.error(`"${method}" HTTP method is not supported.`);

    // actionのエラーハンドリング
    checkCorrectKey(correctActionKeys, action, (incorrectkey) => {
      console.error(`"${incorrectkey}" action key is not supported.`);
    });

    if (
      actionKeys.indexOf("shouldRequestDidMount") !== -1 &&
      action.shouldRequestDidMount
    ) {
      request();
    }
  }, []);

  return { isLoading, resData, request };
};

/**
 * axiosを使用したリクエスト(Function ver)
 * @param url
 * @param method
 * @param action
 */
const requestAxios = (url, method, action) => {
  // init axios
  const [axiosInstance, axiosSettings] = initAxios(url, method, action);
  const _axiosSettings = { ...axiosSettings };

  axiosInstance
    .request(_axiosSettings)
    .then((res) => {
      useCommonThen(res, action);
    })
    .catch((err) => {
      useCommonCatch(err, action);
    })
    .finally(() => {
      useCommonFinally(action);
    });
};

export default requestAxios;
