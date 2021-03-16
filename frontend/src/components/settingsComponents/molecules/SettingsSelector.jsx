import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * 設定画面の選択コンポーネント. imageUrlが指定されたitemは選択された際, 左にその画像が表示される.
 * keyが指定されていないitemsの場合, headerになる.
 * items: {key?: string, label: string, imageUrl?: string}[]
 * @param {*} props
 * @returns
 */
const SettingsSelector = (props) => {
  const {
    items,
    setKey,
    resetKey,
    initKey = "",
    height = 46,
    blankLabel = "選択されていません",
  } = props;
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!isOpen);

  const [, setSelectedKey] = useState(initKey);
  const [initItem] = useState(
    initKey ? items.find((elm) => elm.key === initKey) : void 0
  );
  const [selectedLabel, setSelectedLabel] = useState(
    initItem ? initItem.label : ""
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    initItem ? initItem.imageUrl : ""
  );

  const imageDiameter = height * 0.8;
  return (
    <ButtonDropdown
      className="settings-selector-container"
      direction="right"
      isOpen={isOpen}
      toggle={toggle}
    >
      <DropdownToggle
        className={"settings-selector"}
        style={{ height: height, borderRadius: height * 0.44 }}
      >
        <div className="row align-items-center px-2 pr-4">
          {selectedLabel ? (
            <>
              {selectedImageUrl && (
                <img
                  className="settings-selector-image"
                  width={imageDiameter}
                  height={imageDiameter}
                  src={selectedImageUrl}
                  alt={`${selectedLabel}のプロフィール画像`}
                  style={{
                    width: imageDiameter,
                    height: imageDiameter,
                    borderRadius: imageDiameter * 0.44,
                  }}
                />
              )}
              <div className="settings-selector-title">
                <b>{selectedLabel}</b>
              </div>
            </>
          ) : (
            <div className="bold settings-selector-title">
              {`- ${blankLabel} -`}
              {/* <div className="settings-selector-empty-title" /> */}
            </div>
          )}
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </DropdownToggle>

      <DropdownMenu
        className={
          "bold settings-selector-menu" +
          (typeof props.members != "undefined" ? "-members" : "")
        }
      >
        {items.map((item, i) => {
          if (typeof item.key !== "undefined") {
            return (
              <DropdownItem
                key={i}
                onClick={() => {
                  setKey && setKey(item.key);
                  if (resetKey !== item.key) {
                    setSelectedKey(item.key);
                    setSelectedLabel(item.label);
                    setSelectedImageUrl(item.imageUrl);
                  } else {
                    setSelectedKey("");
                    setSelectedLabel("");
                    setSelectedImageUrl("");
                  }
                }}
              >
                {item.label}
              </DropdownItem>
            );
          } else {
            return (
              <React.Fragment key={i}>
                {/* 先頭以外は上部にdivider付与 */}
                {i !== 0 && <DropdownItem divider />}

                <DropdownItem header>
                  <div className="m-0">{item.label}</div>
                </DropdownItem>

                {/* 最後以外は下部にdivider付与 */}
                {i !== items.length && <DropdownItem divider />}
              </React.Fragment>
            );
          }
        })}
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default SettingsSelector;
