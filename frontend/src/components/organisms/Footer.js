import React from 'react';
import { withRouterInnerRef } from '../tools/withRouterInnerRef';
import { Link } from 'react-router-dom';


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
                    <li>
                      <Link to="/images/1">欅坂46 画像一覧</Link>
                    </li>
                    <li>
                      <Link to="/images/2">日向坂46 画像一覧</Link>
                    </li>
                    <li>
                      <Link to="/blogs/1">欅坂46 ブログ一覧</Link>
                    </li>
                    <li>
                      <Link to="/blogs/2">日向坂46 ブログ一覧</Link>
                    </li>
                    <li>
                      <Link to="/members">メンバーリスト</Link>
                    </li>
                  </ul>
                </div>

                <div className="col-xl-3 col-lg-4 col-xs-12">
                  <ul className="footer-menu">
                    <span className="font-weight-bold">公式リンク</span>
                    <hr className="my-1 mr-4 mr-lg-0" />
                    <li>
                      <a target="_blank" href="https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000">
                        欅坂46 公式ブログ<i className="fas fa-external-link-alt"></i>
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://www.keyakizaka46.com/s/k46o/?ima=0000">
                        欅坂46 公式サイト <i className="fas fa-external-link-alt"></i>
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://www.hinatazaka46.com/s/official/diary/member?ima=0000">
                        日向坂46 公式ブログ <i className="fas fa-external-link-alt"></i>
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://www.hinatazaka46.com/s/official/?ima=0000">
                        日向坂46 公式サイト <i className="fas fa-external-link-alt"></i>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-xl-3 col-lg-4 col-xs-12">
                  <ul className="footer-menu">
                    <span className="font-weight-bold">ヲタピックについて</span>
                    <hr className="my-1 mr-4 mr-lg-0" />
                    {/* <li>
                      <a href="">つかい方</a>
                    </li>
                    <li>
                      <a href="">サポート</a>
                    </li>
                    <li>
                      <a href="">お問い合わせ</a>
                    </li> */}
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