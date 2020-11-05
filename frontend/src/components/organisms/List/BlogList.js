import React from "react";
import BlogCard from "../../molecules/BlogCard";
import { URLJoin, getGroup } from "../../modules/utils";
import { withRouter } from "react-router-dom";
import { BASE_URL, ADS_INTERVAL, ADS_INDEX } from "../../modules/env";
import { SquareAds } from "../../atoms/Adsense";
import { useAxios } from "../../modules/axios";
import List, { useList } from "./List";


const BlogList = withRouter((props) => {
  const { groupID, ct, orderFormat, narrowingKeyword, narrowingPost, keepAliveName } = props;

  const [randomSeed, items, setItems, hasMore, setHasMore, status, setStatus, page, incrPage] = useList();

  const urlExcludePage = URLJoin(
    BASE_URL, "blogs/", groupID, ct,
    orderFormat && `?sort=${orderFormat}`,
    narrowingKeyword && `?keyword=${narrowingKeyword}`,
    narrowingPost && `?post=${narrowingPost}`,
    randomSeed && `?random_seed=${randomSeed}`
  );

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

        if (res.data.length < 20) {
          setItems(items.concat(newBlogs));
          setHasMore(false);
          setStatus("success");
        } else {
          setItems(items.concat(newBlogs));
          setStatus("success");
        }
      } else {
        if (page == 1) {
          setHasMore(false);
          setStatus("blog_not_found");
        } else setHasMore(false);
      }
    },
    errorCallback: err => {
      if (err.response.status === 404) {
        setHasMore(false);
        setStatus("blog_not_found");
      }
    },
    finallyCallback: () => {
      incrPage();
    },
    didRequestCallback: r => console.log(r),
    didMountRequest: true,
  });

  return (
    <List keepAliveName={keepAliveName} hasMore={hasMore} status={status} page={page} urlExcludePage={urlExcludePage} isLoading={isLoading} request={request}>
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