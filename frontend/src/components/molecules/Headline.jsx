import React, { useState } from "react";
import BackButton from "../atoms/BackButton";
import {
  Button,
  ButtonGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  URLJoin,
  isMobile,
  checkNotCached,
  sortGROUPSByFav,
} from "../modules/utils";
import { BASE_URL, GROUPS } from "../modules/env";
import { Link } from "react-router-dom";
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT } from "../modules/env";
import { MobileTopMenu } from "./MobileMenu";
import { DomDispatchContext } from "../contexts/DomContext";
import LinkButton from "../atoms/LinkButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faExchangeAlt,
  faImages,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import TooltipComponent from "../atoms/TooltipComponent";
import {
  ProfileStateContext,
  useProfileState,
} from "../contexts/ProfileContext";

const ModeSelectButtonDropdown = (props) => {
  const { members, type, groupKey } = props;

  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);

  const profileState = useProfileState();
  let contents = [];
  if (typeof members !== "undefined") {
    // 推しメン
    if (
      (groupKey === "sakura" && profileState.profile.favMemberSakura) ||
      (groupKey === "hinata" && profileState.profile.favMemberHinata)
    ) {
      const renderDropdownItem = (propertyName) => {
        if (profileState.profile[propertyName]) {
          return (
            <DropdownItem
              tag={Link}
              to={`/${type}/${
                GROUPS[profileState.profile[propertyName].belongingGroup].id
              }/${profileState.profile[propertyName].ct}/`}
            >
              {profileState.profile[propertyName].fullKanji}
            </DropdownItem>
          );
        } else {
          return null;
        }
      };
      contents.push(
        <>
          <DropdownItem header>
            <div className="m-0">推しメン</div>
          </DropdownItem>
          <DropdownItem divider />
          {groupKey === "sakura" && renderDropdownItem("favMemberSakura")}
          {groupKey === "hinata" && renderDropdownItem("favMemberHinata")}
          <DropdownItem divider />
        </>
      );
    }

    for (const [index, membersDividedByGeneration] of members.entries()) {
      contents.push(
        <div key={"dropdown-menu-contents-m-" + index}>
          <DropdownItem header>
            <div className="m-0">{`${index + 1}期生`}</div>
          </DropdownItem>
          <DropdownItem divider />
          {membersDividedByGeneration.map(({ url, full_kanji }, j) => (
            <DropdownItem key={j} tag={Link} to={url[type]}>
              {full_kanji}
            </DropdownItem>
          ))}
          {index != members.length - 1 && <DropdownItem divider />}
        </div>
      );
    }
  } else {
    contents.push(
      <div key={"dropdown-menu-contents-g"}>
        <DropdownItem header>グループ選択</DropdownItem>
        <DropdownItem divider />
        {sortGROUPSByFav(profileState.profile.favGroups).map((groupObj) => (
          <DropdownItem
            key={groupObj.id}
            tag={Link}
            to={`/${type}/${groupObj.id}/`}
          >{`${groupObj.name}`}</DropdownItem>
        ))}
      </div>
    );
  }

  return (
    <ButtonDropdown
      direction="right"
      isOpen={dropdownOpen}
      toggle={toggle}
      onClick={(e) => e.stopPropagation()}
      className={
        "mode-select-dropdown-button-super " + (props.fixed ? "fixed" : "")
      }
    >
      <DropdownToggle
        className={
          "rounded-circle mode-select-dropdown-button " +
          (props.fixed ? "fixed p-0 " : " ") +
          props.group
        }
      >
        <FontAwesomeIcon icon={faAngleDown} />
      </DropdownToggle>
      <DropdownMenu
        className={
          "bold mode-select-dropdown-menu" +
          (typeof props.members != "undefined" ? "-members" : "")
        }
      >
        {contents}
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export class TypeChangeButton extends React.Component {
  getChangeTypeUrl(currentType, groupID, ct) {
    // let url;
    if (currentType === "blogs") {
      return URLJoin("/images/", groupID, ct);
    } else if (currentType === "images") {
      return URLJoin("/blogs/", groupID, ct);
    }
    // this.props.history.push(url);
  }

  render() {
    const tooltipTitle =
      this.props.type === "blogs"
        ? "画像一覧に切り替えます"
        : "ブログ一覧に切り替えます";
    const exchangeIcon =
      this.props.type === "blogs" ? (
        <FontAwesomeIcon icon={faImages} />
      ) : (
        <FontAwesomeIcon icon={faNewspaper} />
      );

    return (
      <TooltipComponent title={tooltipTitle} placement="bottom">
        <LinkButton
          to={this.getChangeTypeUrl(
            this.props.type,
            this.props.groupID,
            this.props.ct
          )}
          className="rounded-pill type-change-button ml-1"
          id={this.props.id}
        >
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ color: "gray", fontSize: 20 }}
          >
            <FontAwesomeIcon
              className="mr-1 my-0"
              icon={faExchangeAlt}
              style={{ fontSize: 12 }}
            />
            {exchangeIcon}
          </div>
        </LinkButton>
        {/* <UncontrolledTooltip placement="bottom" target={this.props.id}>
          {tooltipContent}
        </UncontrolledTooltip> */}
      </TooltipComponent>
    );
  }
}

