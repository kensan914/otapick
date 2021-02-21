import React from "react";
import ImageList from "../organisms/List/ImageList";
import Headline from "../molecules/Headline";
import queryString from "query-string";
import { URLJoin, getGroup, checkMatchParams, isMobile, checkNotCached } from "../modules/utils";
import ImageListInfo from "../molecules/info/ImageListInfo";
import { withRouter } from "react-router-dom";


class ImageListTemplate extends React.Component {
  constructor(props) {
    super(props);
    const groupID = props.match.params.groupID;
    const ct = props.match.params.ct;

    this.isRender = checkMatchParams(props.history, groupID, ct);
    const qs = queryString.parse(props.location.search);
    this.state = {
      group: getGroup(groupID),
      groupID: groupID,
      orderFormat: typeof qs.sort == "undefined" ? "recommend" : qs.sort,
      ct: ct,
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
    if (checkNotCached(this.props)) {
      const { groupID, ct, orderFormat } = getImageUrlComposition(this.props);
      const prevImageUrlComposition = getImageUrlComposition(prevProps);
      const prevGroupID = prevImageUrlComposition.groupID;
      const prevCt = prevImageUrlComposition.ct;
      const qs = queryString.parse(this.props.location.search);

      // When the group changed
      if (ct === undefined) {
        if (prevGroupID !== groupID || prevCt !== ct) {
          this.setState({
            groupID: groupID,
            ct: ct,
            group: getGroup(groupID),
            orderFormat: orderFormat,
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
      } else if (!qs.sort && this.state.orderFormat !== "recommend") {
        this.setState({
          orderFormat: "recommend",
        });
        return;
      }
    }
  }

  render() {
    return (
      <>{this.isRender &&
        <div className="container mt-3 text-muted">
          <Headline title="画像一覧" type="images" mode={this.state.group ? this.state.group : "recommend"} groupID={this.state.groupID} ct={this.state.ct} />

          <ImageListInfo groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat}
            pushHistory={(qs) => this.pushHistory(qs)} hide={(typeof this.state.groupID === "undefined" && typeof this.state.ct === "undefined") ? true : false} />

          {(typeof this.state.groupID === "undefined" && typeof this.state.ct === "undefined") &&
            (!isMobile && <div className="py-2"></div>)
          }

          <ImageList />
        </div>
      }</>
    );
  };
};


export default withRouter(ImageListTemplate);


export const getImageUrlComposition = (props) => {
  const groupID = props.match.params ? props.match.params.groupID : null;
  const ct = props.match.params ? props.match.params.ct : null;

  const qs = queryString.parse(props.location.search);
  const orderFormat = typeof qs.sort == "undefined" ? "recommend" : qs.sort;

  return { groupID, ct, orderFormat };
}