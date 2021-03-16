import React, { useState } from "react";
import { Link } from "react-router-dom";
import TooltipComponent from "./TooltipComponent";

/** アバター等のアイコンを連続に表示(ex. 推しメン一覧)
 *  要素同士が少し重なり合い, カーソルを合わせると最前面に表示される.
 *  最もdirection("right"|"left")に存在するアイコンがデフォルトで最前面にくる.
 *  item: { url: string, imageUrl: string, alt: string, contentsNode?: Node, backgroundColor?: string }
 */
const AvatarSequence = (props) => {
  const {
    items,
    diameter = 45 /* optional */,
    direction = "left" /* optional */,
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
  const coverPx = diameter * 0.27;
  const isReverse = direction === "right";
  return (
    <div className="d-flex">
      {items.map((item, i) => {
        const _id = `avatar-sequence-item-${i}`;
        return (
          <div
            key={i}
            id={_id}
            className="avatar-sequence-item"
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
            <TooltipComponent title={item.alt}>
              <Link to={item.url}>
                <div
                  className="rounded-circle avatar-sequence-image-wrapper d-flex justify-content-center align-items-center"
                  style={{
                    width: wrapperDiameter,
                    height: wrapperDiameter,
                  }}
                >
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
                      style={{ width: diameter, height: diameter }}
                      src={item.imageUrl}
                      alt={item.alt}
                    />
                  )}
                </div>
              </Link>
            </TooltipComponent>
          </div>
        );
      })}
    </div>
  );
};

export default AvatarSequence;
