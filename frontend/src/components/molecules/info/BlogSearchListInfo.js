import React from 'react';


export class BlogSearchListInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className={"card otapick-card2 my-4 " + this.props.group}>
          <div className="card-body px-sm-5 py-4">
            <div className="row mx-2 justify-content-between">
              <h3 className="my-auto d-flex align-items-center">{!this.props.title ? "\u00A0" : this.props.title}</h3>
            </div>
            <hr />
            <div className="row justify-content-between">
              <div className="col-12 col-md-6 col-lg-7 col-xl-8">
                <div className="">検索結果（<b>{this.props.numOfHit}</b>件）</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
};

export default BlogSearchListInfo;