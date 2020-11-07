import React from "react";
import { withRouter } from "react-router-dom";
import BlogCard from "../../molecules/BlogCard";
import { URLJoin, getGroup } from "../../modules/utils";
import { BASE_URL, ADS_INTERVAL, ADS_INDEX } from "../../modules/env";
import { SquareAds } from "../../atoms/Adsense";
import { useAxios } from "../../modules/axios";
import List, { useListDidMountRequest, useListState } from "./List";
import { useHistoryDispatch } from "../../contexts/HistoryContext";
import { getBlogUrlComposition } from "../../templates/BlogListTemplate";


const BlogList = withRouter((props) => {
  const [items, hasMore, status, page, urlExcludePage] = useListState(props.location.key,
    (randomSeed) => {
      const { groupID, ct, orderFormat, narrowingKeyword, narrowingPost } = getBlogUrlComposition(props);

      console.log(groupID, ct, orderFormat, narrowingKeyword, narrowingPost);
      return (
        URLJoin(
          BASE_URL, "blogs/", groupID, ct,
          orderFormat && `?sort=${orderFormat}`,
          narrowingKeyword && `?keyword=${narrowingKeyword}`,
          narrowingPost && `?post=${narrowingPost}`,
          randomSeed && `?random_seed=${randomSeed}`,
        ));
    }
  );

  const historyDispatch = useHistoryDispatch();

  const { isLoading, resData, request } = useAxios(
    URLJoin(urlExcludePage, `?page=${page}`),
    "get", {
    thenCallback: res => {
      if (res.data.length > 0) {
        const newBlogs = res.data.map((blog, index) =>
          ({
            groupID: blog.group_id,
            blogCt: blog.blog_ct,
            title: blog.title,
            postDate: blog.post_date,
            writer: blog.writer,
            numOfViews: blog.num_of_views,
            numOfDownloads: blog.num_of_downloads,
            thumbnail: blog.thumbnail,
            url: blog.url,
            officialUrl: blog.official_url,
          })
        );

        historyDispatch({ type: "APPEND_LIST_ITEMS", locationKey: props.location.key, items: newBlogs });
        historyDispatch({ type: "SET_LIST_STATUS", locationKey: props.location.key, status: "success" });

        if (res.data.length < 20) {
          historyDispatch({ type: "SET_LIST_HAS_MORE", locationKey: props.location.key, hasMore: false });
        }
      } else {
        historyDispatch({ type: "SET_LIST_HAS_MORE", locationKey: props.location.key, hasMore: false });
        if (page == 1) {
          historyDispatch({ type: "SET_LIST_STATUS", locationKey: props.location.key, status: "blog_not_found" });
        }
      }
    },
    errorCallback: err => {
      if (err.response.status === 404) {
        historyDispatch({ type: "SET_LIST_HAS_MORE", locationKey: props.location.key, hasMore: false });
        historyDispatch({ type: "SET_LIST_STATUS", locationKey: props.location.key, status: "blog_not_found" });
      }
    },
    finallyCallback: () => {
      historyDispatch({ type: "INCREMENT_LIST_PAGE", locationKey: props.location.key })
    },
    didRequestCallback: r => console.log(r),
  });

  useListDidMountRequest(props.location.key, request, urlExcludePage);

  return (
    <List hasMore={hasMore} status={status} page={page} urlExcludePage={urlExcludePage} isLoading={isLoading} request={request}>
      {items.map(({ groupID, blogCt, title, postDate, writer, numOfViews, numOfDownloads, thumbnail, url, officialUrl }, i) => (
        <div key={i}>
          <div className="grid-item col-6 col-md-4 col-lg-3 my-2 px-2 px-sm-3 blog-card">
            <BlogCard id={i} groupID={groupID} group={getGroup(groupID)} blogCt={blogCt} thumbnail={thumbnail}
              title={title} writer={writer} postDate={postDate} numOfViews={numOfViews} numOfDownloads={numOfDownloads} url={url} officialUrl={officialUrl} />
          </div>
          {(i % ADS_INTERVAL === ADS_INDEX) &&
            <div className="grid-item col-6 col-md-4 col-lg-3 my-2 px-2 px-sm-3">
              <SquareAds />
            </div>
          }
        </div>
      ))}
    </List>
  );
});


export default BlogList;