import React, { useState } from 'react';
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT } from '../tools/env';
import BackButton from '../atoms/BackButton';
import { Button, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledTooltip } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { ModeSelectButtonDropdown, TypeChangeButton } from './Headline';



class FixedHeadline extends React.Component {
  render() {
    let modeSelectButtonGroup;
    let modeSelectButtonGroupVerHome;
    let typeChangeButton;

    if (typeof this.props.type == "undefined") {
      return (
        <div className="fixed-headline border-bottom" style={{ top: NAVBAR_HEIGHT, height: SUB_NAVBAR_HEIGHT }}>
          <div className="text-muted fixed-headline-contents d-flex align-items-center">
            <BackButton mini={true} />
            {this.props.title &&
              <h1>{this.props.title}</h1>
            }
          </div>
        </div>
      );
    } else if (this.props.type === "blogs" || this.props.type === "images") {
      modeSelectButtonGroup = (
        <ButtonGroup size="lg">
          <Button className={"rounded-pill mode-select-button " + (this.props.mode === "recommend" && "active")}
            onClick={() => this.props.history.push(`/${this.props.type}/`)}><b>おすすめ</b></Button>
          <Button className={"rounded-pill d-flex align-items-center mode-select-button keyaki " + (this.props.mode === "keyaki" && "active")}
            onClick={() => this.props.history.push(`/${this.props.type}/1`)}>
            <b>欅坂46</b><ModeSelectButtonDropdown group="keyaki" members={this.state.keyakiMembers} type={this.props.type} />
          </Button>
          <Button className={"rounded-pill d-flex align-items-center mode-select-button hinata " + (this.props.mode === "hinata" && "active")}
            onClick={() => this.props.history.push(`/${this.props.type}/2`)}>
            <b>日向坂46</b><ModeSelectButtonDropdown group="hinata" members={this.state.hinataMembers} type={this.props.type} />
          </Button>
        </ButtonGroup>);

      typeChangeButton = <TypeChangeButton history={this.props.history} type={this.props.type} groupID={this.props.groupID} ct={this.props.ct} />
    } else if (this.props.type === "home") {
      modeSelectButtonGroupVerHome = (
        <ButtonGroup size="lg" className="ml-3 my-0">
          <Button className={"rounded-pill mode-select-button active"}
            onClick={() => this.props.history.push("/")}><b>ホーム</b></Button>
          <Button className={"rounded-pill d-flex align-items-center mode-select-button"}
            onClick={() => this.props.history.push("/images/")}>
            <b>画像一覧</b>
            <ModeSelectButtonDropdown type="images" />
          </Button>
          <Button className={"rounded-pill d-flex align-items-center mode-select-button"}
            onClick={() => this.props.history.push("/blogs/")}>
            <b>ブログ一覧</b>
            <ModeSelectButtonDropdown type="blogs" />
          </Button>
        </ButtonGroup>);
    } else if (this.props.type === "blogView") {
      modeSelectButtonGroup = (
        <ButtonGroup size="lg">
          <Button className={"rounded-pill mode-select-button " + (this.props.mode === "view" && "active")}
            onClick={() => this.props.changeMode("view")}><b>閲覧する</b></Button>
          <Button className={"rounded-pill mode-select-button " + (this.props.mode === "download" && "active")}
            onClick={() => this.props.changeMode("download")}><b>保存する</b></Button>
        </ButtonGroup>);
    }


    return (
      <div className="fixed-headline border-bottom" style={{ top: NAVBAR_HEIGHT, height: SUB_NAVBAR_HEIGHT }}>
        <div className="text-muted fixed-headline-contents d-flex align-items-center">
          <BackButton mini={true} />
          {modeSelectButtonGroupVerHome}
          {this.props.title &&
            <>
              <h1>{this.props.title}</h1>
              <div className="vertical-hr mx-2" style={{ height: SUB_NAVBAR_HEIGHT - 20 }}></div>
            </>
          }
          {typeChangeButton}
        </div>
        {modeSelectButtonGroup}
      </div>
    );
  }
}


export default withRouter(FixedHeadline);