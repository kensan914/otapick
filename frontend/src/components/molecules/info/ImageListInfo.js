import React from 'react';
import SortButton from '../../atoms/SortButton';
import axios from 'axios';
import { URLJoin } from '../../tools/support';
import { withRouter } from 'react-router-dom';
import { BASE_URL, DELAY_TIME } from '../../tools/env';


class ImageListInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      numOfHit: 0,
      sortButtonTitle: this.convertSortButtonTitle()
    }
    this.getBlogListInfo(this.props.groupID, this.props.ct);
  }

  getBlogListInfo(groupID, ct) {
    const queryParams = this.props.location.search;
    const url = URLJoin(BASE_URL, "api/images/info/", groupID, ct, queryParams);
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

  render() {
    return (
      <div>
        <div className={"card otapick-card2 my-4 " + this.props.group}>
          <div className="card-body px-sm-5 py-4">
            <h3 className="my-auto mx-2 d-flex align-items-center">{!this.state.title ? "\u00A0" : this.state.title}</h3>
            <hr />
            <div className="row justify-content-between">
              <div className="col-12 col-md-6 col-lg-7 col-xl-8">
                <div className="">検索結果（<b>{this.state.numOfHit}</b>件）</div>
              </div>
              <div className="col-12 col-md-6 col-lg-5 col-xl-4 mt-2 mt-md-0">
                <SortButton className="ml-auto" type="images" title={this.state.sortButtonTitle} pushHistory={this.props.pushHistory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default withRouter(ImageListInfo);