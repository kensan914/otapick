import React from 'react';
import NarrowButton from '../atoms/NarrowButton';
import SortButton from '../atoms/SortButton';
import NarrowCard from './NarrowCard';


class BlogSearchListInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: " ",
      numOfHit: 0,
    }
  }

  render() {
    // TODO
    return (
      <div>
        <div className={"card otapick-card2 my-4 " + this.props.group}>
          <div className="card-body px-sm-5 py-4">
            <div className="row mx-2 justify-content-between">
              <h3>{this.state.title}</h3>
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

export default BlogSearchListInfo;