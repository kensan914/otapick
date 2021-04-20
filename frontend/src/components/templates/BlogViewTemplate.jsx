import React from "react";
import Headline from "../molecules/Headline";
import {
  getGroup,
  checkMatchParams,
  updateMeta,
  isSmp,
} from "../modules/utils";
import axios from "axios";
import { URLJoin } from "../modules/utils";
import BlogViewInfo from "../molecules/info/BlogViewInfo";
import BlogView from "../organisms/BlogView";
import { BlogViewLoader, LoaderScreen } from "../molecules/Loader";
import { LOAD_IMG_URL, BASE_URL } from "../modules/env";
import { withRouter } from "react-router-dom";
import { NotFoundMessage } from "../atoms/NotFound";
import BlogSearchListInfo from "../molecules/info/BlogSearchListInfo";
import { SquareAds, LandscapeAds } from "../atoms/Adsense";
import ViewTemplate from "./ViewTemplate";
import { withCookies } from "react-cookie";
import { DomDispatchContext, DomStateContext } from "../contexts/DomContext";
import { AuthStateContext } from "../contexts/AuthContext";

class BlogViewTemplate extends ViewTemplate {
  constructor(props) {
    super(props);
    this.isRender = checkMatchParams(
      props.history,
      props.match.params.groupID,
      props.match.params.blogCt
    );

    this.initBlogState = {
      mode: "view", // "view" or "download"
    };
    this.state = Object.assign(this.initState, this.initBlogState);
  }

  putView() {
    axios
      .put(
        this.blogViewURL,
        {
          action: "view",
          key: this.state.VIEW_KEY,
        },
        {
          headers: {
            "X-CSRFToken": this.props.cookies.get("csrftoken"),
          },
        }
      )
      .then((res) => {
        if (res.data["status"] == "success") {
          this.incrementNumOfViews();
        }
      });
  }

  putDownload(order) {
    axios
      .put(
        URLJoin(
          BASE_URL,
          "image/",
          this.state.groupID,
          this.state.blogCt,
          order.toString()
        ),
        {
          action: "download",
          key: this.state.DOWNLOAD_KEY,
        },
        {
          headers: {
            "X-CSRFToken": this.props.cookies.get("csrftoken"),
          },
        }
      )
      .then((res) => {
        if (res.data["status"] == "success") {
          this.incrementNumOfDownloads();
        }
      });
  }

  changeMode = (mode) => {
    if (mode !== this.state.mode) {
      if (mode === "view" || mode === "download") this.setState({ mode: mode });
      else this.setState({ mode: "" });
    }
  };

  updateMetaVerView(status, blogTitle, blogWriter) {
    if (this.isRender) {
      if (status === "success") {
        updateMeta({
          title: `${blogTitle}(${blogWriter})｜ブログ詳細`,
          description: `${blogWriter}のブログ「${blogTitle}」です。`,
        });
      } else if (status === "get_image_failed") {
        updateMeta({ title: "Not Found Image", description: "" });
      } else if (status === "blog_not_found") {
        updateMeta({ title: "Not Found Blog", description: "" });
      } else if (status === "accepted") {
        updateMeta({ title: "画像取得中", description: "" });
      }
    }
  }

  componentDidMount() {
    if (this.isRender) {
      super.componentDidMount();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // blog が view されたとき
    if (
      prevState.status !== this.state.status &&
      this.state.status === "success"
    ) {
      if (this.state.VIEW_KEY) {
        const blogID = `${this.state.groupID}_${this.state.blogCt}_${this.props.location.key}`;
        if (!this.props.domState.accessedBlogs.includes(blogID)) {
          this.putView();
          this.props.domDispatch({ type: "ACCESS_TO_BLOG", blogID: blogID });
        }
      }
    }

    const groupID = this.props.match.params.groupID;
    const prevGroupID = prevProps.match.params.groupID;
    const blogCt = this.props.match.params.blogCt;
    const prevBlogCt = prevProps.match.params.blogCt;
    // When the blog changed
    if (prevGroupID !== groupID || prevBlogCt !== blogCt) {
      this.initBlogState = {
        mode: "view",
        groupID: groupID,
        blogCt: blogCt,
        group: getGroup(groupID),
      };
      this.setState(Object.assign(this.initState, this.initBlogState));
      this.blogViewURL = URLJoin(BASE_URL, "blog/", groupID, blogCt);
      this.getBlog();
    }

    // accepted
    super.componentDidUpdate(prevProps, prevState);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.isRender = false;
  }

  render() {
    let contents;
    if (this.state.status === "") {
      contents = <LoaderScreen type="horizontal" />;
    } else if (this.state.status === "success") {
      if (this.state.images.length > 0) {
        contents = (
          <BlogView
            group={this.state.group}
            images={this.state.images}
            blogViewURL={this.blogViewURL}
            incrementNumOfDownloads={(order, num) =>
              this.incrementNumOfDownloads(order, num)
            }
            putDownload={(order) => this.putDownload(order)}
            mode={this.state.mode}
            blogUrl={this.state.url}
            officialUrl={this.state.officialUrl}
            writer={this.state.writer}
            blogCt={this.state.blogCt}
            blogTitle={this.state.title}
            groupID={this.state.groupID}
          />
        );
      } else {
        contents = <NotFoundMessage type="image" margin={true} />;
      }
    } else if (this.state.status === "accepted") {
      contents = (
        <BlogViewLoader
          progress={this.state.progress}
          loadingImageUrl={LOAD_IMG_URL}
        />
      );
    } else if (
      this.state.status === "blog_not_found" ||
      this.state.status === "get_image_failed"
    ) {
      contents = <NotFoundMessage type="blogFailed" margin={true} />;
    }
    return (
      <>
        {this.isRender && (
          <div className="container mt-3 text-muted">
            <Headline
              title="ブログ詳細"
              type="blogView"
              mode={this.state.mode}
              changeMode={(mode) => this.changeMode(mode)}
            />
            {this.state.status !== "blog_not_found" ? (
              <BlogViewInfo
                group={this.state.group}
                title={this.state.title}
                writer={this.state.writer}
                postDate={this.state.postDate}
                officialUrl={this.state.officialUrl}
                numOfViews={this.state.numOfViews}
                numOfDownloads={this.state.numOfDownloads}
              />
            ) : (
              <BlogSearchListInfo
                group={this.state.group}
                title={this.state.title}
                numOfHit={0}
              />
            )}

            {/* Google AdSense */}
            {/* <div className="container mt-4">
              {isSmp ? <SquareAds /> : <LandscapeAds height="100px" />}
            </div> */}

            {contents}
          </div>
        )}
      </>
    );
  }
}

export default withRouter(
  withCookies((props) => (
    <DomStateContext.Consumer>
      {(domState) => (
        <DomDispatchContext.Consumer>
          {(domDispatch) => (
            <AuthStateContext.Consumer>
              {(authState) => (
                <BlogViewTemplate
                  {...props}
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
  ))
);
