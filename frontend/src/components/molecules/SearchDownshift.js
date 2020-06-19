import React from 'react';
import Downshift from 'downshift';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import { NotFoundBlogsContent, NotFoundMembersContent } from '../atoms/NotFound';
import { withRouter } from 'react-router-dom';
import { BASE_URL } from '../tools/env';


class SearchDownshift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenInit: false,
      isOpen: false,
      qvalue: "",
      initSuggestionsBlogs: [],
      initSuggestionsMembers: [],
      suggestionsItems: [],
      suggestionsType: "",
      suggestionsStatus: "",
    }
    this.isCalledSetInitSearchSuggestions = false;
    this.isCallingSetSearchSuggestions = false;

    this.searchInputRef = React.createRef();
  }

  setInitSearchSuggestions() {
    const url = URLJoin(BASE_URL, "api/searchSuggestions/init/");
    setTimeout(() => {
      axios
        .get(url)
        .then(res => {
          const initSuggestionsBlogs = res.data['blogs'].map((blog, index) =>
            ({
              title: blog.title,
              backgroundImage: blog.background_image,
              url: blog.url,
            })
          );
          const initSuggestionsMembers = res.data['members'].map((member, index) =>
            ({
              title: member.title,
              backgroundImage: member.background_image,
              url: member.url,
            })
          );
          this.setState({
            initSuggestionsBlogs: initSuggestionsBlogs,
            initSuggestionsMembers: initSuggestionsMembers,
          });
        })
        .catch(err => {
          console.log(err);
        })
    }, 100);
  }

  setSearchSuggestions() {
    const url = URLJoin(BASE_URL, "api/searchSuggestions/");
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
    }, 100);
  }

  onFocusInput() {
    if (this.state.qvalue) {
      if (!this.state.isOpen) { this.setState({ isOpenInit: false, isOpen: true }); }
    } else {
      if (!this.state.isOpenInit) { this.setState({ isOpenInit: true, isOpen: false }); }
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
      if (this.state.isOpen) this.setState({ isOpenInit: true, isOpen: false });
    }
  }

  documentClickHandler = e => {
    // 他の箇所クリックしたとき、検索作業を終了
    if (e.target.closest("#search-input") == null && e.target.closest("#downshift-box") == null) {
      this.setState({ isOpenInit: false, isOpen: false });
      document.removeEventListener('click', this.documentClickHandler);
    }
  }

  resetInitSearchSuggestions = () => {
    this.setState({
      isOpenInit: false,
      initSuggestionsBlogs: [],
      initSuggestionsMembers: [],
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
  }

  lockScreen = () => {
    if (document.getElementById("lock-screen-wrapper") === null) {
      let lockScreenWrapper = document.createElement("div");
      lockScreenWrapper.setAttribute("id", "lock-screen-wrapper");
      document.body.appendChild(lockScreenWrapper);
    }
  }
  unLockScreen = () => {
    const lockScreenWrapper = document.getElementById("lock-screen-wrapper");
    if (lockScreenWrapper !== null) lockScreenWrapper.remove();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.qvalue) {
      this.props.history.push('/search/?q=' + encodeURIComponent(this.state.qvalue));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // InitDownshiftがviewされたとき
    if (prevState.isOpenInit !== this.state.isOpenInit && this.state.isOpenInit) {
      if (!this.isCalledSetInitSearchSuggestions) { this.setInitSearchSuggestions(); this.isCalledSetInitSearchSuggestions = true; }
      this.resetSearchSuggestions();
      document.addEventListener('click', this.documentClickHandler);
    }

    // Downshiftがviewされたとき
    if (prevState.isOpen !== this.state.isOpen && this.state.isOpen) {
      document.addEventListener('click', this.documentClickHandler);
    }

    // InitDownshiftまたはDownshiftがviewされたとき(検索作業が開始したとき)
    if (!prevState.isOpenInit && !prevState.isOpen && (this.state.isOpenInit || this.state.isOpen)) {
      this.lockScreen();
    }
    // InitDownshiftまたはDownshiftのviewが解除されたとき(検索作業が終了したとき)
    else if (!this.state.isOpenInit && !this.state.isOpen && (prevState.isOpenInit || prevState.isOpen)) {
      this.unLockScreen();
    }

    // 画面遷移したとき
    if (this.props.location !== prevProps.location) {
      this.resetAll();
      this.props.resetNavBar();
    }
  }

  render() {
    let suggestionsMessage;
    const suggestionsMessageStyle = { borderRadius: "1rem" };
    if (this.state.suggestionsType === "url") {
      suggestionsMessage = this.state.suggestionsStatus === "success"
        ? <div className="alert alert-success" role="alert" style={suggestionsMessageStyle}>有効なURLです。以下のブログが検出されました。</div>
        : <NotFoundBlogsContent />
    } else if (this.state.suggestionsType === "member") {
      suggestionsMessage = this.state.suggestionsStatus === "success"
        ? <div className="alert alert-success" role="alert" style={suggestionsMessageStyle}>以下のメンバーが見つかりました。</div>
        : <NotFoundMembersContent />
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
            <div className="mt-3 mb-2 my-lg-0 justify-content-center col">
              <form className="form-inline" autoComplete="off" onSubmit={this.handleSubmit.bind(this)}>
                <input {...getInputProps()} className="col form-control autocomplete rounded-pill" type="search" placeholder="Search" value={this.state.qvalue}
                  aria-label="Search" onFocus={() => this.onFocusInput()} id="search-input" ref={this.searchInputRef} maxlength='100'></input>
              </form>

              <div {...getMenuProps()} style={{ "position": "absolute" }} id="downshift-box">
                {this.state.isOpenInit &&
                  <div className="container text-muted border search-suggestions-box"
                    style={{ overflowY: "auto", overflowX: "hidden" }}>
                    <div className="mt-3 mb-4">
                      <h5>検索方法</h5>
                      <p className="mx-2"><b>メンバーの名前</b>、または<b>公式ブログのURL</b>を入力してください。</p>
                      <hr className="mb-0" />
                      <h5 className="my-2">メンバー</h5>
                      <div className="row mx-1">
                        {
                          this.state.initSuggestionsMembers
                            .map((item, index) => (
                              <div className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3" style={{ padding: 0 }}>
                                <div className="m-1 search-suggestions-items"
                                  {...getItemProps({
                                    key: item.id,
                                    index,
                                    item,
                                    style: {
                                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                                      backgroundImage: item.backgroundImage !== null ? `url(${item.backgroundImage})` : '',
                                      position: "relative",
                                      height: 100,
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
                      <hr className="mb-0" />
                      <h5 className="my-2">新着・人気ブログ</h5>
                      <div className="row mx-1">
                        {
                          this.state.initSuggestionsBlogs
                            .map((item, index) => (
                              <div className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3" style={{ padding: 0 }}>
                                <div className="m-1 search-suggestions-items"
                                  {...getItemProps({
                                    key: item.id,
                                    index: index + 6,
                                    item,
                                    style: {
                                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                                      backgroundImage: item.backgroundImage !== null ? `url(${item.backgroundImage})` : '',
                                      position: "relative",
                                      height: 100,
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
                        }
                      </div>
                    </div>
                  </div>
                }

                {!this.state.isOpen || this.state.isOpenInit ? null : (
                  <div className="container text-muted border py-2 search-suggestions-box"
                    style={{ overflowY: "auto", overflowX: "hidden" }}>
                    <div className="mt-2 mb-3">
                      {suggestionsMessage}
                      <div className="row mx-1">
                        {
                          this.state.suggestionsItems
                            .map((item, index) => (
                              <div className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3" style={{ padding: 0 }}>
                                <div className="m-1 search-suggestions-items"
                                  {...getItemProps({
                                    key: item.id,
                                    index,
                                    item,
                                    style: {
                                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                                      backgroundImage: item.backgroundImage !== null ? `url(${item.backgroundImage})` : '',
                                      position: "relative",
                                      height: 100,
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