import React from "react";
import { Button } from "reactstrap";

import { GROUPS } from "../modules/env";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const DownloadButton = (props) => {
  const { onClick, groupId, className } = props;

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
  );
};

export default DownloadButton;
