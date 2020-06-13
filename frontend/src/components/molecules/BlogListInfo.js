import React from 'react';
import NarrowButton from '../atoms/NarrowButton';
import SortButton from '../atoms/SortButton';
import NarrowCard from './NarrowCard';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import { withRouter } from 'react-router-dom';


class BlogListInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      numOfHit: 0,
      sortButtonTitle: this.convertSortButtonTitle()
    }
    this.setBlogListInfo(this.props.groupID, this.props.ct);
  }

  setBlogListInfo(groupID, ct) {
    const queryParams = this.props.location.search;
    const url = URLJoin(this.props.baseURL, "api/blogs/info/", groupID, ct, queryParams);
    console.log('info', url);

    setTimeout(() => {
      axios
        .get(url)
        .then(res => {
          this.setState({
            title: res.data.title,
            numOfHit: res.data.num_of_hit,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }, 500);
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

  render() {
    var badgeStyle;
    if (this.props.group === "keyaki") badgeStyle = { backgroundColor: "rgba(50, 205, 50, 0.7)" };
    else if (this.props.group === "hinata") badgeStyle = { backgroundColor: "rgba(0, 191, 255, 0.75)" };

    return (
      <div>
        <div className={"card otapick-card2 my-4 " + this.props.group}>
          <div className="card-body px-sm-5 py-4">
            <div className="row mx-2 justify-content-between">
              <h3 className="my-auto d-flex align-items-center">{!this.state.title ? "\u00A0" : this.state.title}</h3>
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
            <hr />
            <div className="row justify-content-between">
              <div className="col-12 col-md-6 col-lg-7 col-xl-8">
                <div className="">検索結果（<b>{this.state.numOfHit}</b>件）</div>
              </div>
              <div className="col-12 col-md-6 col-lg-5 col-xl-4 mt-2 mt-md-0">
                <div className="row justify-content-around">
                  <NarrowButton />
                  <SortButton title={this.state.sortButtonTitle} pushHistory={this.props.pushHistory} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <NarrowCard group={this.props.group} pushHistory={this.props.pushHistory} />
      </div>
    );
  };
};

export default withRouter(BlogListInfo);