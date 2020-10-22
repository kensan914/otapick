import React from 'react';
import SortButton from '../../atoms/SortButton';
import axios from 'axios';
import { URLJoin, isSmp, isMobile, updateMeta, generateKeepAliveNameInfo, gtagTo } from '../../modules/support';
import { withRouter } from 'react-router-dom';
import { BASE_URL, DELAY_TIME, IMAGES_DISCRIPTION, HOME_TITLE } from '../../modules/env';
import { MobileBottomMenu } from '../MobileMenu';


class ImageListInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      numOfHit: 0,
      sortButtonTitle: this.convertSortButtonTitle(),
      metaTitle: "",
    }
    this.getBlogListInfo(this.props.groupID, this.props.ct);
  }

  getBlogListInfo(groupID, ct) {
    const queryParams = this.props.location.search;
    const url = URLJoin(BASE_URL, "api/images/info/", groupID, ct, queryParams);

    setTimeout(() => {
      axios
        .get(url)
        .then(res => {
          if (res.data.status) {
            this.setState({
              title: "画像が見つかりませんでした。",
              numOfHit: 0,
              status: "not_found",
              metaTitle: this.props.home ? HOME_TITLE : "Not Found Image",
            });
            if (this.props.keepAliveNameInfo === generateKeepAliveNameInfo(this.props.location.key)) {
              if (!this.props.home) updateMeta({ title: "Not Found Image", discription: IMAGES_DISCRIPTION });
              else updateMeta({ title: HOME_TITLE, discription: "" });
            }
          } else {
            this.setState({
              title: res.data.title,
              numOfHit: res.data.num_of_hit,
              status: "success",
              metaTitle: this.props.home ? HOME_TITLE : res.data.meta_title,
            });
            if (this.props.keepAliveNameInfo === generateKeepAliveNameInfo(this.props.location.key)) {
              if (!this.props.home) updateMeta({ title: `${res.data.meta_title}の画像・写真一覧`, discription: IMAGES_DISCRIPTION });
              else updateMeta({ title: HOME_TITLE, discription: "" });
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          gtagTo(this.props.location.pathname);
        });
    }, DELAY_TIME);
  }

  convertSortButtonTitle() {
    switch (this.props.orderFormat) {
      case "recommend":
        return "おすすめ順";
      case 'newer_post':
        return '新着順';
      case 'older_post':
        return '古い順';
      case 'popularity':
        return '人気順';
      case 'dl':
        return 'DL順';
      case 'view':
        return '閲覧数順';
      default:
        return '';
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.keepAliveNameInfo === generateKeepAliveNameInfo(this.props.location.key)) {
      if (this.props.location !== prevProps.location) {
        if (!this.props.home) updateMeta({ title: `${this.state.metaTitle}の画像・写真一覧`, discription: IMAGES_DISCRIPTION });
        else updateMeta({ title: this.state.metaTitle, discription: "" });
      }
    }
  }

  render() {
    return (
      <>
        {!this.props.hide &&
          <div>
            <div className={"card otapick-card2 " + (isSmp ? "smp mb-3 " : (isMobile ? "mb-3 mt-1 " : "my-4 ")) + this.props.group}>
              <div className="card-body px-4 px-sm-5 py-4">
                <h2 className="my-auto mx-2 d-flex align-items-center">{!this.state.title ? "\u00A0" : this.state.title}</h2>
                <hr className="info-hr" />
                <div className="row justify-content-between">
                  <div className="col-12 col-md-6 col-lg-7 col-xl-8">
                    <div className="info-discription my-1 my-sm-0">検索結果（<b>{this.state.numOfHit}</b>件）</div>
                  </div>

                  {this.state.status === "success" &&
                    <div className="col-12 col-md-6 col-lg-5 col-xl-4 mt-2 mt-md-0">
                      {isMobile
                        ? <MobileBottomMenu id="sortImage" type="sortImage" sortButtonTitle={this.state.sortButtonTitle} pushHistory={this.props.pushHistory}
                          className={isSmp ? "mx-auto" : "ml-auto"} style={isSmp ? { width: "90%" } : { width: "9rem" }} />
                        : <SortButton className={isSmp ? "mx-auto" : "ml-auto"} type="images" title={this.state.sortButtonTitle}
                          pushHistory={this.props.pushHistory} style={isSmp ? { width: "90%" } : { width: "9rem" }} />
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </>
    );
  };
};

export default withRouter(ImageListInfo);