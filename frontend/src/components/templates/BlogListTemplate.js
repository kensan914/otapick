import React from "react";
import BlogListInfo from '../molecules/BlogListInfo';
import BlogList from '../organisms/BlogList';
import Headline from '../molecules/Headline';
import queryString from 'query-string';
import { KeepAlive } from 'react-keep-alive';
import ToTopButton from "../atoms/ToTopButton";


class BlogListTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.getGroup(this.props.match.params.groupID),
      orderFormat: "newer_post",
      narrowingKeyword: "",
      narrowingPost: "",
      groupID: this.props.match.params.groupID,
      ct: this.props.match.params.ct,
      keepAliveName: props.location.key,
      keepAliveNameInfo: this.addStrInfo(props.location.key),
    }
  };

  addStrInfo = (str) => str + "Info"

  pushHistory(qs) {
    const currentQs = queryString.parse(this.props.location.search);
    if (!qs.sort) { delete currentQs.keyword; delete currentQs.post; }
    const queryParamsHash = Object.assign(currentQs, qs);
    let queryParams = "";
    Object.keys(queryParamsHash).forEach((qsKey, index) => {
      if (index == 0) queryParams += `?${qsKey}=${queryParamsHash[qsKey]}`;
      else queryParams += `&${qsKey}=${queryParamsHash[qsKey]}`;
    })
    this.props.history.push(this.props.URLJoin(this.props.match.url, queryParams));
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate ');

    const groupID = this.props.match.params.groupID;
    const prevGroupID = prevProps.match.params.groupID;
    const ct = this.props.match.params.ct;
    const prevCt = prevProps.match.params.ct;

    // When the group changed
    if (ct === undefined) {
      if (prevGroupID !== groupID || prevCt !== ct) {
        this.setState({
          groupID: groupID,
          ct: ct,
          group: this.getGroup(groupID),
          keepAliveName: this.props.location.key,
          keepAliveNameInfo: this.addStrInfo(this.props.location.key),
          orderFormat: "newer_post",
          narrowingKeyword: "",
          narrowingPost: "",
        });
        return;
      }
      // When the member changed
    } else {
      if (prevGroupID !== groupID || prevCt !== ct) {
        this.setState({
          groupID: groupID,
          ct: ct,
          group: this.getGroup(groupID),
          keepAliveName: this.props.location.key,
          keepAliveNameInfo: this.addStrInfo(this.props.location.key),
          orderFormat: "newer_post",
          narrowingKeyword: "",
          narrowingPost: "",
        });
        return;
      }
    }

    // When the order format changed
    const qs = queryString.parse(this.props.location.search);
    if (qs.sort && this.state.orderFormat !== qs.sort) {
      this.setState({
        orderFormat: qs.sort,
        keepAliveName: this.props.location.key,
        keepAliveNameInfo: this.addStrInfo(this.props.location.key),
      });
      return;
    } else if (!qs.sort && this.state.orderFormat !== 'newer_post') {
      this.setState({
        orderFormat: 'newer_post',
        keepAliveName: this.props.location.key,
        keepAliveNameInfo: this.addStrInfo(this.props.location.key),
      });
      return;
    }

    // When the narrowing changed
    let willChangeState = { narrowingKeyword: "", narrowingPost: "" };
    if ((qs.keyword === undefined ? "" : qs.keyword) != this.state.narrowingKeyword) {
      willChangeState = Object.assign(willChangeState, {
        narrowingKeyword: qs.keyword === undefined ? "" : qs.keyword,
        keepAliveName: this.props.location.key,
        keepAliveNameInfo: this.addStrInfo(this.props.location.key),
      });
    }
    if ((qs.post === undefined ? "" : qs.post) != this.state.narrowingPost){
      willChangeState = Object.assign(willChangeState, {
        narrowingPost: qs.post === undefined ? "" : qs.post,
        keepAliveName: this.props.location.key,
        keepAliveNameInfo: this.addStrInfo(this.props.location.key),
      });
    }
    if (Object.keys(willChangeState).length > 2) { this.setState(willChangeState); return; }

    // When the same link
    if (prevProps.location.key !== this.props.location.key) {
      this.setState({
        keepAliveName: this.props.location.key,
      });
    }
  }

  render() {
    return (
      <>
        <Headline title={this.props.headlineTitle} />
        <KeepAlive name={this.state.keepAliveNameInfo}>
          <BlogListInfo groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat} narrowingKeyword={this.state.narrowingKeyword}
            narrowingPost={this.state.narrowingPost} URLJoin={this.props.URLJoin} baseURL={this.props.baseURL} location={this.props.location} pushHistory={(qs) => this.pushHistory(qs)} />
        </KeepAlive>
        <KeepAlive name={this.state.keepAliveName}>
          <BlogList groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat} narrowingKeyword={this.state.narrowingKeyword}
            narrowingPost={this.state.narrowingPost} URLJoin={this.props.URLJoin} baseURL={this.props.baseURL} location={this.props.location} history={this.props.history} />
        </KeepAlive>
        {!this.props.isTop && <ToTopButton group={this.state.group} />}
      </>
    );
  };
};

export default BlogListTemplate;