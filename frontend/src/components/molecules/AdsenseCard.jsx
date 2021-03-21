import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { isMobile } from "../modules/utils";

const AdSenseCard = (props) => {
  const { url, src, message, width, height } = props;

  const [isLoadImage, setIsLoadImage] = useState(false);
  useEffect(() => {
    const imageObject = new Image();
    imageObject.onload = () => {
      setIsLoadImage(true);
    };
    imageObject.src = src;
  }, []);

  const formatWidth = Number.isFinite(width) && width > 0 ? width : 250;
  const formatHeight = Number.isFinite(height) && height > 0 ? height : 250;
  return (
    <>
      <div className="image-card">
        <a rel="noreferrer" target="_blank" href={url}>
          <div className={"image-card-wrapper " + (!isMobile ? "pc" : "")}>
            {isLoadImage ? (
              <img
                className={"image-card-img"}
                src={src}
                alt="ヲタピック公式Twitter広告"
              />
            ) : (
              <div className="image-card-preload-img-wrapper loading-background">
                <div
                  className={`image-card-preload-img`}
                  style={{
                    paddingTop: `${(formatHeight / formatWidth) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        </a>
      </div>

      {message && (
        <div className="image-card-footer">
          <div className={"image-card-message " + (isMobile ? "mobile" : "")}>
            {message && (
              <a
                rel="noreferrer"
                target="_blank"
                href={url}
                style={{ textDecoration: "none" }}
              >
                <div
                  className={
                    "card-message mx-auto py-2 " + (!isMobile ? "pc" : "")
                  }
                >
                  <FontAwesomeIcon
                    icon={faHashtag}
                    style={{ color: "deepskyblue" }}
                  />
                  {"\u00A0"}
                  <b>{message}</b>
                </div>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdSenseCard;
