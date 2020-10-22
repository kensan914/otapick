import React, { useState } from "react";
import BackButton from "../atoms/BackButton";
import { Button, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledTooltip } from "reactstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { URLJoin, isMobile } from "../modules/utils";
import { BASE_URL, GROUPS } from "../modules/env";
import { Link } from "react-router-dom";
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT } from "../modules/env";
import { MobileTopMenu } from "./MobileMenu";


export const ModeSelectButtonDropdown = (props) => {
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);

  let contents = [];
  if (typeof props.members != "undefined") {
    for (const [index, membersDividedByGeneration] of props.members.entries()) {
      contents.push(
        <div key={"dropdown-menu-contents-m-" + index}>
          <DropdownItem header><div className="m-0">{`${index + 1}期生`}</div></DropdownItem>
          <DropdownItem divider />
          {membersDividedByGeneration.map(({ url, full_kanji }, j) => (
            <DropdownItem key={j} tag={Link} to={url[props.type]}>{full_kanji}</DropdownItem>
          ))}
          {index != props.members.length - 1 && <DropdownItem divider />}
        </div>
      );
    }
  } else {
    contents.push(
      <div key={"dropdown-menu-contents-g"}>
        <DropdownItem header>グループ選択</DropdownItem>
        <DropdownItem divider />
        {Object.values(GROUPS).map(groupObj => (
          <DropdownItem key={groupObj.id} tag={Link} to={`/${props.type}/${groupObj.id}`}>{`${groupObj.name}`}</DropdownItem>
        ))}
      </div>
    )
  }

  return (
    <ButtonDropdown direction="right" isOpen={dropdownOpen} toggle={toggle} onClick={(e) => e.stopPropagation()}
      className={"mode-select-dropdown-button-super " + (props.fixed ? "fixed" : "")}>
      <DropdownToggle className={"rounded-circle mode-select-dropdown-button " + (props.fixed ? "fixed p-0 " : " ") + props.group} >
        <i className="fas fa-angle-down"></i>
      </DropdownToggle>
      <DropdownMenu className={"mode-select-dropdown-menu" + (typeof props.members != "undefined" && "-members")}>
        {contents}
      </DropdownMenu>
    </ButtonDropdown>
  );
}

export class TypeChangeButton extends React.Component {
  changeType(currentType, groupID, ct) {
    let url;
    if (currentType === "blogs") {
      url = URLJoin("/images/", groupID, ct);
    } else if (currentType === "images") {
      url = URLJoin("/blogs/", groupID, ct);
    }
    this.props.history.push(url);
  }

  render() {
    let tooltipContent;
    if (this.props.type === "blogs") {
      tooltipContent = "画像一覧に切り替えます";
    } else if (this.props.type === "images") {
      tooltipContent = "ブログ一覧に切り替えます";
    }
    return (
      <>
        <Button className="rounded-circle p-0 type-change-button ml-1" id={this.props.id}
          onClick={() => this.changeType(this.props.type, this.props.groupID, this.props.ct)}>
          <i className="fas fa-sync-alt" style={{ color: "gray" }}></i>
        </Button>
        <UncontrolledTooltip placement="bottom" target={this.props.id}>
          {tooltipContent}
        </UncontrolledTooltip>
      </>
    );
  }
}

class Headline extends React.Component {
  constructor(props) {
    super(props);
    this.initMembers = {};
    Object.values(GROUPS).forEach(group => this.initMembers[group.id] = []);
    this.state = {
      membersCollection: this.initMembers, // {"1": [[1期生], [2期生]], "2": [[1期生], [2期生], [3期生]]}
    }
  };

