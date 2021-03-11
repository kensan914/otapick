import React from "react";
import {
  URLJoin,
  getGroup,
  checkMatchParams,
  isMobile,
  isSmp,
  checkNotCached,
} from "../modules/utils";
import { BASE_URL } from "../modules/env";
import ImageView from "../organisms/ImageView";
import ImageList from "../organisms/List/ImageList";
import BackButton from "../atoms/BackButton";
import Headline from "../molecules/Headline";
import { withRouter } from "react-router-dom";
import { SquareAds, LandscapeAds } from "../atoms/AdSense";
import { DomStateContext, DomDispatchContext } from "../contexts/DomContext";
import { AuthStateContext } from "../contexts/AuthContext";

class ImageViewTemplate extends React.Component {
  constructor(props) {
    super(props);
    const groupID = props.match.params.groupID;
    const blogCt = props.match.params.blogCt;
    const order = props.match.params.order;

    this.isRender = checkMatchParams(props.history, groupID, blogCt, order);
    this.state = {
      group: getGroup(groupID),
      groupID: groupID,
      blogCt: blogCt,
      order: Number(order),
      imageViewURL: URLJoin(BASE_URL, "image/", groupID, blogCt, order),
      blogViewURL: URLJoin(BASE_URL, "blog/", groupID, blogCt),
    };
  }

  componentDidUpdate(prevProps) {
    if (checkNotCached(this.props)) {
      const { groupID, blogCt, order } = getImageViewUrlComposition(this.props);
      const prevImageViewUrlComposition = getImageViewUrlComposition(prevProps);
      const prevGroupID = prevImageViewUrlComposition.groupID;
      const prevBlogCt = prevImageViewUrlComposition.blogCt;
      const prevOrder = prevImageViewUrlComposition.order;

      // When the image changed
      if (
        prevGroupID !== groupID ||
        prevBlogCt !== blogCt ||
        prevOrder !== order
      ) {
        this.setState({
          group: getGroup(groupID),
          groupID: groupID,
          blogCt: blogCt,
          order: Number(order),
          imageViewURL: URLJoin(BASE_URL, "image/", groupID, blogCt, order),
          blogViewURL: URLJoin(BASE_URL, "blog/", groupID, blogCt),
        });
        return;
      }
    }
  }

  render() {
    const prevSrc =
      typeof this.props.location.state === "undefined"
        ? null
        : this.props.location.state.prevSrc;

    return (
      <>
        {this.isRender && (
          <>
            {isMobile && <Headline title={`画像詳細`} />}
            {!isMobile && <BackButton fixed={true} className="in-image-view" />}

            <DomStateContext.Consumer>
              {(domState) => (
                <DomDispatchContext.Consumer>
                  {(domDispatch) => (
                    <AuthStateContext.Consumer>
                      {(authState) => (
                        <ImageView
                          group={this.state.group}
                          groupID={this.state.groupID}
                          blogCt={this.state.blogCt}
                          order={this.state.order}
                          imageViewURL={this.state.imageViewURL}
                          blogViewURL={this.state.blogViewURL}
                          prevSrc={prevSrc}
                          domState={domState}
                          domDispatch={domDispatch}
                          authState={authState}
                        />
                      )}
                    </AuthStateContext.Consumer>
                  )}
                </DomDispatchContext.Consumer>
              )}
            </DomStateContext.Consumer>

            {/* Google AdSense */}
            <div className="container mt-4">
              {isSmp ? <SquareAds /> : <LandscapeAds height="100px" />}
            </div>

            <div className="container-fluid text-muted mt-3 list-container-fluid">
              <ImageList
                type="RELATED_IMAGES"
                topComponent={
                  <h3
                    className={
                      "text-center related-image-title " + (isSmp ? "mt-2" : "")
                    }
                  >
                    関連画像
                  </h3>
                }
              />
            </div>
          </>
        )}
      </>
    );
  }
}

export default withRouter(ImageViewTemplate);

export const getImageViewUrlComposition = (props) => {
  const groupID = props.match.params ? props.match.params.groupID : null;
  const blogCt = props.match.params ? props.match.params.blogCt : null;
  const order = props.match.params ? props.match.params.order : null;
  return { groupID, blogCt, order };
};
