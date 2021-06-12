import React from "react";

import Headline from "~/components/molecules/Headline";
import { BlogViewInfo } from "~/components/templates/BlogViewTemplate/organisms/BlogViewInfo";
import BlogView from "~/components/organisms/BlogView";
import { LoaderScreen } from "~/components/molecules/Loader";
import { NotFoundMessage } from "~/components/atoms/NotFound";
import { BlogSearchListInfo } from "~/components/templates/BlogSearchListTemplate/organisms/BlogSearchListInfo";

export const BlogViewTemplate = (props) => {
  const {
    mode,
    changeMode,
    groupKey,
    addedNumOfViewsOnlyBlog,
    addedNumOfDownloadsOnlyBlog,
    images,
    blog,
    status,
    requestPutDownloadOnlyMobile,
    incrementNumOfDownloads,
    blogApiUrl,
    blogUrlPath,
  } = props;

  let contents;
  if (status === "") {
    contents = <LoaderScreen type="horizontal" />;
  } else if (status === "success") {
    if (images.length > 0) {
      contents = (
        <BlogView
          group={groupKey}
          images={images}
          blogApiUrl={blogApiUrl}
          incrementNumOfDownloads={(order, num) => {
            incrementNumOfDownloads(order, num);
          }}
          putDownload={(order) => {
            requestPutDownloadOnlyMobile(order);
          }}
          mode={mode}
          blogUrlPath={blogUrlPath}
          officialUrl={blog.officialUrl}
          writer={blog.writer}
          blogCt={blog.blogCt}
          blogTitle={blog.title}
          groupId={blog.groupId}
        />
      );
    } else {
      contents = <NotFoundMessage type="image" margin={true} />;
    }
  } else if (status === "blog_not_found" || status === "get_image_failed") {
    contents = <NotFoundMessage type="blogFailed" margin={true} />;
  }
  return (
    <div className="container mt-3 text-muted">
      <Headline
        title="ブログ詳細"
        type="blogView"
        mode={mode}
        changeMode={(mode) => changeMode(mode)}
      />
      {status !== "blog_not_found" ? (
        <BlogViewInfo
          groupKey={groupKey}
          infoTitle={blog ? blog.title : ""}
          writer={blog ? blog.writer : {}}
          postDate={blog ? blog.postDate : ""}
          officialUrl={blog ? blog.officialUrl : ""}
          numOfViews={blog ? blog.numOfViews + addedNumOfViewsOnlyBlog : 0}
          numOfDownloads={
            blog ? blog.numOfDownloads + addedNumOfDownloadsOnlyBlog : 0
          }
        />
      ) : (
        <BlogSearchListInfo
          groupKey={groupKey}
          infoTitle={blog.title}
          numOfHit={0}
        />
      )}

      {/* Google AdSense */}
      {/* <div className="container mt-4">
            {isSmp ? <SquareAds /> : <LandscapeAds height="100px" />}
          </div> */}

      {contents}
    </div>
  );
};
