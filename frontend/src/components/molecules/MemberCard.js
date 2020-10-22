import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { generateAlt, isMobile } from '../modules/utils';
import { MobileBottomMenu } from './MobileMenu';


const DetailButton = (props) => {
  return (
    <UncontrolledDropdown className="text-center mx-auto py-3" style={{ overflowY: "visible" }}>
      <div className="card-detail-button-super">
        <DropdownToggle color="light" className="p-0 card-detail-button rounded-circle">
          <i className="fas fa-bars" style={{ color: "gray" }}></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem tag={Link} to={props.url["images"]}>画像一覧へ</DropdownItem>
          <DropdownItem tag={Link} to={props.url["blogs"]}>ブログ一覧へ</DropdownItem>
          <DropdownItem href={props.officialUrl} target="_blank">公式サイトで確認</DropdownItem>
        </DropdownMenu>
      </div>
    </UncontrolledDropdown>
  );
};


class MemberCard extends React.Component {
  render() {
    return (
      <>
        <div className={"member-card mx-auto " + this.props.belongingGroup}>
          <div className={"member-card-header " + (!isMobile ? "pc" : "")} onClick={() => { this.props.history.push(this.props.url["images"]); }}>
            <div className="member-card-overlay"
              style={{ backgroundImage: `url(${this.props.image})` }}>
            </div>
            <img src={this.props.image} className="mb-3 mb-sm-4" alt={generateAlt(this.props.belongingGroup, (this.props.lastKanji + this.props.firstKanji), "member")} />
            <h4 className="m-0">{this.props.lastKanji} {this.props.firstKanji}</h4>
            <p style={{ color: "whitesmoke" }}>{this.props.lastKana} {this.props.firstKana}</p>
          </div>

          <svg className="waves" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x={this.props.wavesVals[0]} y="0" fill="rgba(255,255,255,0.7)" />
              <use xlinkHref="#gentle-wave" x={this.props.wavesVals[1]} y="3" fill="rgba(255,255,255,0.5)" />
              <use xlinkHref="#gentle-wave" x={this.props.wavesVals[2]} y="5" fill="rgba(255,255,255,0.3)" />
              <use xlinkHref="#gentle-wave" x={this.props.wavesVals[3]} y="7" fill="rgba(255,255,255)" />
            </g>
          </svg>

          <div className="member-card-body">
            {isMobile
              ? <MobileBottomMenu id={this.props.id} type="memberCard" title={`${this.props.lastKanji} ${this.props.firstKanji}`}
                url={this.props.url} officialUrl={this.props.officialUrl} className="mx-auto py-3" />
              : <DetailButton url={this.props.url} officialUrl={this.props.officialUrl} />
            }
          </div>
        </div>
        {this.props.message &&
          <div className="card-message mx-auto py-2">
            <i className="fas fa-crown" style={{ color: "gold" }}></i>
            {"\u00A0"}
            <b>{this.props.message}</b>
          </div>
        }
      </>
    );
  }
}

export default withRouter(MemberCard);