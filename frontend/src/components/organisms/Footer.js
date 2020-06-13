import React from 'react';
import { withRouter } from 'react-router-dom';

// HIDE: location.pathname is "/blogs/:groupID", SHOW: location.pathname is "/search"
const hiddenFooterURLConditions = [
  "/blogs",
]

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      let haveToHide = false;
      for (const hiddenFooterURLCondition of hiddenFooterURLConditions) {
        if (this.props.location.pathname.startsWith(hiddenFooterURLCondition)) {
          haveToHide = true;
          break;
        }
      }
      // hide
      if (haveToHide) {
        if (this.state.show) {
          this.setState({ show: false });
        }
      }
      // show
      else {
        if (!this.state.show) {
          this.setState({ show: true });
        }
      }
    }
  }

  render() {
    if (this.state.show) {
      return (
        <>
          <footer className="footer bg-light text-muted">
            <div className="container">
              <div className="row">

                <div className="col-xl-3 col-lg-12 col-xs-12 text-center mb-5">
                  <a className="navbar-brand ml-4 ml-xl-0" href=""></a>
                </div>

                <div className="col-xl-3 col-lg-4 col-xs-12">
                  <ul className="footer-menu">
                    <span className="font-weight-bold">ブログを探す</span>
                    <hr className="my-1 mr-4 mr-lg-0" />
                    <li>
                      <a href="">欅坂46 ブログ一覧</a>
                    </li>
                    <li>
                      <a href="">日向坂46 ブログ一覧</a>
                    </li>
                    <li>
                      <a href="">新着ブログ</a>
                    </li>
                    <li>
                      <a href="">人気ブログ</a>
                    </li>
                    <li>
                      <a href="">メンバーリスト</a>
                    </li>
                  </ul>
                </div>

                <div className="col-xl-3 col-lg-4 col-xs-12">
                  <ul className="footer-menu">
                    <span className="font-weight-bold">公式リンク</span>
                    <hr className="my-1 mr-4 mr-lg-0" />
                    <li>
                      <a target="_blank" href="https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000">欅坂46 公式ブログ <i
                        className="fas fa-external-link-alt"></i></a>
                    </li>
                    <li>
                      <a target="_blank" href="https://www.keyakizaka46.com/s/k46o/?ima=0000">欅坂46 公式サイト <i
                        className="fas fa-external-link-alt"></i></a>
                    </li>
                    <li>
                      <a target="_blank" href="https://www.hinatazaka46.com/s/official/diary/member?ima=0000">日向坂46 公式ブログ <i
                        className="fas fa-external-link-alt"></i></a>
                    </li>
                    <li>
                      <a target="_blank" href="https://www.hinatazaka46.com/s/official/?ima=0000">日向坂46 公式サイト <i
                        className="fas fa-external-link-alt"></i></a>
                    </li>
                  </ul>
                </div>

                <div className="col-xl-3 col-lg-4 col-xs-12">
                  <ul className="footer-menu">
                    <span className="font-weight-bold">ヲタピックについて</span>
                    <hr className="my-1 mr-4 mr-lg-0" />
                    <li>
                      <a href="">つかい方</a>
                    </li>
                    <li>
                      <a href="">サポート</a>
                    </li>
                    <li>
                      <a href="">お問い合わせ</a>
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


export default withRouter(Footer);