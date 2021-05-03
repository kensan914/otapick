import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import { MOBILE_TOP_MENU_MT, NAVBAR_BOTTOM_LS_ZINDEX } from "~/constants/env";
import {
  documentScrollHandler,
  isMobile,
  isSmp,
  lockScreen,
  unLockScreen,
} from "~/utils";
import { DROPDOWN_MENU_PORTAL_CONTAINER_ID } from "~/components/atoms/PortalContainer";
import useCacheRoute from "~/components/modules/cacheRoute";

/**
 * mobile or PCを意識せずdropdownを記述.
 * MobileMenuコンポーネントの責務の分散(2つのファイルで同じdropdownのmenuを記述したり)を改善.
 * @param {*} props
 * @returns
 * menuSettings:
 * (
    {type: "TITLE", label: string, isOmit?: boolean} |
    {type: "HR"} |
    {type: "ONCLICK", label: string, onClick: () => void, shouldNotEndAfterClick?: boolean, icon?: IconDefinition, iconCustom?: Node} |
    {type: "ANCHOR", href: string, targetBlank?: boolean, label: string, shouldNotEndAfterClick?: boolean, icon?: IconDefinition, iconCustom?: Node} |
    {type: "LINK", pathname?: string, search?: string, hash?: string, state?: {[key: string]: unknown}, label: string, icon?: IconDefinition, iconCustom?: Node}
    {type: "CUSTOM_ONLY_MOBILE", menuComponent: Node}
 * ) []
 * @example               
 * <DropdownMobileFriendly
    id="..."
    buttonClass="rounded-circle d-flex justify-content-center align-items-center"
    buttonStyle={{
      backgroundColor: "whitesmoke",
    }}
    buttonContainerClass="" // mobileかつbuttonContainerClassが1つ以上指定された場合, button親要素にdiv(buttonContainer)を追加
    buttonContainerStyle={{}} // ↑同様
    dropdownMenuClassOnlyPc=""
    menuSettings={[
      { type: "TITLE", label: "タイトル" },
      { type: "ONCLICK", label: "アラート", onClick: () => {alert("アラート")}, shouldNotEndAfterClick: true, icon: faCaretRight },
      { type: "HR" }, // "TITLE"は自動的にhrが付与されるため、それ以外で明示的に指定したいとき
      {
        type: "ANCHOR",
        href: "https://www.hinatazaka46.com/s/official/diary/member?ima=0000",
        targetBlank: true,
        label: "公式ブログ",
      },
      {
        type: "LINK",
        pathname: "/blogs/",
        search: "?sort=view",
        hash: "#hash",
        state: {},
        label: "ブログ一覧へ",
      },
    ]}
  >
    <FontAwesomeIcon icon={faAngleDown} color="gray" />
  </DropdownMobileFriendly>
 */
