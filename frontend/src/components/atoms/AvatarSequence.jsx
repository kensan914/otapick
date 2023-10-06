import React, { useState } from "react";
import { Link } from "react-router-dom";

import { isMobile } from "~/utils";
import TooltipComponent from "~/components/atoms/TooltipComponent";

/** アバター等のアイコンを連続に表示(ex. 推しメン一覧)
 *  要素同士が少し重なり合い, カーソルを合わせると最前面に表示される.
 *  最もdirection("right"|"left")に存在するアイコンがデフォルトで最前面にくる.
 *  item: { url: string, imageUrl: string, alt: string, contentsNode?: Node, backgroundColor?: string }
 */
const AvatarSequence = (props) => {
  const {
    items = [],
    diameter = 45 /* optional */,
    direction = "left" /* optional */,
    isOverlap = true /* optional */,
    hasBorder = false /* optional */,
  } = props;

  const [listHover, setListHover] = useState(Array(items.length).fill(false));
  const setIsHover = (index, val) => {
    const _listHover = [...listHover];
    // trueをsetする時, 他itemsにfalseをsetする
    if (val) {
      _listHover.fill(false);
    }
    _listHover[index] = val;
    setListHover(_listHover);
  };

  const wrapperDiameter = diameter * 1.14;
  const coverPx = isOverlap ? diameter * 0.27 : 0;
  const isReverse = direction === "right";
  return (
    <div
      className={`d-flex align-items-center avatar-sequence-container ${
        hasBorder ? "border-top border-light rounded-pill p-1 shadow-sm" : ""
      }`}
    >
      {items.map((item, i) => {
        const _id = `avatar-sequence-item-${i}`;
        return (
          <div
            key={i}
            id={_id}
            className="avatar-sequence-item d-flex justify-content-center"
            style={{
              position: "relative",
              // hover時は最大値のitems.length
              zIndex: listHover[i] ? items.length : items.length - i,
              ...(isReverse
                ? {
                    order: -i,
                    left: coverPx * i,
                  }
                : {
                    right: coverPx * i,
                  }),
            }}
            onMouseEnter={() => {
              setIsHover(i, true);
            }}
            onMouseLeave={() => {
              setIsHover(i, false);
            }}
          >
            {(() => {
              const body = (
                <Link to={item.url}>
                  <div
                    className="rounded-circle avatar-sequence-image-wrapper d-flex justify-content-center align-items-center"
                    style={{
                      width: wrapperDiameter,
                      height: wrapperDiameter,
                    }}
                  >
                    <div
                      className="rounded-circle avatar-sequence-image-hover-wrapper"
                      style={{
                        width: diameter,
                        height: diameter,
                        ...(listHover[i] ? { opacity: 0.2 } : { opacity: 0 }),
                      }}
                    />
                    {item.contentsNode ? (
                      <div
                        className="rounded-circle avatar-sequence-image d-flex justify-content-center align-items-center"
                        style={{
                          width: diameter,
                          height: diameter,
                          backgroundColor: item.backgroundColor
                            ? item.backgroundColor
                            : "white",
                        }}
                      >
                        {item.contentsNode}
                      </div>
                    ) : (
                      <img
                        className="rounded-circle avatar-sequence-image"
                        width={diameter}
                        height={diameter}
                        style={{ width: diameter, height: diameter }}
                        src={item.imageUrl}
                        alt={item.alt}
                      />
                    )}
                  </div>
                </Link>
              );
              if (isMobile) {
                return body;
              } else {
                return (
                  <TooltipComponent title={item.alt}>{body}</TooltipComponent>
                );
              }
            })()}
          </div>
        );
      })}
    </div>
  );
};

export default AvatarSequence;
