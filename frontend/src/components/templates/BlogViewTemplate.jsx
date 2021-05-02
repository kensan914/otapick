import React from "react";
import Headline from "../molecules/Headline";
import BlogViewInfo from "../molecules/info/BlogViewInfo";
import BlogView from "../organisms/BlogView";
import { LoaderScreen } from "../molecules/Loader";
import { NotFoundMessage } from "../atoms/NotFound";
import BlogSearchListInfo from "../molecules/info/BlogSearchListInfo";

const BlogViewTemplate = (props) => {
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
          group={groupKey}
          title={blog ? blog.title : ""}
          writer={blog ? blog.writer : {}}
          postDate={blog ? blog.postDate : ""}
          officialUrl={blog ? blog.officialUrl : ""}
          numOfViews={blog ? blog.numOfViews + addedNumOfViewsOnlyBlog : 0}
          numOfDownloads={
            blog ? blog.numOfDownloads + addedNumOfDownloadsOnlyBlog : 0
          }
        />
      ) : (
        <BlogSearchListInfo group={groupKey} title={blog.title} numOfHit={0} />
      )}

      {/* Google AdSense */}
      {/* <div className="container mt-4">
            {isSmp ? <SquareAds /> : <LandscapeAds height="100px" />}
          </div> */}

      {contents}
    </div>
  );
};

export default BlogViewTemplate;
