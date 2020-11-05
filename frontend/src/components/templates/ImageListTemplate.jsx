import React from "react";
import ImageList from '../organisms/List/ImageList';
import Headline from '../molecules/Headline';
import queryString from 'query-string';
import { KeepAlive } from 'react-keep-alive';
import ToTopButton from "../atoms/ToTopButton";
import { URLJoin, getGroup, generateKeepAliveName, generateKeepAliveNameInfo, checkMatchParams, isMobile } from '../modules/utils';
import ImageListInfo from "../molecules/info/ImageListInfo";
import { withRouter } from "react-router-dom";


class ImageListTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.isRender = checkMatchParams(props.history, props.match.params.groupID, props.match.params.ct);

    const qs = queryString.parse(props.location.search);
    this.state = {
      group: getGroup(props.match.params.groupID),
      groupID: props.match.params.groupID,
      orderFormat: typeof qs.sort == "undefined" ? "recommend" : qs.sort,
      ct: props.match.params.ct,
      keepAliveName: generateKeepAliveName(props.location.key),
      keepAliveNameInfo: generateKeepAliveNameInfo(props.location.key),
    }
  };

  pushHistory(qs) {
    const currentQs = queryString.parse(this.props.location.search);
    if (!qs.sort) { delete currentQs.keyword; delete currentQs.post; }
    const queryParamsHash = Object.assign(currentQs, qs);
    let queryParams = "";
    Object.keys(queryParamsHash).forEach((qsKey, index) => {
      if (index == 0) queryParams += `?${qsKey}=${queryParamsHash[qsKey]}`;
      else queryParams += `&${qsKey}=${queryParamsHash[qsKey]}`;
    })
    this.props.history.push(URLJoin(this.props.match.url, queryParams));
  }

  componentDidUpdate(prevProps) {
    const groupID = this.props.match.params.groupID;
    const prevGroupID = prevProps.match.params.groupID;
    const ct = this.props.match.params.ct;
    const prevCt = prevProps.match.params.ct;
    const qs = queryString.parse(this.props.location.search);

    // When the group changed
    if (ct === undefined) {
      if (prevGroupID !== groupID || prevCt !== ct) {
        this.setState({
          groupID: groupID,
          ct: ct,
          group: getGroup(groupID),
          keepAliveName: generateKeepAliveName(this.props.location.key),
          keepAliveNameInfo: generateKeepAliveNameInfo(this.props.location.key),
          orderFormat: typeof qs.sort == "undefined" ? "recommend" : qs.sort,
        });
        return;
      }
    }
    // When the member changed
    else {
      if (prevGroupID !== groupID || prevCt !== ct) {
        this.setState({
          groupID: groupID,
          ct: ct,
          group: getGroup(groupID),
          keepAliveName: generateKeepAliveName(this.props.location.key),
          keepAliveNameInfo: generateKeepAliveNameInfo(this.props.location.key),
          orderFormat: typeof qs.sort == "undefined" ? "recommend" : qs.sort,
        });
        return;
      }
    }

    // When the order format changed
    if (qs.sort && this.state.orderFormat !== qs.sort) {
      this.setState({
        orderFormat: qs.sort,
        keepAliveName: generateKeepAliveName(this.props.location.key),
        keepAliveNameInfo: generateKeepAliveNameInfo(this.props.location.key),
      });
      return;
    } else if (!qs.sort && this.state.orderFormat !== 'recommend') {
      this.setState({
        orderFormat: 'recommend',
        keepAliveName: generateKeepAliveName(this.props.location.key),
        keepAliveNameInfo: generateKeepAliveNameInfo(this.props.location.key),
      });
      return;
    }

    // When the same link
    if (prevProps.location.key !== this.props.location.key) {
      this.setState({
        keepAliveName: generateKeepAliveName(this.props.location.key),
      });
    }
  }

  render() {
    return (
      <>{this.isRender &&
        <div className="container mt-3 text-muted">
          <Headline title="画像一覧" type="images" mode={this.state.group ? this.state.group : "recommend"} groupID={this.state.groupID} ct={this.state.ct} />

          <KeepAlive name={this.state.keepAliveNameInfo}>
            <div id={this.state.keepAliveNameInfo}>
              <ImageListInfo groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat}
                pushHistory={(qs) => this.pushHistory(qs)} keepAliveNameInfo={this.state.keepAliveNameInfo} hide={(typeof this.state.groupID === "undefined" && typeof this.state.ct === "undefined") ? true : false} />
            </div>
          </KeepAlive>

          {(typeof this.state.groupID === "undefined" && typeof this.state.ct === "undefined") &&
            (!isMobile && <div className="py-2"></div>)
          }

          <KeepAlive name={this.state.keepAliveName}>
            <div id={this.state.keepAliveName}>
              <ImageList groupID={this.state.groupID} ct={this.state.ct} orderFormat={this.state.orderFormat} keepAliveName={this.state.keepAliveName} />
            </div>
          </KeepAlive>

          <ToTopButton />
        </div>
      }</>
    );
  };
};

export default withRouter(ImageListTemplate);