const DropdownMobileFriendly = (props, ref) => {
  const {
    id = "",
    children,
    buttonContainerClass = "",
    buttonContainerStyle = {},
    buttonClass = "",
    buttonStyle = {},
    dropdownMenuClassOnlyPc = "",
    caretOnlyPc = false,
    directionOnlyPc = "right",
    directionFixedOnlyPc = false,
    menuSettings = [],
    lockScreenZIndex = NAVBAR_BOTTOM_LS_ZINDEX + 1,
    isLocatedNavbarOnlyMobile = false,
    isSmallerTitle = false,
    onToggleWork = () => {}, // (prevIsOpen: boolean) => void
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const lockScreenId = useRef(`dropdown-mobile-friendly-LS-${id}`);
  const boxId = useRef(`dropdown-mobile-friendly-${id}`);
  const scrollBoxId = useRef(`dropdown-mobile-friendly-${id}`);
  const isMounted = useRef(false);
  const { isCachedRoute } = useCacheRoute();

  useImperativeHandle(ref, () => {
    return {
      endWork: endWork,
    };
  });

  const toggleWork = () => {
    if (isOpen) {
      endWork();
    } else {
      setIsOpen(true);
    }

    onToggleWork(isOpen);
  };

  const documentTouchmoveHandler = (e) => {
    if (!isCachedRoute) {
      // スマホスクロール無効(menuBox以外) https://qiita.com/noraworld/items/2834f2e6f064e6f6d41a
      const menuBox = document.getElementById(boxId.current);
      const scrollMenuBox = document.getElementById(scrollBoxId.current);

      // 既にmenuが閉じている場合
      if (menuBox === null || scrollMenuBox === null) {
        endWork();
        return;
      }

      if (
        e.target.closest(`#${boxId.current}`) === menuBox &&
        // scrollMenuBox !== null &&
        scrollMenuBox.scrollTop !== 0 &&
        scrollMenuBox.scrollTop + scrollMenuBox.clientHeight !==
          scrollMenuBox.scrollHeight
      ) {
        e.stopPropagation();
      } else {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    }
  };

  const documentClickHandler = (e) => {
    if (!isCachedRoute) {
      // 他の箇所クリックしたとき、作業を終了
      if (
        e.target.closest(`#mobilebottommenu-button-${id}`) === null &&
        e.target.closest(`#${boxId.current}`) === null
      ) {
        endWork();
      }
    }
  };

  const lockScreenCustom = () => {
    lockScreen(lockScreenId.current, lockScreenZIndex);
  };

  const endWork = () => {
    setIsOpen(false);
    document.removeEventListener("mousewheel", documentScrollHandler, {
      passive: false,
    });
    document.removeEventListener("touchmove", documentTouchmoveHandler, {
      passive: false,
    });
    document.removeEventListener("mousedown", documentClickHandler, {
      passive: false,
    });
  };

  // useEffectの実行順序厳守(isMounted.current)
  useEffect(() => {
    if (isMounted.current) {
      if (isMobile) {
        // menuがviewされたとき(作業が開始したとき)
        if (isOpen) {
          const scrollMenuBox = document.getElementById(scrollBoxId.current);
          if (scrollMenuBox !== null) {
            document.addEventListener("mousewheel", documentScrollHandler, {
              passive: false,
            });
            document.addEventListener("touchmove", documentTouchmoveHandler, {
              passive: false,
            });
            scrollMenuBox.scrollTop = 1;
            // ↓ https://qiita.com/noraworld/items/2834f2e6f064e6f6d41a
            scrollMenuBox.addEventListener(
              "scroll",
              () => {
                if (scrollMenuBox.scrollTop === 0) {
                  scrollMenuBox.scrollTop = 1;
                } else if (
                  scrollMenuBox.scrollTop + scrollMenuBox.clientHeight ===
                  scrollMenuBox.scrollHeight
                ) {
                  scrollMenuBox.scrollTop = scrollMenuBox.scrollTop - 1;
                }
              },
              {
                passive: false,
              }
            );
          }
          document.addEventListener("mousedown", documentClickHandler),
            {
              passive: false,
            };
          lockScreenCustom();
        }

        // menuのviewが解除されたとき(作業が終了したとき)
        else {
          unLockScreen(lockScreenId.current);
        }
      }
    }
  }, [isOpen]);

  const location = useLocation();
  // useEffectの実行順序厳守(isMounted.current)
  useEffect(() => {
    if (isMounted.current && isMobile && isOpen) {
      endWork();
      unLockScreen(lockScreenId.current);
    }
  }, [location]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      if (isMobile) {
        endWork();
        unLockScreen(lockScreenId.current);
      }
    };
  }, []);

  const generateMenu = () => {
    const titleStyle = {
      position: "sticky",
      top: 0,
      backgroundColor: "white",
    };
    const renderIconDropdownItemChildrenOnlyPc = (_menuSetting) => (
      <div className="d-flex flex-row align-items-center">
        <div
          className={`dropdown-mobile-friendly-icon-container pc rounded-circle d-flex justify-content-center align-items-center ml-1 mr-1`}
        >
          <FontAwesomeIcon icon={_menuSetting.icon} />
        </div>
        {_menuSetting.label}
      </div>
    );
    const geneDropdownItemClassOnlyPc = (_menuSetting) => {
      if (typeof _menuSetting.icon !== "undefined") {
        return "pl-0 pr-3";
      } else {
        return "";
      }
    };

    if (Array.isArray(menuSettings) && menuSettings.length > 0)
      return [
        ...(isMobile && menuSettings[0].type !== "TITLE"
          ? [
              <div key={"empty-title"} style={titleStyle}>
                <div className="py-1" />
                <MobileMenuTitle
                  label={"empty"}
                  style={{ visibility: "hidden" }}
                />
                <MobileMenuHr />
              </div>,
            ]
          : []),
        ...menuSettings.map((menuSetting, i) => {
          if (typeof menuSetting.type === "undefined") return;
          switch (menuSetting.type) {
            case "ONCLICK": {
              if (isMobile) {
                return (
                  <MobileMenuLink
                    key={i}
                    icon={menuSetting.icon}
                    iconCustom={menuSetting.iconCustom}
                    onClick={() => {
                      menuSetting.onClick();
                      if (!menuSetting.shouldNotEndAfterClick) endWork();
                    }}
                    label={menuSetting.label}
                  />
                );
              } else {
                return (
                  <DropdownItem
                    key={i}
                    onClick={menuSetting.onClick}
                    className={geneDropdownItemClassOnlyPc(menuSetting)}
                  >
                    {typeof menuSetting.icon !== "undefined"
                      ? renderIconDropdownItemChildrenOnlyPc(menuSetting)
                      : menuSetting.label}
                  </DropdownItem>
                );
              }
            }
            case "TITLE": {
              if (isMobile) {
                return (
                  <div key={i} style={titleStyle}>
                    {/* 先頭以外は上部にdivider付与・先頭の場合、スタイルを合わせるために空divを挿入 */}
                    {i !== 0 ? <MobileMenuHr /> : <div className="py-1" />}

                    <MobileMenuTitle
                      label={menuSetting.label}
                      omit={
                        typeof menuSetting.isOmit === "undefined"
                          ? true
                          : menuSetting.isOmit
                      }
                    />
                    {/* 最後以外は下部にdivider付与 && isSmallerTitleが指定された場合表示しない */}
                    {i !== menuSettings.length && !isSmallerTitle && (
                      <MobileMenuHr />
                    )}
                  </div>
                );
              } else {
                return (
                  <React.Fragment key={i}>
                    {i !== 0 && <DropdownItem divider />}
                    <DropdownItem
                      style={{ maxWidth: "15rem" }}
                      header
                      className="omit-title"
                    >
                      {menuSetting.label}
                    </DropdownItem>
                    {i !== menuSettings.length && !isSmallerTitle && (
                      <DropdownItem divider />
                    )}
                  </React.Fragment>
                );
              }
            }
            case "HR": {
              if (isMobile) {
                return <MobileMenuHr key={i} />;
              } else {
                return <DropdownItem key={i} divider />;
              }
            }
            case "ANCHOR": {
              if (isMobile) {
                return (
                  <MobileMenuLink
                    key={i}
                    icon={menuSetting.icon}
                    iconCustom={menuSetting.iconCustom}
                    href={menuSetting.href}
                    target={menuSetting.targetBlank ? "_blank" : ""}
                    label={menuSetting.label}
                    onClick={() => {
                      if (!menuSetting.shouldNotEndAfterClick) endWork();
                    }}
                  />
                );
              } else {
                return (
                  <DropdownItem
                    key={i}
                    href={menuSetting.href}
                    target={menuSetting.targetBlank ? "_blank" : ""}
                    className={geneDropdownItemClassOnlyPc(menuSetting)}
                  >
                    {typeof menuSetting.icon !== "undefined"
                      ? renderIconDropdownItemChildrenOnlyPc(menuSetting)
                      : menuSetting.label}
                  </DropdownItem>
                );
              }
            }
            case "LINK": {
              const _to = {
                pathname:
                  typeof menuSetting.pathname !== "undefined"
                    ? menuSetting.pathname
                    : "",
                search:
                  typeof menuSetting.search !== "undefined"
                    ? menuSetting.search
                    : "",
                hash:
                  typeof menuSetting.hash !== "undefined"
                    ? menuSetting.hash
                    : "",
                state:
                  typeof menuSetting.state !== "undefined"
                    ? menuSetting.state
                    : {},
              };
              if (isMobile) {
                return (
                  <MobileMenuLink
                    key={i}
                    icon={menuSetting.icon}
                    iconCustom={menuSetting.iconCustom}
                    to={_to}
                    label={menuSetting.label}
                    onClick={() => {
                      // LINKによる画面遷移時には必ずendWork()しなければならないため、shouldNotEndAfterClickにようるオプションはしない
                      endWork();
                    }}
                  />
                );
              } else {
                return (
                  <DropdownItem
                    key={i}
                    tag={Link}
                    to={_to}
                    className={geneDropdownItemClassOnlyPc(menuSetting)}
                  >
                    {typeof menuSetting.icon !== "undefined"
                      ? renderIconDropdownItemChildrenOnlyPc(menuSetting)
                      : menuSetting.label}
                  </DropdownItem>
                );
              }
            }
            case "CUSTOM_ONLY_MOBILE": {
              if (isMobile) {
                return (
                  <React.Fragment key={i}>
                    {menuSetting.menuComponent}
                  </React.Fragment>
                );
              } else {
                return;
              }
            }
            default:
              console.error(
                `The menuSetting.type "${menuSetting.type}" is not supported.`
              );
              return;
          }
        }),
      ];
    else return;
  };

  if (isMobile) {
    const dropdownToggleMobile = (
      <Button
        id={`mobilebottommenu-button-${id}`}
        className={buttonClass}
        style={buttonStyle ? buttonStyle : {}}
        color="light"
        onClick={(e) => {
          e.stopPropagation(); // onClickが指定されたコンポーネント内に属するButtonDropdown用(ex. WriterCard)
          toggleWork();
        }}
      >
        {children}
      </Button>
    );
    return (
      <>
        {buttonContainerClass.length > 0 ||
        Object.keys(buttonContainerStyle).length > 0 ? (
          /* ButtonDropdownコンポーネントにあたる */
          <div className={buttonContainerClass} style={buttonContainerStyle}>
            {dropdownToggleMobile}
          </div>
        ) : (
          dropdownToggleMobile
        )}

        {isOpen && (
          <DropdownMenuPortalOnlyMobile
            scrollBoxId={scrollBoxId}
            generateMenu={generateMenu}
            id={id}
            toggleWork={toggleWork}
            isLocatedNavbarOnlyMobile={isLocatedNavbarOnlyMobile}
          />
        )}
      </>
    );
  } else {
    return (
      <ButtonDropdown
        direction={directionOnlyPc}
        positionFixed={directionFixedOnlyPc}
        className={buttonContainerClass}
        style={buttonContainerStyle}
        isOpen={isOpen}
        toggle={toggleWork}
        onClick={(e) => {
          e.stopPropagation(); // onClickが指定されたコンポーネント内に属するButtonDropdown用(ex. WriterCard)
        }}
      >
        <DropdownToggle
          caret={caretOnlyPc}
          color="light"
          className={buttonClass}
          style={buttonStyle ? buttonStyle : {}}
        >
          {children}
        </DropdownToggle>
        <DropdownMenu
          className={`bold dropdown-mobile-friendly-menu-pc ${dropdownMenuClassOnlyPc}`}
          // style={{}} // styleをいじるとDropdownMenuの動的位置決定がされなくなるためstyleの指定禁止
        >
          {generateMenu()}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
};

export default React.forwardRef(DropdownMobileFriendly);

/**
 * dropdown menuをdropdown toggleと同じ階層にレンダリングするとz-index設定で困難を極める。
 * そのため、dropdown menuのみをrootのportal containerにレンダリングする。(atoms/PortalContainer.jsx)
 * @param {*} props
 * @returns
 */
const DropdownMenuPortalOnlyMobile = (props) => {
  const {
    scrollBoxId,
    generateMenu,
    id,
    toggleWork,
    isLocatedNavbarOnlyMobile,
  } = props;

  return ReactDOM.createPortal(
    <div
      className={`mobile mobile-menu ${
        isLocatedNavbarOnlyMobile
          ? "mobile-top-menu right"
          : "mobile-bottom-menu"
      }`}
      style={
        isLocatedNavbarOnlyMobile
          ? { position: "fixed", top: MOBILE_TOP_MENU_MT, zIndex: 1000 }
          : {}
      }
      id={
        isLocatedNavbarOnlyMobile
          ? "mobile-top-menu"
          : `mobile-bottom-menu-${id}`
      }
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        className="rounded-circle transparent-button-mobile float-right mr-2 dropdown-cancel-button"
        onClick={toggleWork}
        style={{ marginTop: 7 /* titleとの高さを合わせている */ }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </Button>
      <div
        className={`container text-muted border search-suggestions-box ${
          isMobile ? "mobile" : ""
        } ${isSmp ? "px-2" : ""}`}
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative", // potion: stickyの起点
          ...(!isLocatedNavbarOnlyMobile ? { maxHeight: "60vh" } : {}), // bottom menuのみ. screen heightの60%
        }}
        id={scrollBoxId.current}
      >
        <div
          className={`text-left ${isSmp ? "mb-2" : "mb-4"} ${
            !isLocatedNavbarOnlyMobile
              ? "dropdown-menu-container-safe-aria"
              : ""
          }`}
        >
          {generateMenu()}
        </div>
      </div>
    </div>,
    document.getElementById(DROPDOWN_MENU_PORTAL_CONTAINER_ID)
  );
};

const MobileMenuLink = (props) => {
  const { to, href, label, icon, iconCustom, target, onClick } = props;

  const geneATag = (children) =>
    href ? (
      <a href={href} target={target} onClick={(e) => onClick && onClick(e)}>
        {children}
      </a>
    ) : (
      <a target={target} onClick={(e) => onClick && onClick(e)}>
        {children}
      </a>
    );

  const iconComponent = (
    <div className="dropdown-mobile-friendly-icon-container rounded-circle d-flex justify-content-center align-items-center ml-1 mr-3">
      {icon ? (
        <FontAwesomeIcon style={{ fontSize: 14 }} icon={icon} />
      ) : (
        iconCustom && iconCustom
      )}
    </div>
  );

  const contents = (
    <div className="px-3 my-0">
      <div
        className={`${
          icon || iconCustom ? "d-flex row" : ""
        } align-items-center`}
      >
        {(icon || iconCustom) && iconComponent}
        <b>{label}</b>
      </div>
    </div>
  );

  return (
    <div className={`mobile-menu-a ${icon || iconCustom ? "py-1" : "py-2"}`}>
      {to ? (
        <Link to={to} onClick={(e) => onClick && onClick(e)}>
          {contents}
        </Link>
      ) : (
        geneATag(contents)
      )}
    </div>
  );
};

const MobileMenuTitle = (props) => {
  const { label, omit, style = {} } = props;
  // omit指定で3点リーダーで省略可能
  return (
    <h5
      className={`mobile-menu-title py-2 my-0 ${omit ? "omit-title" : ""}`}
      style={style}
    >
      {label}
    </h5>
  );
};

const MobileMenuHr = () => <hr className="mb-2 mt-2" />;