  componentDidMount() {
    if (this.props.type === "blogs" || this.props.type === "images") {
      const url = URLJoin(BASE_URL, "api/members/");
      axios
        .get(url)
        .then(res => {
          const _membersCollection = this.initMembers;
          Object.values(GROUPS).forEach(groupObj => {
            if (groupObj.isActive) {
              _membersCollection[groupObj.id] = [];
              for (const membersByGene of res.data[groupObj.key]) {
                _membersCollection[groupObj.id].push(membersByGene.map(member =>
                  ({
                    url: member.url,
                    full_kanji: member.full_kanji,
                  })
                ))
              }
            }
          });
          this.setState({
            membersCollection: _membersCollection,
          })
        })
        .catch(err => {
          console.log(err);
        })
        .finally()
    }
  }

  getModeSelectButtonGroup = (fixed) => {
    if (this.props.type === "blogs" || this.props.type === "images") {
      const contents = (<>
        <Button className={"rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "recommend" ? "active" : "")}
          onClick={() => this.props.history.push(`/${this.props.type}/`)}><b>おすすめ</b></Button>

        {Object.values(GROUPS).map(groupObj => (
          <Button key={groupObj.id} className={`rounded-pill mode-select-button ${groupObj.key} ` + (fixed ? "fixed " : " ") + ((!isMobile && !fixed) ? "d-flex align-items-center " : " ") + (this.props.mode === groupObj.key ? "active" : "")}
            onClick={() => this.props.history.push(`/${this.props.type}/${groupObj.id}`)}>
            <b>{groupObj.name}</b>
            {groupObj.isActive && (fixed
              ? <MobileTopMenu id={`modeSelect${groupObj.key}`} type="modeSelect" members={this.state.membersCollection[groupObj.id]} group={groupObj.key} blogsORimages={this.props.type} />
              : <ModeSelectButtonDropdown group={groupObj.key} members={this.state.membersCollection[groupObj.id]} type={this.props.type} fixed={fixed} />
            )}
          </Button>
        ))}
      </>);

      if (isMobile || fixed) {
        return <>{contents}</>;
      } else {
        return <ButtonGroup size="lg">{contents}</ButtonGroup>;
      }
    } else if (this.props.type === "blogView" && !isMobile) {
      const contents = (
        <>
          <Button className={"rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "view" ? "active" : "")}
            onClick={() => this.props.changeMode("view")}><b>閲覧する</b></Button>
          <Button className={"rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "download" ? "active" : "")}
            onClick={() => this.props.changeMode("download")}><b>保存する</b></Button>
        </>
      );
      if (fixed) {
        return <>{contents}</>;
      } else {
        return <ButtonGroup size="lg">{contents}</ButtonGroup>;
      }
    } else if (this.props.type === "members") {
      const contents = (
        <>
          {Object.values(GROUPS).map(groupObj => {
            if (groupObj.isActive)
              return (
                <Button key={groupObj.id} className={`rounded-pill mode-select-button ${groupObj.key} ` + (fixed ? "fixed " : " ") + (this.props.group === groupObj.key ? "active" : "")}
                  onClick={() => this.props.changeGroup(groupObj.key)}><b>{groupObj.name}</b></Button>
              );
          })}
        </>
      );
      if (isMobile || fixed) {
        return <>{contents}</>;
      } else {
        return <ButtonGroup size="lg">{contents}</ButtonGroup>;
      }
    }
  }

  getModeSelectButtonGroupVerLeft = (fixed) => {
    let contents;
    if (this.props.type === "home") {
      contents = (<>
        <Button className={"rounded-pill mode-select-button active " + (fixed ? "fixed" : "")}
          onClick={() => this.props.history.push("/")}><b>ホーム</b></Button>
        <Button className={"rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + ((!isMobile && !fixed) ? "d-flex align-items-center" : "")}
          onClick={() => this.props.history.push("/images/")}>
          <b>画像一覧</b>

          {fixed
            ? <MobileTopMenu id="modeSelectVewHomeImages" type="modeSelectVewHome" blogsORimages="images" />
            : <ModeSelectButtonDropdown type="images" fixed={fixed} />
          }
        </Button>
        <Button className={"rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + ((!isMobile && !fixed) ? "d-flex align-items-center" : "")}
          onClick={() => this.props.history.push("/blogs/")}>
          <b>ブログ一覧</b>


          {fixed
            ? <MobileTopMenu id="modeSelectVewHomeBlogs" type="modeSelectVewHome" blogsORimages="blogs" />
            : <ModeSelectButtonDropdown type="blogs" fixed={fixed} />
          }

        </Button>
      </>);
    } else if (this.props.type === "terms") {
      contents = (<>
        <Button className={"rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "contact" ? "active" : "")}
          onClick={() => this.props.history.push("/contact/")}><b>{this.props.titleHash["contact"]}</b></Button>
        <Button className={"rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "termsOfService" ? "active" : "")}
          onClick={() => this.props.history.push("/terms-of-service/")}><b>{this.props.titleHash["termsOfService"]}</b></Button>
        <Button className={"rounded-pill mode-select-button " + (fixed ? "fixed " : " ") + (this.props.mode === "privacyPolicy" ? "active" : "")}
          onClick={() => this.props.history.push("/privacy-policy/")}><b>{this.props.titleHash["privacyPolicy"]}</b></Button>
      </>);
    }

    if (this.props.type === "home" || this.props.type === "terms") {
      if (isMobile || fixed) {
        return (
          <>{contents}</>);
      } else {
        return (
          <ButtonGroup size="lg" className="ml-3 my-0">
            {contents}
          </ButtonGroup>);
      }
    }
  }

  getTypeChangeButton = (fixed) => {
    let typeChangeButtonID;
    if (fixed) typeChangeButtonID = "type-change-button-fixed";
    else typeChangeButtonID = "type-change-button";

    if (this.props.type === "blogs" || this.props.type === "images") {
      return <TypeChangeButton id={typeChangeButtonID} history={this.props.history} type={this.props.type} groupID={this.props.groupID} ct={this.props.ct} />
    }
  }

  render() {
    const fixedTypeChangeButton = this.getTypeChangeButton(true);
    const fixedModeSelectButtonGroupVerLeft = this.getModeSelectButtonGroupVerLeft(true);
    const fixedModeSelectButtonGroup = this.getModeSelectButtonGroup(true);

    return (
      <>
        {/* fixed headline */}
        <div className="fixed-headline border-bottom text-muted pl-0 pl-lg-3" style={{ top: NAVBAR_HEIGHT, height: SUB_NAVBAR_HEIGHT }} id="otapick-sub-navbar">
          <BackButton mini={true} className="mr-0 mr-lg-2" />

          {(this.props.title && (fixedModeSelectButtonGroupVerLeft || fixedModeSelectButtonGroup)) &&
            <>
              <h1>{this.props.title}</h1>
              {!isMobile && fixedTypeChangeButton}
              <div className={"vertical-hr " + (isMobile ? "ml-3" : "mx-2")}></div>
            </>
          }
          {/* only title ver */}
          {(this.props.title && (!fixedModeSelectButtonGroupVerLeft && !fixedModeSelectButtonGroup)) &&
            <>
              <h1>{this.props.title}</h1>
              {!isMobile && fixedTypeChangeButton}
            </>
          }

          <div className="fixed-headline-contents-wrapper" style={{ height: SUB_NAVBAR_HEIGHT }}>
            <div className="fixed-headline-contents-wrapper2" style={{ height: SUB_NAVBAR_HEIGHT }}>
              <div className={"text-muted fixed-headline-contents"}>
                {fixedModeSelectButtonGroupVerLeft}
                {fixedModeSelectButtonGroup}
              </div>
            </div>
          </div>
        </div>

        {/* headline */}
        {!isMobile &&
          <>
            <div className="row justify-content-between mr-0">
              <div className="d-flex align-items-center">
                <BackButton />
                {this.getModeSelectButtonGroupVerLeft(false)}
                {this.props.title &&
                  <h3 className="ml-3 my-0">{this.props.title}</h3>
                }
                {this.getTypeChangeButton(false)}
              </div>
              {this.getModeSelectButtonGroup(false)}
            </div>
          </>
        }
      </>
    );
  }
}

export default withRouter(Headline);