class Headline extends React.Component {
  constructor(props) {
    super(props);
    this.initMembers = {};
    Object.values(GROUPS).forEach((group) => (this.initMembers[group.id] = []));
    this.state = {
      membersCollection: this.initMembers, // {"1": [[1期生], [2期生]], "2": [[1期生], [2期生], [3期生]]}
    };

    // scrollAdminに使用。cacheされた時、裏でprops.location.keyが暗黙に変化し、全てのheadlineが同じidになってしまうため、グローバルstateで管理
    this.subNavbarRef = React.createRef();
    this.InitUrl = props.match.url;
    props.domDispatch({
      type: "SET_SUBNAVBAR_REF",
      subNavbarRef: this.subNavbarRef,
      locationKey: props.location.key,
    });
  }

  componentDidMount() {
    if (this.props.type === "blogs" || this.props.type === "images") {
      const url = URLJoin(BASE_URL, "members/");
      axios
        .get(url)
        .then((res) => {
          const _membersCollection = this.initMembers;
          Object.values(GROUPS).forEach((groupObj) => {
            if (groupObj.isActive) {
              _membersCollection[groupObj.id] = [];
              for (const membersByGene of res.data[groupObj.key]) {
                _membersCollection[groupObj.id].push(
                  membersByGene.map((member) => ({
                    url: member.url,
                    full_kanji: member.full_kanji,
                  }))
                );
              }
            }
          });
          this.setState({
            membersCollection: _membersCollection,
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally();
    }
  }

  componentDidUpdate(prevProps) {
    // "/"から"/"の遷移など、route(url)が変化せずComponentがそのままの場合
    if (checkNotCached(this.props) && this.props.match.url === this.InitUrl) {
      if (this.props.location.key !== prevProps.location.key) {
        this.props.domDispatch({
          type: "SET_SUBNAVBAR_REF",
          subNavbarRef: this.subNavbarRef,
          locationKey: this.props.location.key,
        });
      }
    }
  }

  getModeSelectButtonGroup = (fixed) => {
    const ButtonGroupPC = ({ children }) => (
      <ButtonGroup size="lg" className="mt-3 mt-lg-0">
        {children}
      </ButtonGroup>
    );

    if (this.props.type === "blogs" || this.props.type === "images") {
      const contents = (
        <>
          {/* <LinkButton
            className={"rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "recommend" ? "active" : "")}
            to={`/${this.props.type}/`}
          >
            <h5 className="m-0">おすすめ</h5>
          </LinkButton> */}
          <Button
            className={
              "rounded-pill mode-select-button " +
              (fixed ? "fixed " : " ") +
              (this.props.mode === "recommend" ? "active" : "")
            }
            onClick={() => this.props.history.push(`/${this.props.type}/`)}
          >
            <b>おすすめ</b>
          </Button>

          {sortGROUPSByFav(this.props.profileState.profile.favGroups).map(
            (groupObj) => (
              // <LinkButton
              //   key={groupObj.id}
              //   className={`rounded-pill mode-select-button ${groupObj.key} ` + (fixed ? "fixed " : " ") + ((!isMobile && !fixed) ? "d-flex align-items-center " : " ") + (this.props.mode === groupObj.key ? "active" : "")}
              //   to={`/${this.props.type}/${groupObj.id}`}
              // >
              //   <h5 className="m-0">{groupObj.name}</h5>
              //   {groupObj.isActive && (fixed
              //     ? <MobileTopMenu id={`modeSelect${groupObj.key}`} type="modeSelect" members={this.state.membersCollection[groupObj.id]} group={groupObj.key} blogsORimages={this.props.type} />
              //     : <ModeSelectButtonDropdown group={groupObj.key} members={this.state.membersCollection[groupObj.id]} type={this.props.type} fixed={fixed} />
              //   )}
              // </LinkButton>
              <Button
                key={groupObj.id}
                className={
                  `rounded-pill mode-select-button ${groupObj.key} ` +
                  (fixed ? "fixed " : " ") +
                  (!isMobile && !fixed ? "d-flex align-items-center " : " ") +
                  (this.props.mode === groupObj.key ? "active" : "")
                }
                onClick={() =>
                  this.props.history.push(`/${this.props.type}/${groupObj.id}/`)
                }
              >
                <b>{groupObj.name}</b>
                {groupObj.isActive &&
                  (fixed ? (
                    <MobileTopMenu
                      id={`modeSelect${groupObj.key}`}
                      type="modeSelect"
                      members={this.state.membersCollection[groupObj.id]}
                      groupKey={groupObj.key}
                      blogsORimages={this.props.type}
                      profileState={this.props.profileState}
                    />
                  ) : (
                    <ModeSelectButtonDropdown
                      groupKey={groupObj.key}
                      members={this.state.membersCollection[groupObj.id]}
                      type={this.props.type}
                      fixed={fixed}
                    />
                  ))}
              </Button>
            )
          )}
        </>
      );

      if (isMobile || fixed) {
        return <>{contents}</>;
      } else {
        return <ButtonGroupPC>{contents}</ButtonGroupPC>;
      }
    } else if (this.props.type === "blogView" && !isMobile) {
      const contents = (
        <>
          <Button
            className={
              "rounded-pill mode-select-button " +
              (fixed ? "fixed " : " ") +
              (this.props.mode === "view" ? "active" : "")
            }
            onClick={() => this.props.changeMode("view")}
          >
            <b>閲覧する</b>
          </Button>
          <Button
            className={
              "rounded-pill mode-select-button " +
              (fixed ? "fixed " : " ") +
              (this.props.mode === "download" ? "active" : "")
            }
            onClick={() => this.props.changeMode("download")}
          >
            <b>保存する</b>
          </Button>
        </>
      );
      if (fixed) {
        return <>{contents}</>;
      } else {
        return <ButtonGroupPC>{contents}</ButtonGroupPC>;
      }
    } else if (this.props.type === "members") {
      const contents = (
        <>
          {sortGROUPSByFav(this.props.profileState.profile.favGroups).map(
            (groupObj) => {
              if (groupObj.isActive)
                return (
                  <Button
                    key={groupObj.id}
                    className={
                      `rounded-pill mode-select-button ${groupObj.key} ` +
                      (fixed ? "fixed " : " ") +
                      (this.props.group === groupObj.key ? "active" : "")
                    }
                    onClick={() => this.props.changeGroup(groupObj.key)}
                  >
                    <b>{groupObj.name}</b>
                  </Button>
                );
            }
          )}
        </>
      );
      if (isMobile || fixed) {
        return <>{contents}</>;
      } else {
        return <ButtonGroup size="lg">{contents}</ButtonGroup>;
      }
    }
  };

  getModeSelectButtonGroupVerLeft = (fixed) => {
    let contents;
    if (this.props.type === "home") {
      contents = (
        <>
          <Button
            className={
              "rounded-pill mode-select-button active " + (fixed ? "fixed" : "")
            }
            onClick={() => this.props.history.push("/")}
          >
            <b>ホーム</b>
          </Button>
          <Button
            className={
              "rounded-pill mode-select-button " +
              (fixed ? "fixed " : " ") +
              (!isMobile && !fixed ? "d-flex align-items-center" : "")
            }
            onClick={() => this.props.history.push("/images/")}
          >
            <b>画像一覧</b>

            {fixed ? (
              <MobileTopMenu
                id="modeSelectVewHomeImages"
                type="modeSelectVewHome"
                blogsORimages="images"
                profileState={this.props.profileState}
              />
            ) : (
              <ModeSelectButtonDropdown type="images" fixed={fixed} />
            )}
          </Button>
          <Button
            className={
              "rounded-pill mode-select-button " +
              (fixed ? "fixed " : " ") +
              (!isMobile && !fixed ? "d-flex align-items-center" : "")
            }
            onClick={() => this.props.history.push("/blogs/")}
          >
            <b>ブログ一覧</b>

            {fixed ? (
              <MobileTopMenu
                id="modeSelectVewHomeBlogs"
                type="modeSelectVewHome"
                blogsORimages="blogs"
                profileState={this.props.profileState}
              />
            ) : (
              <ModeSelectButtonDropdown type="blogs" fixed={fixed} />
            )}
          </Button>
        </>
      );
    } else if (this.props.type === "terms") {
      contents = (
        <>
          <Button
            className={
              "rounded-pill mode-select-button " +
              (fixed ? "fixed " : " ") +
              (this.props.mode === "contact" ? "active" : "")
            }
            onClick={() => this.props.history.push("/contact/")}
          >
            <b>{this.props.titleHash["contact"]}</b>
          </Button>
          <Button
            className={
              "rounded-pill mode-select-button " +
              (fixed ? "fixed " : " ") +
              (this.props.mode === "termsOfService" ? "active" : "")
            }
            onClick={() => this.props.history.push("/terms-of-service/")}
          >
            <b>{this.props.titleHash["termsOfService"]}</b>
          </Button>
          <Button
            className={
              "rounded-pill mode-select-button " +
              (fixed ? "fixed " : " ") +
              (this.props.mode === "privacyPolicy" ? "active" : "")
            }
            onClick={() => this.props.history.push("/privacy-policy/")}
          >
            <b>{this.props.titleHash["privacyPolicy"]}</b>
          </Button>
        </>
      );
    }

    if (this.props.type === "home" || this.props.type === "terms") {
      if (isMobile || fixed) {
        return <>{contents}</>;
      } else {
        return (
          <ButtonGroup size="lg" className="ml-3 my-0">
            {contents}
          </ButtonGroup>
        );
      }
    }
  };

  getTypeChangeButton = (fixed) => {
    let typeChangeButtonID;
    if (fixed) typeChangeButtonID = "type-change-button-fixed";
    else typeChangeButtonID = "type-change-button";

    if (this.props.type === "blogs" || this.props.type === "images") {
      return (
        <TypeChangeButton
          id={typeChangeButtonID}
          history={this.props.history}
          type={this.props.type}
          groupID={this.props.groupID}
          ct={this.props.ct}
        />
      );
    }
  };

  render() {
    const fixedTypeChangeButton = this.getTypeChangeButton(true);
    const fixedModeSelectButtonGroupVerLeft = this.getModeSelectButtonGroupVerLeft(
      true
    );
    const fixedModeSelectButtonGroup = this.getModeSelectButtonGroup(true);

    return (
      <>
        {/* fixed headline */}
        <div
          className="fixed-headline border-bottom text-muted pl-0 pl-lg-3"
          // Headlineのtop初期状態: mobileはNAVBAR_HEIGHT, PCでは0
          style={{
            top: isMobile ? NAVBAR_HEIGHT : 0,
            height: SUB_NAVBAR_HEIGHT,
          }}
          ref={this.subNavbarRef}
        >
          <BackButton mini={true} className="mr-0 mr-lg-2" />

          {this.props.title &&
            (fixedModeSelectButtonGroupVerLeft ||
              fixedModeSelectButtonGroup) && (
              <>
                <h1>{this.props.title}</h1>
                {!isMobile && fixedTypeChangeButton}
                <div
                  className={"vertical-hr " + (isMobile ? "ml-3" : "mx-2")}
                ></div>
              </>
            )}
          {/* only title ver */}
          {this.props.title &&
            !fixedModeSelectButtonGroupVerLeft &&
            !fixedModeSelectButtonGroup && (
              <>
                <h1>{this.props.title}</h1>
                {!isMobile && fixedTypeChangeButton}
              </>
            )}

          <div
            className="fixed-headline-contents-wrapper"
            style={{ height: SUB_NAVBAR_HEIGHT }}
          >
            <div
              className="fixed-headline-contents-wrapper2"
              style={{ height: SUB_NAVBAR_HEIGHT }}
            >
              <div className={"text-muted fixed-headline-contents"}>
                {fixedModeSelectButtonGroupVerLeft}
                {fixedModeSelectButtonGroup}
              </div>
            </div>
          </div>
        </div>

        {/* headline */}
        {!isMobile && (
          <>
            <div className="row justify-content-between mr-0">
              <div className="d-flex align-items-center">
                <BackButton />
                {this.getModeSelectButtonGroupVerLeft(false)}
                {this.props.title && (
                  <h3 className="ml-3 my-0">{this.props.title}</h3>
                )}
                {this.getTypeChangeButton(false)}
              </div>
              {this.getModeSelectButtonGroup(false)}
            </div>
          </>
        )}
      </>
    );
  }
}

export default withRouter((props) => (
  <DomDispatchContext.Consumer>
    {(domDispatch) => (
      <ProfileStateContext.Consumer>
        {(profileState) => (
          <Headline
            {...props}
            domDispatch={domDispatch}
            profileState={profileState}
          />
        )}
      </ProfileStateContext.Consumer>
    )}
  </DomDispatchContext.Consumer>
));
