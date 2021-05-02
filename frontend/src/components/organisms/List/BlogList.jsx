import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import BlogCard from "../../molecules/BlogCard";
import { URLJoin, getGroup } from "../../modules/utils";
import { BASE_URL, ADS_INTERVAL, ADS_INDEX } from "../../modules/env";
import { SquareAds } from "../../atoms/Adsense";
import { useAxios } from "../../modules/axios";
import List, { useListState } from "./List";
import { getBlogUrlComposition } from "../../templates/BlogListTemplate";
import { useAuthState } from "../../contexts/AuthContext";
import { useProfileState } from "../../contexts/ProfileContext";

const BlogList = withRouter((props) => {
  const [
    items,
    appendItems,
    status,
    setStatus,
    hasMoreRef,
    pageRef,
    randomSeed,
  ] = useListState();
  const [blogUrlComposition] = useState(getBlogUrlComposition(props));

  const profileState = useProfileState();
  const groupsQParams = profileState?.profile?.favGroups
    ? ["?groups=", profileState.profile.favGroups.map((group) => group.groupId)]
    : [];
  const {
    groupID,
    ct,
    orderFormat,
    narrowingKeyword,
    narrowingPost,
  } = blogUrlComposition;
  const urlExcludePage = URLJoin(
    BASE_URL,
    "blogs/",
    groupID,
    ct,
    orderFormat && `?sort=${orderFormat}`,
    narrowingKeyword && `?keyword=${narrowingKeyword}`,
    narrowingPost && `?post=${narrowingPost}`,
    randomSeed && `?random_seed=${randomSeed}`,
    ...(groupsQParams ? groupsQParams : [])
  );

  const { isLoading, request } = useAxios(
    URLJoin(urlExcludePage, `?page=${pageRef.current}`),
    "get",
    {
      thenCallback: (res) => {
        if (res.data.length > 0) {
          const newBlogs = res.data.map((blog) => ({
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
            thumbnailWidth: blog.thumbnail_width,
            thumbnailHeight: blog.thumbnail_height,
          }));

          appendItems(newBlogs);
          setStatus("success");

          if (res.data.length < 20) {
            hasMoreRef.current = false;
          }
        } else {
          hasMoreRef.current = false;
          if (pageRef.current == 1) {
            setStatus("blog_not_found");
          }
        }
      },
      catchCallback: (err) => {
        if (err.response.status === 404) {
          hasMoreRef.current = false;
          setStatus("blog_not_found");
        }
      },
      finallyCallback: () => {
        pageRef.current++;
      },
      didRequestCallback: (r) => {
        // console.log(r);
      },
      shouldRequestDidMount: true,
      // token: authState.token,
    }
  );

  return (
    <List
      hasMore={hasMoreRef.current}
      status={status}
      page={pageRef.current}
      urlExcludePage={urlExcludePage}
      isLoading={isLoading}
      request={request}
    >
      {items.map(
        (
          {
            groupID,
            blogCt,
            title,
            postDate,
            writer,
            numOfViews,
            numOfDownloads,
            thumbnail,
            url,
            officialUrl,
            thumbnailWidth,
            thumbnailHeight,
          },
          i
        ) => (
          <div key={i}>
            <div className="grid-item col-6 col-md-4 col-lg-3 my-2 px-2 px-sm-3 blog-card">
              <BlogCard
                id={i}
                groupID={groupID}
                group={getGroup(groupID)}
                blogCt={blogCt}
                thumbnail={thumbnail}
                title={title}
                writer={writer}
                postDate={postDate}
                numOfViews={numOfViews}
                numOfDownloads={numOfDownloads}
                url={url}
                officialUrl={officialUrl}
                width={thumbnailWidth}
                height={thumbnailHeight}
              />
            </div>
            {/* {i % ADS_INTERVAL === ADS_INDEX && (
              <div className="grid-item col-6 col-md-4 col-lg-3 my-2 px-2 px-sm-3">
                <SquareAds />
              </div>
            )} */}
          </div>
        )
      )}
    </List>
  );
});

export default BlogList;
