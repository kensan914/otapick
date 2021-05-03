import React from "react";
import { Link } from "react-router-dom";
import {
  faDownload,
  faExternalLinkAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { isSmp, isMobile } from "~/utils";
import { GROUPS } from "~/constants/env";
import TooltipComponent from "~/components/atoms/TooltipComponent";

export const BlogViewInfo = (props) => {
  const {
    groupKey,
    infoTitle,
    writer,
    postDate,
    numOfViews,
    numOfDownloads,
    officialUrl,
  } = props;

  let officialLinkTitle;
  Object.values(GROUPS).forEach((groupObj) => {
    if (groupObj.key === groupKey) officialLinkTitle = groupObj.domain;
  });

  return (
    <div
      className={`card otapick-card2 ${
        isSmp ? "smp mb-3" : isMobile ? "mb-3 mt-1" : "my-4"
      } ${groupKey}`}
    >
      <div className="card-body px-4 px-sm-5 py-4">
        {infoTitle.length > 0 ? (
          infoTitle.length > 50 ? (
            <h3 className="smaller">{infoTitle}</h3>
          ) : (
            <h3>{infoTitle}</h3>
          )
        ) : (
          <h3>{"\u00A0"}</h3>
        )}
        <div className="row download-info mt-3">
          {!Object.keys(writer).length ? (
            <Link to="" className={`info-description ml-3 small ${groupKey}`}>
              {"\u00A0"}
            </Link>
          ) : (
            <Link
              to={writer.url["blogs"]}
              className={`info-description ml-3 small ${groupKey}`}
            >
              {!writer.name ? "\u00A0" : writer.name}
            </Link>
          )}
          <p className="info-description ml-3 small mb-0">{postDate}</p>
        </div>
        <hr className="info-hr" />
        <div className="row ml-2 ml-sm-3">
          <div className="row col-12 col-sm-7 col-md-8 col-lg-9 col-xl-10 info-description">
            <div className="d-flex align-items-center">
              <TooltipComponent title="閲覧数">
                <div
                  className="d-flex align-items-center"
                  id="num-of-views-icon"
                >
                  <FontAwesomeIcon icon={faEye} style={{ color: "gray" }} />
                </div>
              </TooltipComponent>
            </div>

            {"\u00A0"}
            <div className="">{numOfViews}</div>

            <div className="d-flex align-items-center">
              <TooltipComponent title="総ダウンロード数">
                <div
                  className="d-flex align-items-center ml-3"
                  id="num-of-downloads-icon"
                >
                  <FontAwesomeIcon
                    icon={faDownload}
                    style={{ color: "gray" }}
                  />
                </div>
              </TooltipComponent>
            </div>

            {"\u00A0"}
            <div className="">{numOfDownloads}</div>
          </div>

          <div className="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-2 info-description px-0 mt-2 mt-sm-0">
            <TooltipComponent title="公式ブログで確認">
              <a
                href={officialUrl}
                className={groupKey}
                target="_blank"
                rel="noreferrer"
                id="officialLink"
              >
                <div className="download-official-a">
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  {"\u00A0"}
                  {officialLinkTitle}
                </div>
              </a>
            </TooltipComponent>
          </div>
        </div>
      </div>
    </div>
  );
};
