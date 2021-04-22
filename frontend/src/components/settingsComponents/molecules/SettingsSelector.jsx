import React, { useState } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DropdownMobileFriendly from "../../molecules/DropdownMobileFriendly";
import { isMobile } from "../../modules/utils";

/**
 * 設定画面の選択コンポーネント. imageUrlが指定されたitemは選択された際, 左にその画像が表示される.
 * keyが指定されていないitemsの場合, headerになる.
 * items: {key?: string, label: string, imageUrl?: string}[]
 * @param {*} props
 * @returns
 */
const SettingsSelector = (props) => {
  const {
    settingsSelectorId,
    items,
    setKey,
    resetKey,
    initKey = "",
    height = 46,
    blankLabel = "選択されていません",
  } = props;

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
    <DropdownMobileFriendly
      id={settingsSelectorId}
      buttonContainerClass="settings-selector-container"
      buttonClass="settings-selector"
      buttonStyle={{
        height: height,
        borderRadius: height * 0.44,
      }}
      dropdownMenuClassOnlyPc={"settings-selector-menu"}
      menuSettings={[
        ...(isMobile
          ? [
              {
                type: "TITLE",
                label: "推しメンを設定する",
              },
            ]
          : []),
        ...items.map((item) => {
          if (typeof item.key !== "undefined") {
            return {
              type: "ONCLICK",
              label: item.label,
              onClick: () => {
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
              },
            };
          } else {
            return { type: "TITLE", label: item.label };
          }
        }),
      ]}
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
          </div>
        )}
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
    </DropdownMobileFriendly>
  );
};

export default SettingsSelector;
