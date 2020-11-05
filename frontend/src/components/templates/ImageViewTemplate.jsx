import React from "react";
import { URLJoin, generateKeepAliveName, getGroup, checkMatchParams, generateKeepAliveNameInfo, isMobile, isSmp } from "../modules/utils";
import { BASE_URL } from "../modules/env";
import ImageView from "../organisms/ImageView";
import { KeepAlive } from "react-keep-alive";
import  ImageList  from "../organisms/List/ImageList";
import ToTopButton from "../atoms/ToTopButton";
import BackButton from "../atoms/BackButton";
import Headline from "../molecules/Headline";
import { withRouter } from "react-router-dom";
import { SquareAds, LandscapeAds } from "../atoms/Adsense";
import { DomStateContext, DomDispatchContext } from "../contexts/DomContext";


class ImageViewTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.isRender = checkMatchParams(props.history, props.match.params.groupID, props.match.params.blogCt, props.match.params.order);
    this.state = {
      group: getGroup(props.match.params.groupID),
      groupID: props.match.params.groupID,
      blogCt: props.match.params.blogCt,
      order: Number(props.match.params.order),
      keepAliveName: generateKeepAliveName(props.location.key),
      keepAliveNameView: generateKeepAliveNameInfo(props.location.key),
      imageViewURL: URLJoin(BASE_URL, "image/", props.match.params.groupID, props.match.params.blogCt, props.match.params.order),
      blogViewURL: URLJoin(BASE_URL, "blog/", props.match.params.groupID, props.match.params.blogCt),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const groupID = this.props.match.params.groupID;
    const prevGroupID = prevProps.match.params.groupID;
    const blogCt = this.props.match.params.blogCt;
    const prevBlogCt = prevProps.match.params.blogCt;
    const order = this.props.match.params.order;
    const prevOrder = prevProps.match.params.order;

    // When the image changed
    if (prevGroupID !== groupID || prevBlogCt !== blogCt || prevOrder !== order) {
      this.setState({
        group: getGroup(groupID), groupID: groupID, blogCt: blogCt, order: Number(order),
        keepAliveName: generateKeepAliveName(this.props.location.key), keepAliveNameView: generateKeepAliveNameInfo(this.props.location.key),
        imageViewURL: URLJoin(BASE_URL, "image/", groupID, blogCt, order), blogViewURL: URLJoin(BASE_URL, "blog/", groupID, blogCt),
      });
      return;
    }
  }

  render() {
    return (
      <>{this.isRender &&
        <>
          {isMobile && <Headline title={`画像詳細`} />}
          {!isMobile && <BackButton fixed={true} className="in-image-view" />}

          <DomStateContext.Consumer>
            {domState => (
              <DomDispatchContext.Consumer>
                {domDispatch => (
                  <KeepAlive name={"ImageView" + this.state.keepAliveNameView}>
                    <ImageView group={this.state.group} groupID={this.state.groupID} blogCt={this.state.blogCt} order={this.state.order} imageViewURL={this.state.imageViewURL} blogViewURL={this.state.blogViewURL}
                      keepAliveNameView={this.state.keepAliveNameView} prevSrc={typeof this.props.location.state !== "undefined" ? this.props.location.state.prevSrc : null} domState={domState} domDispatch={domDispatch} />
                  </KeepAlive>
                )}
              </DomDispatchContext.Consumer>
            )}
          </DomStateContext.Consumer>

          {/* Google Adsense */}
          <div className="container mt-4" key={this.state.keepAliveName}>
            {isSmp ? <SquareAds /> : <LandscapeAds height="100px" />}
          </div>

          <KeepAlive name={"ImageList" + this.state.keepAliveName}>
            <div className="container-fluid text-muted mt-3 list-container-fluid">
              <ImageList groupID={this.state.groupID} group={this.state.group} blogCt={this.state.blogCt} order={this.state.order} type="RELATED_IMAGES" keepAliveName={this.state.keepAliveName} topComponent={
                <h3 className={"text-center related-image-title " + (isSmp ? "mt-2" : "")}>関連画像</h3>
              } />
            </div>
          </KeepAlive>
          <ToTopButton />
        </>
      }</>
    );
  }
}


export default withRouter(ImageViewTemplate);