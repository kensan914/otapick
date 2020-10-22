import React from 'react';
import { isMobile } from '../modules/support';


class AdsenseCard extends React.Component {
  render() {
    return (
      <>
        <div className="image-card">
          <a target="_blank" href={this.props.url}>
            <div className={"image-card-wrapper " + (!isMobile ? "pc" : "")}>
              <img className={"image-card-img"} src={this.props.src} alt="ヲタピック公式Twitter広告" />
            </div>
          </a>
        </div>

        {(this.props.message) &&
          <div className="image-card-footer" >
            <div className={"image-card-message " + (isMobile ? "mobile" : "")}>
              {this.props.message &&
                <a target="_blank" href={this.props.url} style={{ textDecoration: "none" }}>
                  <div className={"card-message mx-auto py-2 " + (!isMobile ? "pc" : "")}>
                    <i className="fas fa-hashtag" style={{ color: "deepskyblue" }}></i>
                    {"\u00A0"}
                    <b>{this.props.message}</b>
                  </div>
                </a>
              }
            </div>
          </div>
        }
      </>
    );
  };
};

export default AdsenseCard;