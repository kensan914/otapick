import React from "react";
import { Button } from "reactstrap";

import { BASE_URL, GROUPS } from "../modules/env";
import { URLJoin } from "../modules/utils";
import { downloadImage } from "../organisms/ImageView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const DownloadButton = (props) => {
  const { onClick, groupId, className } = props;

  const onClickDownloadButton = () => {
    downloadImage(URLJoin(BASE_URL, url), csrftoken);
  };

  return (
    <Button
      className={`rounded-circle p-0 ${className ? className : ""}`}
      title="この画像をダウンロードする"
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={faDownload}
        color={GROUPS[groupId]?.deepColor ? GROUPS[groupId].deepColor : "gray"}
        style={{ fontSize: 21 }}
        className="download-button-shadow-svg"
      />
    </Button>

    // <></>
  );
};

export default DownloadButton;
