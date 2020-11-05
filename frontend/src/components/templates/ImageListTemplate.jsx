import React from "react";
import ImageList from "../organisms/List/ImageList";
import Headline from "../molecules/Headline";
import queryString from "query-string";
import ToTopButton from "../atoms/ToTopButton";
import { URLJoin, getGroup, checkMatchParams, isMobile } from "../modules/utils";
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
    const { groupID, ct, orderFormat } = getImageUrlComposition(this.props);

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

  render() {
    return (
      <>{this.isRender &&
        <div className="container mt-3 text-muted">
          <Headline title="画像一覧" type="images" mode={this.state.group ? this.state.group : "recommend"} groupID={this.state.groupID} ct={this.state.ct} />

          {/* <div id={this.state.keepAliveNameInfo}> */}
          <div>
            <ImageListInfo groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat}
              pushHistory={(qs) => this.pushHistory(qs)} hide={(typeof this.state.groupID === "undefined" && typeof this.state.ct === "undefined") ? true : false} />
          </div>

          {(typeof this.state.groupID === "undefined" && typeof this.state.ct === "undefined") &&
            (!isMobile && <div className="py-2"></div>)
          }

          {/* <div id={this.state.keepAliveName}> */}
          <div>
            <ImageList />
          </div>

          <ToTopButton />
        </div>
      }</>
    );
  };
};

export default withRouter(ImageListTemplate);


export const getImageUrlComposition = (props) => {
  const groupID = props.match.params.groupID;
  const ct = props.match.params.ct;

  const qs = queryString.parse(props.location.search);
  const orderFormat = typeof qs.sort == "undefined" ? "recommend" : qs.sort;

  return { groupID, ct, orderFormat };
}