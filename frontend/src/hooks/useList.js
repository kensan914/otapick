import { useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import queryString from "query-string";

import { getGroup, URLJoin } from "~/utils/index";

/**
 * blogs・images兼用のhooks. URL(match.params)から各値を取得し返却.
 * @returns
 */
export const useListMatchParams = () => {
  const match = useRouteMatch();

  const [groupId] = useState(match?.params?.groupId);
  const [ct] = useState(match?.params?.ct);
  const [groupKey] = useState(getGroup(groupId));

  return { groupId, ct, groupKey };
};
/**
 * blogs・images兼用のhooks. QueryStringを取得し返却.
 * narrowingKeyword, narrowingPostのみblogs限定
 * @params type: "BLOGS" | "IMAGES"
 * @returns
 */
export const useListQueryString = (type) => {
  const location = useLocation();
  const qs = queryString.parse(location.search);

  let initSort = "";
  switch (type) {
    case "BLOGS":
      initSort = "newer_post";
      break;
    case "IMAGES":
      initSort = "recommend";
      break;
    default:
      throw new Error(`the type "${type} is unexpected."`);
  }
  const [orderFormat] = useState(
    typeof qs.sort == "undefined" ? initSort : qs.sort
  );
  const [narrowingKeyword] = useState(
    typeof qs.keyword == "undefined" ? "" : qs.keyword
  );
  const [narrowingPost] = useState(
    typeof qs.post == "undefined" ? "" : qs.post
  );

  return { orderFormat, narrowingKeyword, narrowingPost };
};

export const usePushHistoryList = () => {
  const location = useLocation();
  const match = useRouteMatch();
  const history = useHistory();
  const pushHistoryList = (qs) => {
    const currentQs = queryString.parse(location.search);
    if (!qs.sort) {
      delete currentQs.keyword;
      delete currentQs.post;
    }
    const queryParamsHash = Object.assign(currentQs, qs);
    let queryParams = "";
    Object.keys(queryParamsHash).forEach((qsKey, index) => {
      if (index == 0) queryParams += `?${qsKey}=${queryParamsHash[qsKey]}`;
      else queryParams += `&${qsKey}=${queryParamsHash[qsKey]}`;
    });
    history.push(URLJoin(match.url, queryParams));
  };

  return pushHistoryList;
};
