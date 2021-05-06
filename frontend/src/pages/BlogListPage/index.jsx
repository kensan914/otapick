import React from "react";

import { BlogListTemplate } from "~/components/templates/BlogListTemplate";
import {
  useListMatchParams,
  useListQueryString,
  usePushHistoryList,
} from "~/hooks/useList";
import { useBlogListInfo } from "~/pages/BlogListPage/useBlogListInfo";

const BlogListPage = () => {
  const { groupId, ct, groupKey } = useListMatchParams();
  const { orderFormat, narrowingKeyword, narrowingPost } = useListQueryString(
    "BLOGS"
  );

  const pushHistoryList = usePushHistoryList();

  const {
    infoTitle,
    infoStatus,
    numOfHit,
    sortButtonTitle,
  } = useBlogListInfo();

  return (
    <BlogListTemplate
      groupId={groupId}
      ct={ct}
      groupKey={groupKey}
      orderFormat={orderFormat}
      narrowingKeyword={narrowingKeyword}
      narrowingPost={narrowingPost}
      pushHistoryList={pushHistoryList}
      infoTitle={infoTitle}
      numOfHit={numOfHit}
      infoStatus={infoStatus}
      sortButtonTitle={sortButtonTitle}
    />
  );
};

export default BlogListPage;
