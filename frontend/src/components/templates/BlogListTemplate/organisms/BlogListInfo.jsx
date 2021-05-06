import React from "react";

import NarrowButton from "~/components/atoms/NarrowButton";
import SortButton from "~/components/atoms/SortButton";
import NarrowCard from "~/components/molecules/NarrowCard";
import { isSmp, isMobile } from "~/utils";

export const BlogListInfo = (props) => {
  const {
    groupKey,
    hide,
    infoTitle,
    narrowingKeyword,
    narrowingPost,
    numOfHit,
    infoStatus,
    sortButtonTitle,
    pushHistoryList,
  } = props;

  return (
    <>
      {!hide && (
        <div>
          <div
            className={`card otapick-card2 ${
              isSmp ? "smp mb-3" : isMobile ? "mb-3 mt-1" : "my-4"
            } ${groupKey}`}
          >
            <div className="card-body px-4 px-sm-5 py-4">
              <div className="row mx-2 justify-content-between">
                <h2
                  className="my-auto d-flex align-items-center"
                  id="blog-list-info-title"
                >
                  {!infoTitle ? "\u00A0" : infoTitle}
                </h2>
                <div className="row ml-2">
                  {narrowingKeyword && (
                    <span
                      className={`badge mr-2 badge-pill d-flex align-items-center ${groupKey}`}
                    >
                      {`"${narrowingKeyword}"`}
                    </span>
                  )}
                  {narrowingPost && (
                    <span
                      className={`badge mr-2 badge-pill d-flex align-items-center ${groupKey}`}
                    >
                      {narrowingPost}
                    </span>
                  )}
                </div>
              </div>
              <hr className="info-hr" />
              <div className="row justify-content-between">
                <div className="col-12 col-md-6 col-lg-7 col-xl-8">
                  <div className="info-description my-1 my-sm-0">
                    検索結果（<b>{numOfHit}</b>件）
                  </div>
                </div>

                {infoStatus === "success" && (
                  <div className="col-12 col-md-6 col-lg-5 col-xl-4 mt-2 mt-md-0">
                    <div className="row justify-content-around">
                      <NarrowButton />

                      <SortButton
                        className="col-5"
                        type="blogs"
                        title={sortButtonTitle}
                        pushHistory={pushHistoryList}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {infoStatus === "success" && (
            <NarrowCard group={groupKey} pushHistory={pushHistoryList} />
          )}
        </div>
      )}
    </>
  );
};
