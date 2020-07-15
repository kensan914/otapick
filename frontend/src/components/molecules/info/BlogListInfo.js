import React from 'react';
import NarrowButton from '../../atoms/NarrowButton';
import SortButton from '../../atoms/SortButton';
import NarrowCard from '../NarrowCard';
import axios from 'axios';
import { URLJoin, isSmp, isMobile, updateMeta, generateKeepAliveNameInfo, gtagTo } from '../../tools/support';
import { withRouter } from 'react-router-dom';
import { BASE_URL, DELAY_TIME, BLOGS_DISCRIPTION } from '../../tools/env';
import { MobileBottomMenu } from '../MobileMenu';


class BlogListInfo extends React.Component {
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
    const url = URLJoin(BASE_URL, "api/blogs/info/", groupID, ct, queryParams);

    setTimeout(() => {
      axios
        .get(url)
        .then(res => {
          if (res.data.status) {
            this.setState({
              title: "ブログが見つかりませんでした。",
              numOfHit: 0,
              status: "not_found",
              metaTitle: "Not Found Blog"
            });
            if (this.props.keepAliveNameInfo === generateKeepAliveNameInfo(this.props.location.key))
              updateMeta({ title: "Not Found Blog", discription: BLOGS_DISCRIPTION });
          } else {
            this.setState({
              title: res.data.title,
              numOfHit: res.data.num_of_hit,
              status: "success",
              metaTitle: res.data.meta_title,
            });
            if (this.props.keepAliveNameInfo === generateKeepAliveNameInfo(this.props.location.key))
              updateMeta({ title: `${res.data.meta_title}のブログ一覧`, discription: BLOGS_DISCRIPTION });
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
      case 'newer_post':
        return '新着順';
      case 'older_post':
        return '古い順';
      case 'popularity':
        return '人気順';
      case 'dl':
        return 'DL順';
      case 'sum_dl':
        return '総DL順';
      case 'view':
        return '閲覧数順';
      default:
        return '';
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.keepAliveNameInfo === generateKeepAliveNameInfo(this.props.location.key)) {
      if (this.props.location !== prevProps.location) {
        updateMeta({ title: `${this.state.metaTitle}のブログ一覧`, discription: BLOGS_DISCRIPTION });
      }
    }
  }

  render() {
    var badgeStyle;
    if (this.props.group === "keyaki") badgeStyle = { backgroundColor: "rgba(50, 205, 50, 0.7)", height: 33 };
    else if (this.props.group === "hinata") badgeStyle = { backgroundColor: "rgba(0, 191, 255, 0.75)", height: 33 };

    return (
      <>
        {!this.props.hide &&
          <div>
            <div className={"card otapick-card2 " + (isSmp ? "smp mb-3 " : (isMobile ? "mb-3 mt-1 " : "my-4 ")) + this.props.group}>
              <div className="card-body px-4 px-sm-5 py-4">
                <div className="row mx-2 justify-content-between">
                  <h2 className="my-auto d-flex align-items-center" id="blog-list-info-title">{!this.state.title ? "\u00A0" : this.state.title}</h2>
                  <div className="row ml-2">
                    {this.props.narrowingKeyword &&
                      <span className="badge badge-success mr-2 badge-pill d-flex align-items-center"
                        style={badgeStyle}>"{this.props.narrowingKeyword}"</span>
                    }
                    {this.props.narrowingPost &&
                      <span className="badge badge-success mr-2 badge-pill d-flex align-items-center"
                        style={badgeStyle}>{this.props.narrowingPost}</span>
                    }
                  </div>
                </div>
                <hr className="info-hr" />
                <div className="row justify-content-between">
                  <div className="col-12 col-md-6 col-lg-7 col-xl-8">
                    <div className="info-discription my-1 my-sm-0">検索結果（<b>{this.state.numOfHit}</b>件）</div>
                  </div>

                  {this.state.status === "success" &&
                    <div className="col-12 col-md-6 col-lg-5 col-xl-4 mt-2 mt-md-0">
                      <div className="row justify-content-around">
                        <NarrowButton />
                        {isMobile
                          ? <MobileBottomMenu id="sortBlog" type="sortBlog" sortButtonTitle={this.state.sortButtonTitle} pushHistory={this.props.pushHistory}
                            className="col-5" />
                          : <SortButton className="col-5" type="blogs" title={this.state.sortButtonTitle} pushHistory={this.props.pushHistory} />
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
            {this.state.status === "success" &&
              <NarrowCard group={this.props.group} pushHistory={this.props.pushHistory} />
            }
          </div>
        }
      </>
    );
  };
};

export default withRouter(BlogListInfo);