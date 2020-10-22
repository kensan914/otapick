import React from "react";
import BlogListInfo from '../molecules/info/BlogListInfo';
import { BlogList } from '../organisms/List';
import Headline from '../molecules/Headline';
import queryString from 'query-string';
import { KeepAlive } from 'react-keep-alive';
import ToTopButton from "../atoms/ToTopButton";
import { URLJoin, getGroup, generateKeepAliveName, generateKeepAliveNameInfo, checkMatchParams, isMobile } from '../modules/support';
import { withRouter } from "react-router-dom";


class BlogListTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.isRender = checkMatchParams(props.history, props.match.params.groupID, props.match.params.ct);

    const qs = queryString.parse(props.location.search);
    this.state = {
      group: getGroup(props.match.params.groupID),
      orderFormat: typeof qs.sort == "undefined" ? "newer_post" : qs.sort,
      narrowingKeyword: typeof qs.keyword == "undefined" ? "" : qs.keyword,
      narrowingPost: typeof qs.post == "undefined" ? "" : qs.post,
      groupID: props.match.params.groupID,
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
          orderFormat: typeof qs.sort == "undefined" ? "newer_post" : qs.sort,
          narrowingKeyword: "",
          narrowingPost: "",
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
          orderFormat: typeof qs.sort == "undefined" ? "newer_post" : qs.sort,
          narrowingKeyword: "",
          narrowingPost: "",
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
    } else if (!qs.sort && this.state.orderFormat !== 'newer_post') {
      this.setState({
        orderFormat: 'newer_post',
        keepAliveName: generateKeepAliveName(this.props.location.key),
        keepAliveNameInfo: generateKeepAliveNameInfo(this.props.location.key),
      });
      return;
    }

    // When the narrowing changed
    let willChangeState = { narrowingKeyword: "", narrowingPost: "" };
    if ((qs.keyword === undefined ? "" : qs.keyword) != this.state.narrowingKeyword) {
      willChangeState = Object.assign(willChangeState, {
        narrowingKeyword: qs.keyword === undefined ? "" : qs.keyword,
        keepAliveName: generateKeepAliveName(this.props.location.key),
        keepAliveNameInfo: generateKeepAliveNameInfo(this.props.location.key),
      });
    }
    if ((qs.post === undefined ? "" : qs.post) != this.state.narrowingPost) {
      willChangeState = Object.assign(willChangeState, {
        narrowingPost: qs.post === undefined ? "" : qs.post,
        keepAliveName: generateKeepAliveName(this.props.location.key),
        keepAliveNameInfo: generateKeepAliveNameInfo(this.props.location.key),
      });
    }
    if (Object.keys(willChangeState).length > 2) {
      this.setState(willChangeState);
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
          <Headline title="ブログ一覧" type="blogs" mode={this.state.group ? this.state.group : "recommend"} groupID={this.state.groupID} ct={this.state.ct} />

          <KeepAlive name={this.state.keepAliveNameInfo}>
            <BlogListInfo groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat} narrowingKeyword={this.state.narrowingKeyword}
              narrowingPost={this.state.narrowingPost} pushHistory={(qs) => this.pushHistory(qs)} keepAliveNameInfo={this.state.keepAliveNameInfo} hide={(typeof this.state.groupID === "undefined" && typeof this.state.ct === "undefined") ? true : false} />
          </KeepAlive>
          {(typeof this.state.groupID === "undefined" && typeof this.state.ct === "undefined") &&
            (!isMobile && <div className="py-2"></div>)
          }
          <KeepAlive name={this.state.keepAliveName}>
            <BlogList groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat} narrowingKeyword={this.state.narrowingKeyword}
              narrowingPost={this.state.narrowingPost} applyShowFooter={this.props.applyShowFooter} keepAliveName={this.state.keepAliveName} />
          </KeepAlive>

          <ToTopButton />
        </div>
      }</>
    );
  };
};

export default withRouter(BlogListTemplate);