import React from "react";
import queryString from "query-string";

import { BlogListInfo } from "~/components/templates/BlogListTemplate/organisms/BlogListInfo";
import { BlogList } from "~/components/templates/BlogListTemplate/organisms/BlogList";
import Headline from "~/components/molecules/Headline";
import { isMobile } from "~/utils";

export const BlogListTemplate = (props) => {
  const {
    groupId,
    ct,
    groupKey,
    narrowingKeyword,
    narrowingPost,
    pushHistoryList,
    infoTitle,
    numOfHit,
    infoStatus,
    sortButtonTitle,
  } = props;

  return (
    <div className="container mt-3 text-muted">
      <Headline
        title="ブログ一覧"
        type="blogs"
        mode={groupKey ? groupKey : "recommend"}
        groupID={groupId}
        ct={ct}
      />

      <BlogListInfo
        groupKey={groupKey}
        hide={
          typeof groupId === "undefined" && typeof ct === "undefined"
            ? true
            : false
        }
        infoTitle={infoTitle}
        narrowingKeyword={narrowingKeyword}
        narrowingPost={narrowingPost}
        numOfHit={numOfHit}
        infoStatus={infoStatus}
        sortButtonTitle={sortButtonTitle}
        pushHistoryList={pushHistoryList}
      />
      {typeof groupId === "undefined" &&
        typeof ct === "undefined" &&
        !isMobile && <div className="py-2"></div>}
      <BlogList />
    </div>
  );
};

export const getBlogUrlComposition = (props) => {
  const groupID = props.match.params ? props.match.params.groupID : null;
  const ct = props.match.params ? props.match.params.ct : null;

  const qs = queryString.parse(props.location.search);
  const orderFormat = typeof qs.sort == "undefined" ? "newer_post" : qs.sort;
  const narrowingKeyword = typeof qs.keyword == "undefined" ? "" : qs.keyword;
  const narrowingPost = typeof qs.post == "undefined" ? "" : qs.post;

  return { groupID, ct, orderFormat, narrowingKeyword, narrowingPost };
};
