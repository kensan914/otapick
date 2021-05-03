import React from "react";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { isMobile } from "~/utils";
import DropdownMobileFriendly from "~/components/molecules/DropdownMobileFriendly";

class SortButton extends React.Component {
  render() {
    return (
      <DropdownMobileFriendly
        id={`sort-button-${this.props.type}`}
        caretOnlyPc
        directionOnlyPc="down"
        buttonClass="blogList-detail-btn sort-button"
        buttonContainerClass={`p-0 ${this.props.className} d-flex justify-content-end`}
        buttonContainerStyle={this.props.style}
        menuSettings={[
          ...(isMobile
            ? [
                {
                  type: "TITLE",
                  label: "並べ替え",
                },
              ]
            : []),
          this.props.type == "images"
            ? {
                type: "LINK",
                search: "?sort=recommend",
                label: "おすすめ順",
              }
            : {},
          {
            type: "LINK",
            search: "?sort=newer_post",
            label: "新着順",
          },
          {
            type: "LINK",
            search: "?sort=older_post",
            label: "古い順",
          },
          {
            type: "LINK",
            search: "?sort=popularity",
            label: "人気順",
          },
          {
            type: "LINK",
            search: "?sort=dl",
            label: "DL順",
          },

          this.props.type == "blogs"
            ? {
                type: "LINK",
                search: "?sort=sum_dl",
                label: "総DL順",
              }
            : {},
          {
            type: "LINK",
            search: "?sort=view",
            label: "閲覧数順",
          },
        ]}
      >
        <FontAwesomeIcon icon={faSort} /> {this.props.title}
      </DropdownMobileFriendly>
    );
  }
}

export default SortButton;
