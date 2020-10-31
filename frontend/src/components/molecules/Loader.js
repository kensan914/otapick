import React from "react";


export class HorizontalLoader extends React.Component {
  render() {
    return (
      <div className="loader-ellips infinite-scroll-request my-5" style={this.props.style}>
        <span className="loader-ellips__dot"></span>
        <span className="loader-ellips__dot"></span>
        <span className="loader-ellips__dot"></span>
        <span className="loader-ellips__dot"></span>
      </div>
    );
  }
}

export class BlogViewLoader extends React.Component {
  render() {
    return (
      <div className="container text-center mx-auto d-flex align-items-center" style={{ height: 400 }}>
        <div>

          <h2 className="ml-3 now-loading">Now Loading...</h2>

          <div className="write_box">
            <div className="img-wrap">
              <img src={this.props.loadingImageUrl} className="img-fluid mb-5 col-lg-5 col-md-8 col-11"
                alt="Responsive image" />
            </div>

            <div className="img-wrap-before">
            </div>
          </div>
          {this.props.progress !== null &&
            <div className="progress rounded-pill">
              <div className="progress-bar" id="progress" role="progressbar" aria-valuenow={this.props.progress}
                aria-valuemin="0" aria-valuemax="100" style={{ width: `${this.props.progress}%` }}>
              </div>
            </div>
          }

        </div>

      </div>
    );
  }
}

export class LoaderScreen extends React.Component {
  render() {
    let loader = <HorizontalLoader />;
    if (this.props.type === "horizontal") loader = <HorizontalLoader />;
    return (
      <div style={{ height: 300 }} className="d-flex align-items-center justify-content-center">
        {loader}
      </div>
    );
  }
}