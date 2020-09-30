import React from 'react';
import { isSmp, lockScreen, unLockScreen, isMobile, documentScrollHandler } from '../tools/support';
import { Button } from 'reactstrap';
import { MOBILE_TOP_MENU_MT, SUB_NAVBAR_HEIGHT, NAVBAR_LS_ZINDEX, SUB_NAVBAR_LS_ZINDEX, NAVBAR_BOTTOM_LS_ZINDEX } from '../tools/env';
import { withRouter, Link } from 'react-router-dom';


class MobileMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    }
  }

  toggleWork() {
    if (this.state.isOpen) {
      this.endWork();
    } else {
      this.setState({ isOpen: true });
    }
  }

  documentTouchmoveHandler = e => {
    // スマホスクロール無効(menubox以外) https://qiita.com/noraworld/items/2834f2e6f064e6f6d41a
    const menuBox = document.getElementById(this.boxID);
    const scrollMenuBox = document.getElementById(this.scrollBoxID);

    if (e.target.closest(`#${this.boxID}`) === menuBox && scrollMenuBox.scrollTop !== 0 && scrollMenuBox.scrollTop + scrollMenuBox.clientHeight !== scrollMenuBox.scrollHeight) {
      e.stopPropagation();
    } else {
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  }

  // 作業を終了
  endWork() {
    this.setState({ isOpen: false });
    if (isMobile) {
      document.removeEventListener('mousewheel', documentScrollHandler, { passive: false });
      document.removeEventListener('touchmove', this.documentTouchmoveHandler, { passive: false });
    }
    document.removeEventListener('mousedown', this.documentClickHandler);
  }

  componentDidUpdate(prevProps, prevState) {
    // menuがviewされたとき(作業が開始したとき)
    if (prevState.isOpen !== this.state.isOpen && this.state.isOpen) {
      if (isMobile) {
        const scrollMenuBox = document.getElementById(this.scrollBoxID);
        if (scrollMenuBox !== null) {
          document.addEventListener('mousewheel', documentScrollHandler, { passive: false });
          document.addEventListener('touchmove', this.documentTouchmoveHandler, { passive: false });
          scrollMenuBox.scrollTop = 1;
          // ↓ https://qiita.com/noraworld/items/2834f2e6f064e6f6d41a
          scrollMenuBox.addEventListener('scroll', e => {
            if (scrollMenuBox.scrollTop === 0) {
              scrollMenuBox.scrollTop = 1;
            }
            else if (scrollMenuBox.scrollTop + scrollMenuBox.clientHeight === scrollMenuBox.scrollHeight) {
              scrollMenuBox.scrollTop = scrollMenuBox.scrollTop - 1;
            }
          });
        }
      }
      document.addEventListener('mousedown', this.documentClickHandler);
      this.lockScreenCustom();
    }

    // menuのviewが解除されたとき(作業が終了したとき)
    else if (prevState.isOpen !== this.state.isOpen && !this.state.isOpen) {
      unLockScreen(this.lockScreenID);
    }

    // 画面遷移したとき
    if (this.props.location !== prevProps.location) {
      this.endWork();
    }
  }

  componentWillUnmount() {
    this.endWork();
    unLockScreen(this.lockScreenID);
  }
}

export class MobileTopMenu_ extends MobileMenu {
  constructor(props) {
    super(props);
    this.lockScreenID = `mobiletopmenuLS_${this.props.id}`;
    this.boxID = "mobile-top-menu";
    this.scrollBoxID = "scroll-mobile-top-menu";
  }

  documentClickHandler = e => {
    // 他の箇所クリックしたとき、作業を終了
    if (e.target.closest(`#mobiletopmenu-button-${this.props.id}`) == null && e.target.closest(`#${this.boxID}`) == null) {
      this.endWork();
    }
  }

  lockScreenCustom() {
    if (this.props.type === "navbarMenu") {
      lockScreen(this.lockScreenID, NAVBAR_LS_ZINDEX);
    } else {
      lockScreen(this.lockScreenID, SUB_NAVBAR_LS_ZINDEX);
    }
  }

