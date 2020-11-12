import React from "react";
import Downshift from "downshift";
import axios from "axios";
import { URLJoin, isMobile, isSmp, lockScreen, unLockScreen, documentScrollHandler } from "../modules/utils";
import { NotFoundBlogsContent, NotFoundMembersContent } from "../atoms/NotFound";
import { withRouter } from "react-router-dom";
import { BASE_URL, DELAY_TIME, MOBILE_TOP_MENU_MT, NAVBAR_LS_ZINDEX } from "../modules/env";
import { Button } from "reactstrap";
import { HorizontalLoader } from "./Loader";


class SearchDownshift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenInit: false,
      isOpen: false,
      qvalue: "",
      initSuggestionsBlogs: [],
      initSuggestionsMembers: [],
      initSuggestionsStatus: "",
      suggestionsItems: [],
      suggestionsType: "",
      suggestionsStatus: "",
    }
    this.isCalledSetInitSearchSuggestions = false;
    this.isCallingSetSearchSuggestions = false;

    this.searchInputRef = React.createRef();
    this.lockScreenID = "searchdownshift";

    this.isRender = true;
  }

  setInitSearchSuggestions() {
    const url = URLJoin(BASE_URL, "searchSuggestions/init/");
    setTimeout(() => {
      axios
        .get(url)
        .then(res => {
          const initSuggestionsBlogs = res.data["blogs"].map((blog, index) =>
            ({
              title: blog.title,
              backgroundImage: blog.background_image,
              url: blog.url,
            })
          );
          const initSuggestionsMembers = res.data["members"].map((member, index) =>
            ({
              title: member.title,
              backgroundImage: member.background_image,
              url: member.url,
            })
          );
          this.setState({
            initSuggestionsBlogs: initSuggestionsBlogs,
            initSuggestionsMembers: initSuggestionsMembers,
            initSuggestionsStatus: "success",
          });
        })
        .catch(err => {
          console.log(err);
        })
    }, DELAY_TIME);
  }

  setSearchSuggestions() {
    const url = URLJoin(BASE_URL, "searchSuggestions/");
    setTimeout(() => {
      axios
        .get(url, { params: { q: this.state.qvalue } })
        .then(res => {
          if (res.data["status"] === "success") {
            const suggestionsItems = res.data["items"].map((item, index) =>
              ({
                title: item.title,
                backgroundImage: item.background_image,
                url: item.url,
              })
            );
            this.setState({
              suggestionsItems: suggestionsItems,
              suggestionsType: res.data["type"],
              suggestionsStatus: res.data["status"],
            });
          } else {
            this.setState({
              suggestionsItems: [],
              suggestionsType: res.data["type"],
              suggestionsStatus: res.data["status"],
            });
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => { this.isCallingSetSearchSuggestions = false; })
    }, DELAY_TIME);
  }

  onFocusInput() {
    if (this.state.qvalue) {
      if (!this.state.isOpen) {
        if (typeof this.props.navbarToggle != "undefined") this.props.navbarToggle();
        this.setState({ isOpenInit: false, isOpen: true });
      }
    } else {
      if (!this.state.isOpenInit) {
        if (typeof this.props.navbarToggle != "undefined") this.props.navbarToggle();
        this.setState({ isOpenInit: true, isOpen: false });
      }
    }
  }
  onChangeInput(inputValue) {
    if (inputValue !== null) this.setState({ qvalue: inputValue });
    if (inputValue) {
      this.setState({ isOpenInit: false, isOpen: true });
      if (!this.isCallingSetSearchSuggestions) {
        this.setSearchSuggestions();
        this.isCallingSetSearchSuggestions = true;
      }
    } else if (inputValue === "") {
      // 検索作業中にdeleteしてinputValueが0になった場合に限り、initDownshiftをview
      if (this.state.isOpen) this.setState({ isOpenInit: true, isOpen: false, suggestionsStatus: "" });
    }
  }

  // 検索作業を終了
  endSearchWork() {
    this.setState({ isOpenInit: false, isOpen: false });
    this.removeEventListeners();
  }

  resetInitSearchSuggestions = () => {
    this.setState({
      isOpenInit: false,
      initSuggestionsBlogs: [],
      initSuggestionsMembers: [],
      initSuggestionsStatus: "",
    })
    this.isCalledSetInitSearchSuggestions = false;
  }

  resetSearchSuggestions = () => {
    this.setState({
      isOpen: false,
      suggestionsItems: [],
      suggestionsType: "",
      suggestionsStatus: "",
    });
  }

  // 画面遷移時などに。初期状態に戻す。
  resetAll = () => {
    this.resetInitSearchSuggestions();
    this.resetSearchSuggestions();
    this.setState({ qvalue: "" });
    this.searchInputRef.current.blur();
    this.removeEventListeners();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.qvalue) {
      this.props.history.push("/search/?q=" + encodeURIComponent(this.state.qvalue));
    }
  }

  documentClickHandler = e => {
    // 他の箇所クリックしたとき、検索作業を終了
    if (e.target.closest("#search-input") == null && e.target.closest("#downshift-box") == null) {
      this.endSearchWork();
    }
  }

  documentTouchmoveHandler = e => {
    // スマホスクロール無効(menubox以外) https://qiita.com/noraworld/items/2834f2e6f064e6f6d41a
    const downshiftBox = document.getElementById("downshift-box");
    const searchSuggestionhBox = document.getElementById("search-suggestions-box");

    if (e.target.closest("#downshift-box") === downshiftBox && searchSuggestionhBox.scrollTop !== 0 && searchSuggestionhBox.scrollTop + searchSuggestionhBox.clientHeight !== searchSuggestionhBox.scrollHeight) {
      e.stopPropagation();
    } else {
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  }

  addEventListeners() {
    if (isMobile) {
      const searchSuggestionhBox = document.getElementById("search-suggestions-box");
      if (searchSuggestionhBox !== null) {
        document.addEventListener("mousewheel", documentScrollHandler, { passive: false });
        document.addEventListener("touchmove", this.documentTouchmoveHandler, { passive: false });
        searchSuggestionhBox.scrollTop = 1;
        // ↓ https://qiita.com/noraworld/items/2834f2e6f064e6f6d41a
        searchSuggestionhBox.addEventListener("scroll", e => {
          if (searchSuggestionhBox.scrollTop === 0) {
            searchSuggestionhBox.scrollTop = 1;
          }
          else if (searchSuggestionhBox.scrollTop + searchSuggestionhBox.clientHeight === searchSuggestionhBox.scrollHeight) {
            searchSuggestionhBox.scrollTop = searchSuggestionhBox.scrollTop - 1;
          }
        });
      }
    }
    document.addEventListener("mousedown", this.documentClickHandler);
  }

  removeEventListeners() {
    if (isMobile) {
      document.removeEventListener("mousewheel", documentScrollHandler, { passive: false });
      document.removeEventListener("touchmove", this.documentTouchmoveHandler, { passive: false });
    }
    document.removeEventListener("mousedown", this.documentClickHandler);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.isRender) {
      // InitDownshiftがviewされたとき
      if (prevState.isOpenInit !== this.state.isOpenInit && this.state.isOpenInit) {
        if (!this.isCalledSetInitSearchSuggestions) { this.setInitSearchSuggestions(); this.isCalledSetInitSearchSuggestions = true; }
        else this.addEventListeners();
        this.resetSearchSuggestions();
      }

      // Downshiftがviewされたとき
      if (prevState.isOpen !== this.state.isOpen && this.state.isOpen) {
      }

      // InitDownshiftまたはDownshiftがviewされたとき(検索作業が開始したとき)
      if (!prevState.isOpenInit && !prevState.isOpen && (this.state.isOpenInit || this.state.isOpen)) {
        lockScreen(this.lockScreenID, NAVBAR_LS_ZINDEX);
      }
      // InitDownshiftまたはDownshiftのviewが解除されたとき(検索作業が終了したとき)
      else if (!this.state.isOpenInit && !this.state.isOpen && (prevState.isOpenInit || prevState.isOpen)) {
        unLockScreen(this.lockScreenID);
      }

      // initSuggestionsのデータ読み込みが完了したとき
      if (prevState.initSuggestionsStatus.length === 0 && this.state.initSuggestionsStatus.length > 0) {
        this.addEventListeners();
      }
      // suggestionsのデータ読み込みが完了したとき
      else if (prevState.suggestionsStatus.length === 0 && this.state.suggestionsStatus.length > 0) {
        this.addEventListeners();
      }

      // 画面遷移したとき
      if (this.props.location !== prevProps.location) {
        this.resetAll();
        if (typeof this.props.resetNavBar != "undefined") this.props.resetNavBar();
      }
    }
  }

  componentWillUnmount() {
    this.isRender = false;
  }

  render() {
    let suggestionsMessage;
    const suggestionsMessageStyle = { borderRadius: "1rem" };
    if (this.state.suggestionsType === "url") {
      suggestionsMessage = this.state.suggestionsStatus === "success"
        ? <div className="alert alert-success search-suggestions-title" role="alert" style={suggestionsMessageStyle}>有効なURLです。以下のブログが検出されました。</div>
        : <NotFoundBlogsContent />
    } else if (this.state.suggestionsType === "member") {
      suggestionsMessage = this.state.suggestionsStatus === "success"
        ? <div className="alert alert-success search-suggestions-title" role="alert" style={suggestionsMessageStyle}>以下のメンバーが見つかりました。</div>
        : <NotFoundMembersContent />
    }

    let downshiftBoxStyle; // PC or mobile で表示位置の変更
    if (isMobile) {
      downshiftBoxStyle = { position: "fixed", top: MOBILE_TOP_MENU_MT };
    } else {
      downshiftBoxStyle = { position: "absolute" };
    }

    return (
      <Downshift
        onChange={selection => {
          this.props.history.push(selection.url);
        }}
        onInputValueChange={(inputValue) => {
          this.onChangeInput(inputValue);
        }}
        itemToString={() => null}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex,
          selectedItem,
        }) => (
            <div className={"my-0 justify-content-center col " + (isMobile ? "pr-2" : "")}>
              <form className="form-inline" autoComplete="off" onSubmit={this.handleSubmit.bind(this)}>
                <input {...getInputProps()} className="col form-control autocomplete rounded-pill" type="search" placeholder="検索する" value={this.state.qvalue}
                  aria-label="Search" onFocus={() => this.onFocusInput()} id="search-input" ref={this.searchInputRef} maxLength="100"></input>
              </form>

              <div {...getMenuProps()} style={downshiftBoxStyle} id="downshift-box" className={isMobile ? "mobile" : ""}>
                {this.state.isOpenInit &&
                  <div className={"container text-muted border search-suggestions-box " + (isMobile ? "mobile " : " ") + (isSmp ? "px-2 smp" : "")}
                    style={{ overflowY: "auto", overflowX: "hidden" }} id="search-suggestions-box">
                    {isMobile &&
                      <Button className="rounded-circle transparent-button-mobile float-right mt-1"
                        onClick={() => this.endSearchWork()}>
                        <i className="fas fa-times" />
                      </Button>
                    }
                    <div className={"mt-3 " + (isSmp ? "mb-2" : "mb-4")}>
                      <h5 className="search-suggestions-title">検索方法</h5>
                      <p className="mx-2 search-suggestions-discription"><b>メンバーの名前</b>、または<b>公式ブログのURL</b>を入力してください。</p>
                      <hr className="mb-0" />
                      <h5 className="my-2 search-suggestions-title">メンバーから画像を探す</h5>
                      <div className={"row " + (isSmp ? "mx-0" : "mx-1")}>
                        {this.state.initSuggestionsMembers.length > 0
                          ? this.state.initSuggestionsMembers
                            .map((item, index) => (
                              <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3" style={{ padding: 0 }}>
                                <div className="m-1 search-suggestions-items"
                                  {...getItemProps({
                                    key: item.id,
                                    index,
                                    item,
                                    style: {
                                      fontWeight: selectedItem === item ? "bold" : "normal",
                                      backgroundImage: item.backgroundImage !== null ? `url(${item.backgroundImage})` : "",
                                      position: "relative",
                                      height: 100,
                                      backgroundSize: "cover",
                                    },
                                  })}
                                >
                                  <div className="d-flex align-items-center justify-content-center search-suggestions-items-wraper"
                                    style={{ backgroundColor: highlightedIndex === index ? "rgba( 0, 0, 0, 0.5 )" : "rgba( 0, 0, 0, 0.25 )", position: "absolute" }} >
                                    <div className="text-center" style={{ color: "white", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3, overflow: "hidden", width: "80%" }}><b>{item.title}</b></div>
                                  </div>
                                </div>
                              </div>
                            ))
                          : <HorizontalLoader />
                        }
                      </div>
                      <hr className="mb-0" />
                      <h5 className="my-2 search-suggestions-title">新着・人気ブログ</h5>
                      <div className={"row " + (isSmp ? "mx-0" : "mx-1")}>
                        {this.state.initSuggestionsBlogs.length > 0
                          ? this.state.initSuggestionsBlogs
                            .map((item, index) => (
                              <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3" style={{ padding: 0 }}>
                                <div className="m-1 search-suggestions-items"
                                  {...getItemProps({
                                    key: item.id,
                                    index: index + 6,
                                    item,
                                    style: {
                                      fontWeight: selectedItem === item ? "bold" : "normal",
                                      backgroundImage: item.backgroundImage !== null ? `url(${item.backgroundImage})` : "",
                                      position: "relative",
                                      height: 100,
                                      backgroundSize: "cover",
                                    },
                                  })}
                                >
                                  <div className="d-flex align-items-center justify-content-center search-suggestions-items-wraper"
                                    style={{ backgroundColor: highlightedIndex === index + 6 ? "rgba( 0, 0, 0, 0.5 )" : "rgba( 0, 0, 0, 0.25 )", position: "absolute" }} >
                                    <div className="text-center" style={{ color: "white", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3, overflow: "hidden", width: "80%" }}><b>{item.title}</b></div>
                                  </div>
                                </div>
                              </div>
                            ))
                          : <HorizontalLoader />
                        }
                      </div>
                    </div>
                  </div>
                }

                {!this.state.isOpen || this.state.isOpenInit ? null : (
                  <div className={"container text-muted border search-suggestions-box " + (isSmp ? "px-2 " : "") + (!isMobile ? "py-2 " : "mobile ") + ((!isSmp && isMobile) ? "pb-2" : "")}
                    style={{ overflowY: "auto", overflowX: "hidden" }} id="search-suggestions-box">
                    {isMobile &&
                      <div className="col text-right p-0">
                        <Button className="rounded-circle transparent-button-mobile mt-1"
                          onClick={() => this.endSearchWork()}>
                          <i className="fas fa-times" />
                        </Button>
                      </div>
                    }
                    <div className={"mb-3 " + (!isMobile ? "mt-2" : "")}>
                      {suggestionsMessage}
                      <div className="row mx-1">
                        {this.state.suggestionsStatus === "" && <HorizontalLoader />}
                        {
                          this.state.suggestionsItems
                            .map((item, index) => (
                              <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3" style={{ padding: 0 }}>
                                <div className="m-1 search-suggestions-items"
                                  {...getItemProps({
                                    key: item.id,
                                    index,
                                    item,
                                    style: {
                                      fontWeight: selectedItem === item ? "bold" : "normal",
                                      backgroundImage: item.backgroundImage !== null ? `url(${item.backgroundImage})` : "",
                                      position: "relative",
                                      height: 100,
                                      backgroundSize: "cover",
                                    },
                                  })}
                                >
                                  <div className="d-flex align-items-center justify-content-center search-suggestions-items-wraper"
                                    style={{ backgroundColor: highlightedIndex === index ? "rgba( 0, 0, 0, 0.5 )" : "rgba( 0, 0, 0, 0.25 )", position: "absolute" }} >
                                    <div className="text-center" style={{ color: "white", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3, overflow: "hidden", width: "80%" }}><b>{item.title}</b></div>
                                  </div>
                                </div>
                              </div>
                            ))
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
      </Downshift>
    );
  };
};

export default withRouter(SearchDownshift);