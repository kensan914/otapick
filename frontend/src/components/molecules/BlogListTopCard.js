import React from 'react';
import NarrowButton from '../atoms/NarrowButton';
import SortButton from '../atoms/SortButton';
import NarrowCard from './NarrowCard';

class BlogListTopCard extends React.Component {
  render() {
    return (
      <>
        <div className="card my-4 otapick-card2">
          <div className="card-body px-sm-5 py-4">
            <div className="row mx-2 justify-content-between">
              <h3>{this.props.title}</h3>
              <div className="row ml-2">
                <span className="badge badge-success mr-2 badge-pill d-flex align-items-center"
                  style={{ backgroundColor: "rgba(50, 205, 50, 0.7)" }}>{this.props.narrowing_keyword}</span>
                <span className="badge badge-success mr-2 badge-pill d-flex align-items-center"
                  style={{ backgroundColor: "rgba(50, 205, 50, 0.7)" }}>{this.props.narrowing_date}</span>
              </div>
            </div>
            <hr />
            <div className="row justify-content-between">
              <div className="col-12 col-md-6 col-lg-7 col-xl-8">
                <div className="">検索結果（<b>{this.props.numOfHit}</b>件）</div>
              </div>
              <div className="col-12 col-md-6 col-lg-5 col-xl-4 mt-2 mt-md-0">
                <div className="row justify-content-around">
                  <NarrowButton />
                  <SortButton title="人気順" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <NarrowCard />
      </>
    );
  };
};

export default BlogListTopCard;