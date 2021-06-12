import React from "react";

import SortButton from "~/components/atoms/SortButton";
import { isMobile, isSmp } from "~/utils/index";

export const ImageListInfo = (props) => {
  const {
    groupKey,
    hide,
    infoTitle,
    infoStatus,
    numOfHit,
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
              <h2 className="my-auto mx-2 d-flex align-items-center">
                {!infoTitle ? "\u00A0" : infoTitle}
              </h2>
              <hr className="info-hr" />
              <div className="row justify-content-between">
                <div className="col-12 col-md-6 col-lg-7 col-xl-8">
                  <div className="info-description my-1 my-sm-0">
                    検索結果（<b>{numOfHit}</b>件）
                  </div>
                </div>

                {infoStatus === "success" && (
                  <div className="col-12 col-md-6 col-lg-5 col-xl-4 mt-2 mt-md-0">
                    <SortButton
                      className={isSmp ? "mx-auto" : "ml-auto"}
                      type="images"
                      title={sortButtonTitle}
                      pushHistory={pushHistoryList}
                      style={isSmp ? { width: "90%" } : { width: "9rem" }}
                    />
                    {/* )} */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