  render() {
    let triggerButton;
    if (this.props.type === "navbarMenu") {
      triggerButton =
        <Button className="rounded-circle transparent-button-mobile" id={`mobiletopmenu-button-${this.props.id}`}
          onClick={() => this.toggleWork()}>
          <i className="fas fa-bars" />
        </Button>
    } else if (this.props.type === "modeSelect" || this.props.type === "modeSelectVewHome") {
      triggerButton =
        <div className={"mode-select-dropdown-button-super fixed btn-group"}>
          <Button className={"rounded-circle mode-select-dropdown-button fixed p-0 " + this.props.group}
            id={`mobiletopmenu-button-${this.props.id}`} onClick={(e) => { e.stopPropagation(); this.toggleWork(); }}>
            <i className="fas fa-angle-down"></i>
          </Button>
        </div>
    }

    let contents;
    if (this.props.type === "navbarMenu") {
      contents =
        <>
          <MobileMenuTitle title="クイックアクセス" />
          <MobileMenuLink router={true} href="/images" title="画像一覧" />
          <MobileMenuLink router={true} href="/blogs" title="ブログ一覧" />
          <MobileMenuLink router={true} href="/members" title="メンバーリスト" />

          <MobileMenuHr />
          <MobileMenuTitle title="公式リンク" />
          <MobileMenuLink router={false} href="https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000"
            target="_blank" title="欅坂46公式ブログ" icon={true} />
          <MobileMenuLink router={false} href="https://www.hinatazaka46.com/s/official/diary/member?ima=0000"
            target="_blank" title="日向坂46公式ブログ" icon={true} />

          <MobileMenuHr />
          <MobileMenuTitle title="ヲタピックについて" />
          <MobileMenuLink router={true} href="/contact" title="お問い合わせ" />
          <MobileMenuLink router={true} href="/terms-of-service" title="利用規約" />
          <MobileMenuLink router={true} href="/privacy-policy" title="プライバシーポリシー" />
          <MobileMenuLink router={false} href="https://twitter.com/otapick" target="_blank" title="公式Twitter" icon={true} />
        </>
    } else if (this.props.type === "modeSelect") {
      contents = [];
      for (const [index, membersDividedByGeneration] of this.props.members.entries()) {
        contents.push(
          <>
            <MobileMenuTitle title={`${index + 1}期生`} />
            <MobileMenuHr top={true} />
            {membersDividedByGeneration.map(({ url, full_kanji }, j) => (
              <MobileMenuLink router={true} href={url[this.props.blogsORimages]} title={full_kanji} />
            ))}
            {index != this.props.members.length - 1 && <MobileMenuHr />}
          </>
        );
      }
    } else if (this.props.type === "modeSelectVewHome") {
      contents =
        <>
          <MobileMenuTitle title="グループ選択" />
          <MobileMenuLink router={true} href={`/${this.props.blogsORimages}/1`} title="欅坂46" />
          <MobileMenuLink router={true} href={`/${this.props.blogsORimages}/2`} title="日向坂46" />
        </>
    }

    let mobileTopMenuStyle;
    let searchSuggestionsBoxStyle;
    if (this.props.type === "navbarMenu") {
      mobileTopMenuStyle = { position: "fixed", top: MOBILE_TOP_MENU_MT };
    } else if (this.props.type === "modeSelect" || this.props.type === "modeSelectVewHome") {
      mobileTopMenuStyle = { position: "fixed", top: MOBILE_TOP_MENU_MT + SUB_NAVBAR_HEIGHT };
      searchSuggestionsBoxStyle = {};
    }

    return (
      <>
        {triggerButton}
        {this.state.isOpen &&
          <div style={mobileTopMenuStyle} id={this.boxID} onClick={(e) => e.stopPropagation()}
            className={"mobile mobile-top-menu mobile-menu " + (this.props.type === "navbarMenu" ? "right" : "left")}>
            <div className={"container text-muted border search-suggestions-box " + (isMobile ? "mobile " : " ") + (isSmp ? "px-2 smp" : "")}
              style={Object.assign({ overflowY: "auto", overflowX: "hidden" }, searchSuggestionsBoxStyle)} id={this.scrollBoxID}>
              <Button className="rounded-circle transparent-button-mobile float-right mt-1"
                onClick={() => this.toggleWork()}>
                <i className="fas fa-times" />
              </Button>
              <div className={"text-left " + (isSmp ? "mb-2" : "mb-4")}>
                {contents}
              </div>
            </div>
          </div>
        }
      </>
    );
  }
}


