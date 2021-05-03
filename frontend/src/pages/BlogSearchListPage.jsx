import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

import {
  getGroup,
  generateWavesVals,
  updateMeta,
  gtagTo,
  isMobile,
  URLJoin,
} from "~/utils";
import { BASE_URL } from "~/constants/env";
import { useAxios } from "~/hooks/useAxios";
import { BlogSearchListTemplate } from "~/components/templates/BlogSearchListTemplate";

const BlogSearchListPage = () => {
  const location = useLocation();
  const history = useHistory();
  const qs = queryString.parse(location.search);

  const [groupId, setGroupId] = useState(0);
  const [groupKey, setGroupKey] = useState("");
  const [title, setTitle] = useState("");
  const [numOfHit, setNumOfHit] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [wavesVals, setWavesVals] = useState([]);

  const { request: requestGetSearch } = useAxios(
    URLJoin(
      BASE_URL,
      "search/",
      `?q=${encodeURIComponent(qs.q)}`,
      isMobile ? "?mobile=true" : void 0
    ),
    "get",
    {
      thenCallback: (res, resData) => {
        if (resData["status"] === "success" && resData["type"] === "url") {
          // redirect to blog view
          if (resData["items"].length == 1) {
            history.replace(resData["items"][0].url);
          }

          const blogs = resData["items"];
          setGroupId(resData["groupId"]);
          setGroupKey(getGroup(resData["groupId"]));
          setTitle(resData["title"]);
          setNumOfHit(resData["numOfHit"]);
          setBlogs(blogs);
          setMembers([]);
          setSearchStatus(resData["status"]);
          setSearchType(resData["type"]);

          updateMeta({
            title: `${resData["title"]}｜ブログ検索結果`,
            description: "",
          });
        } else if (
          resData["status"] === "success" &&
          resData["type"] === "member"
        ) {
          const members = resData["items"];
          setGroupId(0);
          setGroupKey("");
          setTitle(`"${qs.q}"`);
          setNumOfHit(resData["numOfHit"]);
          setBlogs([]);
          setMembers(members);
          setSearchStatus(resData["status"]);
          setSearchType(resData["type"]);
          setWavesVals(generateWavesVals());

          updateMeta({
            title: `"${qs.q}"｜メンバー検索結果`,
            description: "",
          });
        } else {
          let title;
          if (resData["type"] === "url")
            title = "ブログが見つかりませんでした。";
          else if (resData["type"] === "member")
            title = "メンバーが見つかりませんでした。";
          else title = "条件に合う結果が見つかりませんでした。";
          setGroupId(0);
          setGroupKey("");
          setTitle(title);
          setNumOfHit(0);
          setBlogs([]);
          setMembers([]);
          setSearchStatus(resData["status"]);
          setSearchType(resData["type"]);

          if (resData["type"] === "url")
            updateMeta({ title: "Not Found Blog", description: "" });
          else if (resData["type"] === "member")
            updateMeta({ title: "Not Found Member", description: "" });
          else updateMeta({ title: "Not Found", description: "" });
        }
      },
      finallyCallback: () => {
        gtagTo(location.pathname);
      },
    }
  );

  useEffect(() => {
    requestGetSearch();
  }, [location.search]);

  return (
    <BlogSearchListTemplate
      groupId={groupId}
      groupKey={groupKey}
      title={title}
      numOfHit={numOfHit}
      blogs={blogs}
      members={members}
      searchStatus={searchStatus}
      searchType={searchType}
      wavesVals={wavesVals}
    />
  );
};

export default BlogSearchListPage;
