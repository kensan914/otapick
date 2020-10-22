import React from "react";
import { withRouterInnerRef } from "../modules/withRouterInnerRef";
import { Link } from "react-router-dom";
import { GROUPS } from "../modules/env";


// HIDE: location.pathname is "/blogs/:groupID", SHOW: location.pathname is "/search"
const hiddenFooterURLConditions = [
  "/blogs",
  "/images",
  "/image",
  "/",
  "/search/group/blog",
  "/search/member/blog",
]

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    }
    this.exclusiveKeys = [];
  }

  // 外部からフッターを表示する。引数にそのページのlocation
  applyShowFooter(location) {
    this.exclusiveKeys.push(location.key);
    if (location === this.props.location) {
      this.showFooter();
    }
  }

  showFooter() {
    if (!this.state.show) {
      this.setState({ show: true });
    }
  }

  hideFooter() {
    if (this.state.show) {
      this.setState({ show: false });
    }
  }

  checkFooter() {
    let haveToHide = false;
    for (const hiddenFooterURLCondition of hiddenFooterURLConditions) {
      if (hiddenFooterURLCondition === "/") {
        if (this.props.location.pathname === "/") {
          if (this.exclusiveKeys.indexOf(this.props.location.key) === -1) haveToHide = true;
          break;
        }
      }
      else if (this.props.location.pathname.startsWith(hiddenFooterURLCondition)) {
        if (this.exclusiveKeys.indexOf(this.props.location.key) === -1) haveToHide = true;
        break;
      }
    }
    // hide
    if (haveToHide) {
      this.hideFooter();
    }
    // show
    else {
      this.showFooter();
    }
  }

  componentDidMount() {
    this.checkFooter();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.checkFooter();
    }
  }

  render() {
    if (this.state.show) {
      return (
        <>
          <footer className={"footer bg-light text-muted " + this.props.class}>
            <div className="container">
              <div className="row">

                <div className="col-xl-3 col-lg-12 col-xs-12 text-center mb-5">
                  <Link className="navbar-brand ml-4 ml-xl-0" to="/" />
                </div>

                <div className="col-xl-3 col-lg-4 col-xs-12">
                  <ul className="footer-menu">
                    <span className="font-weight-bold">画像を探す</span>
                    <hr className="my-1 mr-4 mr-lg-0" />
                    {Object.values(GROUPS).map(groupObj => (
                      <li key={groupObj.id}>
                        <Link to={`/images/${groupObj.id}`}>{`${groupObj.name} 画像一覧`}</Link>
                      </li>
                    ))}
                    {Object.values(GROUPS).map(groupObj => (
                      <li key={groupObj.id}>
                        <Link to={`/blogs/${groupObj.id}`}>{`${groupObj.name} ブログ一覧`}</Link>
                      </li>
                    ))}
                    <li>
                      <Link to="/members">メンバーリスト</Link>
                    </li>
                  </ul>
                </div>

                <div className="col-xl-3 col-lg-4 col-xs-12">
                  <ul className="footer-menu">
                    <span className="font-weight-bold">公式リンク</span>
                    <hr className="my-1 mr-4 mr-lg-0" />
                    {Object.values(GROUPS).map(groupObj => (
                      <div key={groupObj.id}>
                        <li>
                          <a target="_blank" href={groupObj.blogUrl}>{`${groupObj.name} 公式ブログ `}<i className="fas fa-external-link-alt"></i></a>
                        </li>
                        <li>
                          <a target="_blank" href={groupObj.topUrl}>{`${groupObj.name} 公式サイト `}<i className="fas fa-external-link-alt"></i></a>
                        </li>
                      </div>
                    ))}
                  </ul>
                </div>

                <div className="col-xl-3 col-lg-4 col-xs-12">
                  <ul className="footer-menu">
                    <span className="font-weight-bold">ヲタピックについて</span>
                    <hr className="my-1 mr-4 mr-lg-0" />
                    <li>
                      <Link to="/contact">お問い合わせ</Link>
                    </li>
                    <li>
                      <Link to="/terms-of-service">利用規約</Link>
                    </li>
                    <li>
                      <Link to="/privacy-policy">プライバシーポリシー</Link>
                    </li>
                    <li>
                      <a target="_blank" href="https://twitter.com/otapick">公式Twitter<i
                        className="fas fa-external-link-alt"></i></a>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </footer>
          <div className="col-12 text-center py-4 text-muted" id="copyright">
            <p className="small m-0">Copyright &copy; otapick 2020 All rights reserved.</p>
          </div>
        </>
      );
    } else {
      return (<></>);
    }
  };
};


export default withRouterInnerRef(Footer);