export class MobileBottomMenu_ extends MobileMenu {
  constructor(props) {
    super(props);
    this.lockScreenID = `mobilebottommenuLS_${this.props.id}`;
    this.boxID = `mobilebottommenu_${this.props.id}`;
    this.scrollBoxID = `scroll-mobilebottommenu_${this.props.id}`
  }

  documentClickHandler = e => {
    // 他の箇所クリックしたとき、作業を終了
    if (e.target.closest(`#mobilebottommenu-button-${this.props.id}`) == null && e.target.closest(`#${this.boxID}`) == null) {
      this.endWork();
    }
  }

  lockScreenCustom() {
    lockScreen(this.lockScreenID, NAVBAR_BOTTOM_LS_ZINDEX);
  }

  render() {
    let triggerButton;
    if (this.props.type === "blogCard" || this.props.type === "memberCard") {
      triggerButton =
        <div className={"text-center " + this.props.className} style={{ overflowY: "visible" }}>
          <div className="card-detail-button-super">
            <Button id={`mobilebottommenu-button-${this.props.id}`} color="light" className="p-0 card-detail-button rounded-circle"
              onClick={() => this.toggleWork()}>
              <i className="fas fa-bars" style={{ color: "gray" }}></i>
            </Button>
          </div>
        </div>
    } else if (this.props.type === "imageCard") {
      triggerButton =
        <Button id={`mobilebottommenu-button-${this.props.id}`} className="rounded-circle transparent-button-mobile ml-auto"
          onClick={() => this.toggleWork()}>
          <i className="fas fa-ellipsis-h"></i>
        </Button>
    } else if (this.props.type === "sortBlog" || this.props.type === "sortImage") {
      triggerButton =
        <div className={"p-0 " + this.props.className} style={this.props.style}>
          <Button id={`mobilebottommenu-button-${this.props.id}`} color="light" className="blogList-detail-btn sort-button"
            onClick={() => this.toggleWork()}>
            <i className="fas fa-sort" />{this.props.sortButtonTitle}
          </Button >
        </div>
    } else if (this.props.type === "writerCard") {
      triggerButton =
        <Button id={`mobilebottommenu-button-${this.props.id}`} color="light" className="p-0 writer-card-detail-button rounded-circle"
          onClick={(e) => { e.stopPropagation(); this.toggleWork(); }}>
          <i class="fas fa-angle-down"></i>
        </Button>
    } else if (this.props.type === "imageViewCard") {
      triggerButton =
        <Button id={`mobilebottommenu-button-${this.props.id}`} color="light" className="p-0 image-view-detail-button rounded-circle"
          onClick={() => this.toggleWork()}>
          <i className="fas fa-bars" style={{ color: "gray" }}></i>
        </Button>
    }

    let contents;
    if (this.props.type === "blogCard" || this.props.type === "imageCard" || this.props.type === "imageViewCard") {
      contents =
        <>
          <MobileMenuTitle title={this.props.title} omit={true} />
          <MobileMenuHr top={true} />
          {(this.props.type === "blogCard" || this.props.type === "imageCard")
            ? (this.props.type === "blogCard")
              ? <MobileMenuLink router={true} href={this.props.url} title="詳細ページへ" />
              : <MobileMenuLink router={true} href={this.props.url} state={{ prevSrc: this.props.src }} title="詳細ページへ" />
            : <MobileMenuLink router={true} href={this.props.url} title="掲載ブログを確認" />
          }
          <MobileMenuLink router={false} href={this.props.officialUrl} target="_blank" icon={true} title="公式ブログで確認" />
          <MobileMenuLink router={true} href={this.props.writer.url["blogs"]} title={`「${this.props.writer.name}」のブログを探す`} />
          <MobileMenuLink router={true} href={this.props.writer.url["images"]} title={`「${this.props.writer.name}」の画像を探す`} />
        </>
    } else if (this.props.type === "sortBlog" || this.props.type === "sortImage") {
      contents =
        <>
          <MobileMenuTitle title="並べ替え" omit={true} />
          <MobileMenuHr top={true} />
          {this.props.type == "sortImage" &&
            <MobileMenuLink onClick={(e) => { e.preventDefault(); this.props.pushHistory({ "sort": "recommend" }) }} title="おすすめ順" />
          }
          <MobileMenuLink onClick={(e) => { e.preventDefault(); this.props.pushHistory({ "sort": "newer_post" }) }} title="新着順" />
          <MobileMenuLink onClick={(e) => { e.preventDefault(); this.props.pushHistory({ "sort": "older_post" }) }} title="古い順" />
          <MobileMenuLink onClick={(e) => { e.preventDefault(); this.props.pushHistory({ "sort": "popularity" }) }} title="人気順" />
          <MobileMenuLink onClick={(e) => { e.preventDefault(); this.props.pushHistory({ "sort": "dl" }) }} title="DL順" />
          {this.props.type == "sortBlog" &&
            <MobileMenuLink onClick={(e) => { e.preventDefault(); this.props.pushHistory({ "sort": "sum_dl" }) }} title="総DL順" />
          }
          <MobileMenuLink onClick={(e) => { e.preventDefault(); this.props.pushHistory({ "sort": "view" }) }} title="閲覧数順" />
        </>
    } else if (this.props.type === "memberCard" || this.props.type === "writerCard") {
      contents =
        <>
          <MobileMenuTitle title={this.props.title} omit={true} />
          <MobileMenuHr top={true} />
          <MobileMenuLink router={true} href={this.props.url["images"]} title="画像一覧へ" />
          <MobileMenuLink router={true} href={this.props.url["blogs"]} title="ブログ一覧へ" />
          <MobileMenuLink router={false} href={this.props.officialUrl} target="_blank" icon={true} title="公式サイトで確認" />
        </>
    }

    return (
      <>
        {triggerButton}
        {this.state.isOpen &&
          <div className="mobile mobile-bottom-menu mobile-menu" id={`mobilebottommenu_${this.props.id}`}
            onClick={(e) => e.stopPropagation()}>
            <div className={"container text-muted border search-suggestions-box " + (isMobile ? "mobile " : " ") + (isSmp ? "px-2" : "")}
              style={{ overflowY: "auto", overflowX: "hidden" }} id={this.scrollBoxID}>
              <Button className="rounded-circle transparent-button-mobile float-right mt-1"
                onClick={() => this.toggleWork()}>
                <i className="fas fa-times" />
              </Button>
              <div className={"text-left " + (isSmp ? "mb-2" : "mb-4")}>
                {contents}
              </div>
            </div>
          </div>
        }
      </>
    );
  }
}


export const MobileTopMenu = withRouter(MobileTopMenu_);
export const MobileBottomMenu = withRouter(MobileBottomMenu_);


const MobileMenuLink = (props) => {
  return (
    <div className="mobile-menu-a py-2">
      {props.router
        ? <Link to={{ pathname: props.href, state: props.state }}>
          <p className="mx-3 my-0"><b>
            {props.title}{props.icon && <>{"\u00A0"}<i className="fas fa-external-link-alt" /></>}
          </b></p>
        </Link>
        : <a href={props.href} target={props.target} onClick={(e) => (props.onClick && props.onClick(e))}>
          <p className="mx-3 my-0"><b>
            {props.title}{props.icon && <>{"\u00A0"}<i className="fas fa-external-link-alt" /></>}
          </b></p>
        </a>
      }
    </div>
  );
}

const MobileMenuTitle = (props) => {
  return (
    <h5 className={"mobile-menu-title mb-1 mt-3 " + (props.omit ? "omit-title" : "")}>
      {props.title}
    </h5>
  );
}

const MobileMenuHr = (props) => {
  if (props.top) {
    return <hr className="mb-1" />
  } else {
    return <hr className="mt-1 mb-0" />
  }
}