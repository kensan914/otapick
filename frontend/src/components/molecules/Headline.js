import React, { useState } from 'react';
import BackButton from '../atoms/BackButton';
import { Button, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledTooltip } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { URLJoin, isMobile } from '../tools/support';
import { BASE_URL } from "../tools/env";
import { Link } from 'react-router-dom';
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT } from '../tools/env';
import { MobileTopMenu } from './MobileMenu';


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
        <DropdownItem tag={Link} to={`/${props.type}/1`}>欅坂46</DropdownItem>
        <DropdownItem tag={Link} to={`/${props.type}/2`}>日向坂46</DropdownItem>
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
    this.state = {
      keyakiMembers: [], // [[1期生], [2期生]]
      hinataMembers: [], // [[1期生], [2期生], [3期生]]
    }
  };

  componentDidMount() {
    if (this.props.type === "blogs" || this.props.type === "images") {
      const url = URLJoin(BASE_URL, "api/members/");
      axios
        .get(url)
        .then(res => {
          let keyakiMembers = [];
          for (const members of res.data["keyaki"]) {
            keyakiMembers.push(members.map((member, index) =>
              ({
                url: member.url,
                full_kanji: member.full_kanji,
              })
            ))
          }
          let hinataMembers = [];
          for (const members of res.data["hinata"]) {
            hinataMembers.push(members.map((member, index) =>
              ({
                url: member.url,
                full_kanji: member.full_kanji,
              })
            ))
          }
          this.setState({
            keyakiMembers: keyakiMembers,
            hinataMembers: hinataMembers,
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
        <Button className={"rounded-pill mode-select-button keyaki " + (fixed ? "fixed " : " ") + ((!isMobile && !fixed) ? "d-flex align-items-center " : " ") + (this.props.mode === "keyaki" ? "active" : "")}
          onClick={() => this.props.history.push(`/${this.props.type}/1`)}>
          <b>欅坂46</b>
          {fixed
            ? <MobileTopMenu id="modeSelectKeyaki" type="modeSelect" members={this.state.keyakiMembers} group="keyaki" blogsORimages={this.props.type} />
            : <ModeSelectButtonDropdown group="keyaki" members={this.state.keyakiMembers} type={this.props.type} fixed={fixed} />
          }

        </Button>
        <Button className={"rounded-pill mode-select-button hinata " + (fixed ? "fixed " : " ") + ((!isMobile && !fixed) ? "d-flex align-items-center " : " ") + (this.props.mode === "hinata" ? "active" : "")}
          onClick={() => this.props.history.push(`/${this.props.type}/2`)}>
          <b>日向坂46</b>
          {fixed
            ? <MobileTopMenu id="modeSelectHinata" type="modeSelect" members={this.state.hinataMembers} group="hinata" blogsORimages={this.props.type} />
            : <ModeSelectButtonDropdown group="hinata" members={this.state.hinataMembers} type={this.props.type} fixed={fixed} />
          }

        </Button>
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
          <Button className={"rounded-pill mode-select-button keyaki " + (fixed ? "fixed " : " ") + (this.props.group === "keyaki" ? "active" : "")}
            onClick={() => this.props.changeGroup("keyaki")}><b>欅坂46</b></Button>
          <Button className={"rounded-pill mode-select-button hinata " + (fixed ? "fixed " : " ") + (this.props.group === "hinata" ? "active" : "")}
            onClick={() => this.props.changeGroup("hinata")}><b>日向坂46</b></Button>
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