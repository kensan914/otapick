import React from "react";
import BlogListInfo from '../molecules/BlogListInfo';
import BlogList from '../organisms/BlogList';
import Headline from '../molecules/Headline';
import queryString from 'query-string';
import { KeepAlive } from 'react-keep-alive';


class BlogListTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.getGroup(this.props.match.params.groupID),
      orderFormat: "newer_post",
      narrowingKeyword: "",
      narrowingDate: "",
      groupID: this.props.match.params.groupID,
      ct: this.props.match.params.ct,
      keepAliveName: props.location.key,
      keepAliveNameInfo: this.addStrInfo(props.location.key),
    }
    this.baseURL = "http://192.168.99.100:8000/";
  };

  getGroup(groupID) {
    var group = "keyaki";
    if (groupID == 2) group = "hinata";
    return group;
  }

  addStrInfo = (str) => str + "Info"

  // ex)URLJoin('http://www.google.com', 'a', undefined, '/b/cd', undifined, '?foo=123', '?bar=foo'); => 'http://www.google.com/a/b/cd?foo=123&bar=foo' 
  URLJoin = (...args) =>
    args
      .filter(n => n !== undefined)
      .join('/').replace(/[\/]+/g, '/').replace(/^(.+):\//, '$1://').replace(/^file:/, 'file:/').replace(/\/(\?|&|#[^!])/g, '$1').replace(/\?/g, '&').replace('&', '?')

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
          narrowingDate: "",
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
          narrowingDate: "",
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
      });
      return;
    } else if (!qs.sort && this.state.orderFormat !== 'newer_post') {
      this.setState({
        orderFormat: 'newer_post',
        keepAliveName: this.props.location.key,
      });
      return;
    }

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
          <BlogListInfo groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat} narrowingKeyword={this.state.narrowingKeyword} narrowingDate={this.state.narrowingDate} URLJoin={this.URLJoin} baseURL={this.baseURL} location={this.props.location} />
        </KeepAlive>
        <KeepAlive name={this.state.keepAliveName}>
          <BlogList groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat} location={this.props.location} history={this.props.history} URLJoin={this.URLJoin} baseURL={this.baseURL} />
        </KeepAlive>
      </>
    );
  };
};

export default BlogListTemplate;