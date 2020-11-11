import React from "react";
import { URLJoin, getGroup, checkMatchParams, isMobile, isSmp } from "../modules/utils";
import { BASE_URL } from "../modules/env";
import ImageView from "../organisms/ImageView";
import ImageList from "../organisms/List/ImageList";
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
                  <ImageView group={this.state.group} groupID={this.state.groupID} blogCt={this.state.blogCt} order={this.state.order} imageViewURL={this.state.imageViewURL} blogViewURL={this.state.blogViewURL}
                    prevSrc={typeof this.props.location.state !== "undefined" ? this.props.location.state.prevSrc : null} domState={domState} domDispatch={domDispatch} />
                )}
              </DomDispatchContext.Consumer>
            )}
          </DomStateContext.Consumer>

          {/* Google Adsense */}
          <div className="container mt-4" >
            {isSmp ? <SquareAds /> : <LandscapeAds height="100px" />}
          </div>

          <div className="container-fluid text-muted mt-3 list-container-fluid">
            <ImageList type="RELATED_IMAGES" topComponent={
              <h3 className={"text-center related-image-title " + (isSmp ? "mt-2" : "")}>関連画像</h3>
            } />
          </div>
          <ToTopButton />
        </>
      }</>
    );
  }
}


export default withRouter(ImageViewTemplate);