import React from "react";

import { BlogSearchListInfo } from "~/components/templates/BlogSearchListTemplate/organisms/BlogSearchListInfo";
import Headline from "~/components/molecules/Headline";
import { getGroup } from "~/utils";
import { OrderlyBlogCard } from "~/components/molecules/BlogCard";
import MemberCard from "~/components/molecules/MemberCard";
import { NotFoundMessage } from "~/components/atoms/NotFound";
import { LoaderScreen } from "~/components/molecules/Loader";
import { useLocation } from "react-router-dom";

export const BlogSearchListTemplate = (props) => {
  const {
    groupId,
    groupKey,
    title,
    numOfHit,
    blogs,
    members,
    searchStatus,
    searchType,
    wavesVals,
    isLoadingRequestGetSearch,
  } = props;

  let itemsComponent;
  if (blogs.length > 0) {
    itemsComponent = blogs.map(
      (
        {
          blogCt,
          title,
          postDate,
          writer,
          numOfViews,
          numOfDownloads,
          thumbnail,
          url,
          officialUrl,
        },
        i
      ) => (
        <OrderlyBlogCard
          key={i}
          id={i}
          groupID={groupId}
          group={groupKey}
          blogCt={blogCt}
          thumbnail={thumbnail}
          title={title}
          writer={writer}
          postDate={postDate}
          numOfViews={numOfViews}
          numOfDownloads={numOfDownloads}
          url={url}
          officialUrl={officialUrl}
        />
      )
    );
  } else if (members.length > 0) {
    itemsComponent = members.map(
      (
        {
          image,
          url,
          officialUrl,
          ct,
          lastKanji,
          firstKanji,
          lastKana,
          firstKana,
          belongingGroup,
        },
        i
      ) => (
        <div key={i} className="col-6 col-md-4 col-xl-3 my-2 px-1 px-sm-3">
          <MemberCard
            ct={ct}
            image={image}
            url={url}
            officialUrl={officialUrl}
            lastKanji={lastKanji}
            firstKanji={firstKanji}
            lastKana={lastKana}
            firstKana={firstKana}
            belongingGroup={getGroup(belongingGroup)}
            wavesVals={wavesVals}
          />
        </div>
      )
    );
  } else itemsComponent = null;

  let contents;

  if (isLoadingRequestGetSearch) {
    contents = <LoaderScreen type="horizontal" />;
  } else if (itemsComponent !== null && searchStatus === "success") {
    contents = (
      <div className="container">
        <div className="row mb-5" style={{ marginTop: "2rem" }}>
          {itemsComponent}
        </div>
      </div>
    );
  } else if (searchType === "url") {
    contents = (
      <div className="pb-5">
        <NotFoundMessage type="blog" />
      </div>
    );
  } else if (searchType === "member") {
    contents = (
      <div className="pb-5">
        <NotFoundMessage type="member" />
      </div>
    );
  } else {
    contents = <LoaderScreen type="horizontal" />;
  }

  const location = useLocation();
  return (
    <div className="container mt-3 text-muted">
      <Headline title="検索" key={location.key} />
      <BlogSearchListInfo
        groupKey={groupKey}
        infoTitle={title}
        numOfHit={numOfHit}
      />
      {contents}
    </div>
  );
};
