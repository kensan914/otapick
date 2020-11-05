import React, { useRef, useState } from "react";
import BlogCard from "../../molecules/BlogCard";
import { URLJoin, getGroup, generateWavesVals, isMobile } from "../../modules/utils";
import { BASE_URL, ADS_INTERVAL, ADS_INDEX } from "../../modules/env";
import ImageCard from "../../molecules/ImageCard";
import MemberCard from "../../molecules/MemberCard";
import { SquareAds } from "../../atoms/Adsense";
import AdsenseCard from "../../molecules/AdsenseCard";
import { useAxios } from "../../modules/axios";
import List, { useList } from "./List";
import { ImageListModel } from "./ImageList";


const HomeList = (props) => {
  const { keepAliveName } = props;

  const [randomSeed] = useList();
  const [additionalItems, setAdditionalItems] = useState([]);
  const additionalItemsStartPage = useRef(0);
  const [wavesVals] = useState(generateWavesVals());

  const imageListModeRef = useRef(null);

  useAxios(
    URLJoin(BASE_URL, "home/additional/", `?random_seed=${randomSeed}`),
    "get", {
    thenCallback: res => {
      if (res.data.length > 0) {
        let _additionalItems = [];
        for (const item of res.data) {
          if (item === null) {
            _additionalItems.push(null);
          } else if (item.type === "image") {
            _additionalItems.push({
              groupID: item.blog.group_id,
              blogCt: item.blog.blog_ct,
              blogTitle: item.blog.title,
              src: item.image.src,
              url: item.image.url,
              blogUrl: item.blog.url,
              officialUrl: item.blog.official_url,
              writer: item.blog.writer,
              type: "image",
              message: item.message,
            });
          } else if (item.type === "blog") {
            _additionalItems.push({
              groupID: item.blog.group_id,
              blogCt: item.blog.blog_ct,
              title: item.blog.title,
              postDate: item.blog.post_date,
              writer: item.blog.writer,
              numOfViews: item.blog.num_of_views,
              numOfDownloads: item.blog.num_of_downloads,
              thumbnail: item.blog.thumbnail,
              url: item.blog.url,
              officialUrl: item.blog.official_url,
              type: "blog",
              message: item.message,
            });
          } else if (item.type === "member") {
            _additionalItems.push({
              image: item.member.image,
              url: item.member.url,
              officialUrl: item.member.official_url,
              ct: item.member.ct,
              lastKanji: item.member.last_kanji,
              firstKanji: item.member.first_kanji,
              lastKana: item.member.last_kana,
              firstKana: item.member.first_kana,
              belongingGroup: getGroup(item.member.belonging_group),
              type: "member",
              message: item.message,
            });
          } else if (item.type === "twitter") {
            _additionalItems.push({
              type: "twitter",
              message: item.message,
              src: item.src,
              url: item.url,
            });
          }
        }

        setAdditionalItems(_additionalItems);
        additionalItemsStartPage.current = imageListModeRef.current ? imageListModeRef.current.getCurrentPage() : 1;
      }
    },
    didMountRequest: true,
  });

  return (
    <ImageListModel {...props} type="HOME" ref={imageListModeRef} render={(hasMore, status, page, urlExcludePage, isLoading, request, items) => {
      let additionalItemsIndex = 0;
      return (
        <List keepAliveName={keepAliveName} hasMore={hasMore} status={status} page={page} urlExcludePage={urlExcludePage} isLoading={isLoading} request={request}>
          {items.map(({ groupID, blogCt, blogTitle, src, url, blogUrl, officialUrl, writer }, i) => {
            let additionalItem;
            if (
              (i % 10 === 0) &&  // item10コごとに表示
              additionalItems.length > additionalItemsIndex &&
              (Math.floor(i / 20) >= additionalItemsStartPage.current)  // additionalItemsがloadされた以降に表示されるように
            ) {
              const add = additionalItems[additionalItemsIndex];
              if (add === null) {
                additionalItem = null;
              } else if (add.type === "image") {
                additionalItem =
                  <ImageCard id={`additional_${additionalItemsIndex}`} groupID={add.groupID} group={getGroup(add.groupID)} blogCt={add.blogCt} blogTitle={add.blogTitle}
                    src={add.src} url={add.url} blogUrl={add.blogUrl} officialUrl={add.officialUrl} writer={add.writer} message={add.message} />
              } else if (add.type === "blog") {
                additionalItem =
                  <BlogCard id={`additional_${additionalItemsIndex}`} groupID={add.groupID} group={getGroup(add.groupID)} blogCt={add.blogCt} thumbnail={add.thumbnail} title={add.title}
                    writer={add.writer} postDate={add.postDate} numOfViews={add.numOfViews} numOfDownloads={add.numOfDownloads} url={add.url} officialUrl={add.officialUrl} message={add.message} />
              } else if (add.type === "member") {
                additionalItem =
                  <MemberCard id={`additional_${additionalItemsIndex}`} ct={add.ct} image={add.image} url={add.url} officialUrl={add.officialUrl} lastKanji={add.lastKanji} firstKanji={add.firstKanji} lastKana={add.lastKana}
                    firstKana={add.firstKana} belongingGroup={add.belongingGroup} wavesVals={wavesVals} message={add.message} />
              } else if (add.type === "twitter") {
                additionalItem =
                  <AdsenseCard url={add.url} src={add.src} message={add.message} />;
              }
              additionalItemsIndex++;
            }

            const gridItemClassName = "grid-item col-6 col-md-4 col-lg-3 px-1 px-sm-2 " + (isMobile ? "my-1 " : "my-3 ");
            return (
              <div key={i}>
                <div className={gridItemClassName}>
                  <ImageCard id={i} groupID={groupID} group={getGroup(groupID)} blogCt={blogCt} blogTitle={blogTitle}
                    src={src} url={url} blogUrl={blogUrl} officialUrl={officialUrl} writer={writer} />
                </div >
                {/* additionalItem */}
                {additionalItem &&
                  <div className={gridItemClassName}>
                    {additionalItem}
                  </div>
                }
                {/* Google Adsense */}
                {(i % ADS_INTERVAL === ADS_INDEX) &&
                  <div className={gridItemClassName + (isMobile ? "mb-4" : "")} >
                    <SquareAds />
                  </div>
                }
              </div>
            );
          })}
        </List >
      );
    }} />
  );
}


export default HomeList;