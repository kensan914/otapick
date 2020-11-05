import React from "react";
import BlogListInfo from "../molecules/info/BlogListInfo";
import BlogList from "../organisms/List/BlogList";
import Headline from "../molecules/Headline";
import queryString from "query-string";
import ToTopButton from "../atoms/ToTopButton";
import { URLJoin, getGroup, checkMatchParams, isMobile } from "../modules/utils";
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
    const prevGroupID = prevProps.match.params.groupID;
    const prevCt = prevProps.match.params.ct;
    const qs = queryString.parse(this.props.location.search);
    const { groupID, ct, orderFormat } = getBlogUrlComposition(this.props);

    // When the group changed
    if (ct === undefined) {
      if (prevGroupID !== groupID || prevCt !== ct) {
        this.setState({
          groupID: groupID,
          ct: ct,
          group: getGroup(groupID),
          orderFormat: orderFormat,
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
          orderFormat: orderFormat,
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
      });
      return;
    } else if (!qs.sort && this.state.orderFormat !== "newer_post") {
      this.setState({
        orderFormat: "newer_post",
      });
      return;
    }

    // When the narrowing changed
    let willChangeState = { narrowingKeyword: "", narrowingPost: "" };
    if ((qs.keyword === undefined ? "" : qs.keyword) != this.state.narrowingKeyword) {
      willChangeState = Object.assign(willChangeState, {
        narrowingKeyword: qs.keyword === undefined ? "" : qs.keyword,
      });
    }
    if ((qs.post === undefined ? "" : qs.post) != this.state.narrowingPost) {
      willChangeState = Object.assign(willChangeState, {
        narrowingPost: qs.post === undefined ? "" : qs.post,
      });
    }
    if (Object.keys(willChangeState).length > 2) {
      this.setState(willChangeState);
      return;
    }
  }

  render() {
    return (
      <>{this.isRender &&
        <div className="container mt-3 text-muted">
          <Headline title="ブログ一覧" type="blogs" mode={this.state.group ? this.state.group : "recommend"} groupID={this.state.groupID} ct={this.state.ct} />

          <BlogListInfo groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat} narrowingKeyword={this.state.narrowingKeyword}
            narrowingPost={this.state.narrowingPost} pushHistory={(qs) => this.pushHistory(qs)} hide={(typeof this.state.groupID === "undefined" && typeof this.state.ct === "undefined") ? true : false} />
          {(typeof this.state.groupID === "undefined" && typeof this.state.ct === "undefined") &&
            (!isMobile && <div className="py-2"></div>)
          }
          <BlogList />

          <ToTopButton />
        </div>
      }</>
    );
  };
};

export default withRouter(BlogListTemplate);


export const getBlogUrlComposition = (props) => {
  const groupID = props.match.params.groupID;
  const ct = props.match.params.ct;

  const qs = queryString.parse(props.location.search);
  const orderFormat = typeof qs.sort == "undefined" ? "newer_post" : qs.sort;
  const narrowingKeyword = typeof qs.keyword == "undefined" ? "" : qs.v;
  const narrowingPost = typeof qs.post == "undefined" ? "" : qs.post;

  return { groupID, ct, orderFormat, narrowingKeyword, narrowingPost };
}