import React from "react";

import { isSmp, isMobile } from "~/utils";

export const BlogSearchListInfo = (props) => {
  const { groupKey, infoTitle, numOfHit } = props;

  return (
    <div
      className={`card otapick-card2 ${
        isSmp ? "smp mb-3" : isMobile ? "mb-3 mt-1" : "my-4"
      } ${groupKey}`}
    >
      <div className="card-body px-4 px-sm-5 py-4">
        <div className="row mx-2 justify-content-between">
          <h2 className="my-auto d-flex align-items-center">
            {!infoTitle ? "\u00A0" : infoTitle}
          </h2>
        </div>
        <hr className="info-hr" />
        <div className="row justify-content-between">
          <div className="col-12 col-md-6 col-lg-7 col-xl-8">
            <div className="info-description my-1 my-sm-0">
              検索結果（<b>{numOfHit}</b>件）
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
