import React from "react";
import Headline from '../molecules/Headline';
import { getGroup, checkMatchParams, updateMeta, gtagTo } from '../tools/support';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import BlogViewInfo from "../molecules/info/BlogViewInfo";
import BlogView from "../organisms/BlogView";
import { BlogViewLoader, LoaderScreen } from "../molecules/Loader";
import { LOAD_IMG_URL, BASE_URL, DELAY_TIME } from "../tools/env";
import { withRouter } from 'react-router-dom';
import { NotFoundMessage } from "../atoms/NotFound";
import BlogSearchListInfo from "../molecules/info/BlogSearchListInfo";


export class ViewTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.initState = {
      group: getGroup(this.props.match.params.groupID),
      groupID: this.props.match.params.groupID,
      blogCt: this.props.match.params.blogCt,
      title: "",
      postDate: "",
      writer: {},
      numOfViews: 0,
      numOfDownloads: 0,
      officialUrl: "",
      url: "",
      images: [],
      status: "",
      progress: 0,
      loadingImageUrl: "",
      VIEW_KEY: "",
      DOWNLOAD_KEY: "",
    };
    this.state = this.initState;
    this.blogViewURL = URLJoin(BASE_URL, "api/blog/", this.state.groupID, this.state.blogCt);
    this.incrementNumOfViews = this.incrementNumOfViews.bind(this);
    this.incrementNumOfDownloads = this.incrementNumOfDownloads.bind(this);
  };

  getBlog() {
    setTimeout(() => {
      axios
        .get(this.blogViewURL)
        .then(res => {
          let blogData = {};
          if (!this.state.status && res.data["status"] !== "blog_not_found") {
            blogData = {
              title: res.data["title"],
              postDate: res.data["post_date"],
              writer: res.data["writer"],
              numOfViews: res.data["num_of_views"],
              numOfDownloads: res.data["num_of_downloads"],
              officialUrl: res.data["official_url"],
              url: res.data["url"],
            }
          }

          if (res.data["status"] === "success") {
            // order error
            if (typeof this.props.order !== "undefined" && res.data["images"].length <= this.props.order) {
              this.setState(Object.assign({
                status: "get_image_failed"
              }, blogData));
              this.updateMetaVerView("get_image_failed");
            } else {
              this.setState(Object.assign({
                images: res.data["images"],
                status: "success",
                VIEW_KEY: res.data["VIEW_KEY"],
                DOWNLOAD_KEY: res.data["DOWNLOAD_KEY"],
              }, blogData));
              this.updateMetaVerView("success", blogData.title, blogData.writer.name);
            }
          } else if (res.data["status"] === "start_download" || res.data["status"] === "downloading") {
            this.setState(Object.assign({
              progress: res.data["progress"],
              loadingImageUrl: res.data["loading_image"],
              status: "accepted",
            }, blogData));
            this.updateMetaVerView("accepted");
          } else if (res.data["status"] === "blog_not_found") {
            this.setState({
              status: "blog_not_found",
              title: "ブログが見つかりませんでした。"
            });
            this.updateMetaVerView("blog_not_found");
          } else if (res.data["status"] === "get_image_failed") {
            this.setState(Object.assign({
              status: "get_image_failed"
            }, blogData));
            this.updateMetaVerView("get_image_failed");
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          gtagTo(this.props.location.pathname);
        });
    }, DELAY_TIME);
  }

  incrementNumOfViews(order = -1) {
    if (order < 0) { // blog
      this.setState(prevState => (
        { numOfViews: prevState.numOfViews + 1 }
      ));
    } else { // image
      this.setState(prevState => {
        let images = prevState.images;
        if (images.length > order) images[Number(order)].num_of_views += 1;
        return { images: images };
      });
    }
  }

  incrementNumOfDownloads(order = -1, num = 1) {
    if (order < 0) { // 総DL数
      this.setState(prevState => (
        { numOfDownloads: prevState.numOfDownloads + num }
      ));
    } else { // DL数
      this.setState(prevState => {
        let images = prevState.images;
        if (images.length > order) images[Number(order)].num_of_downloads += num;
        return { images: images };
      });
    }
  }

  componentDidMount() {
    this.getBlog();
  }

  componentDidUpdate(prevProps, prevState) {
    // blog の読み込みが開始したとき
    if (prevState.status !== this.state.status && this.state.status === "accepted") {
      this.reqCount = 0;
      this.intervalReqID = setInterval(
        () => {
          if (this.reqCount++ <= 20) {
            this.getBlog();
          } else {
            this.setState({ status: "get_image_failed" });
            clearInterval(this.intervalReqID);
          }
        }, 1000
      );
    }
    // blog の読み込みが終了したとき
    if (prevState.status !== this.state.status && prevState.status === "accepted") {
      clearInterval(this.intervalReqID);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalReqID);
  }
}


class BlogViewTemplate extends ViewTemplate {
  constructor(props) {
    super(props);
    this.isRender = checkMatchParams(props.history, props.match.params.groupID, props.match.params.blogCt);

    this.initBlogState = {
      mode: "view", // "view" or "download"
    }
    this.state = Object.assign(this.initState, this.initBlogState);
  }

  putView() {
    axios
      .put(this.blogViewURL, {
        action: 'view',
        key: this.state.VIEW_KEY,
      }, {
        headers: {
          'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').getAttribute('value')
        }
      })
      .then(res => {
        if (res.data["status"] == "success") {
          this.incrementNumOfViews();
        }
      });
  }

  putView() {
    axios
      .put(this.blogViewURL, {
        action: 'view',
        key: this.state.VIEW_KEY,
      }, {
        headers: {
          'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').getAttribute('value')
        }
      })
      .then(res => {
        if (res.data["status"] == "success") {
          this.incrementNumOfViews();
        }
      });
  }

  putDownload(order) {
    axios
      .put(URLJoin(BASE_URL, "api/image/", this.state.groupID, this.state.blogCt, order.toString()), {
        action: 'download',
        key: this.state.DOWNLOAD_KEY,
      }, {
        headers: {
          'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').getAttribute('value')
        }
      })
      .then(res => {
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
  }

  updateMetaVerView(status, blogTitle, blogWriter) {
    if (this.isRender) {
      if (status === "success") {
        updateMeta({ title: `${blogTitle}(${blogWriter})｜ブログ詳細`, discription: `${blogWriter}のブログ「${blogTitle}」です。` });
      } else if (status === "get_image_failed") {
        updateMeta({ title: "Not Found Image", discription: "" });
      } else if (status === "blog_not_found") {
        updateMeta({ title: "Not Found Blog", discription: "" });
      } else if (status === "accepted") {
        updateMeta({ title: "画像取得中", discription: "" });
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
    if (prevState.status !== this.state.status && this.state.status === "success") {
      if (this.state.VIEW_KEY) {
        if (!this.props.accessedBlogs.includes(`${this.state.groupID}_${this.state.blogCt}_${this.props.location.key}`)) {
          this.putView();
          this.props.setAccessedBlog(`${this.state.groupID}_${this.state.blogCt}_${this.props.location.key}`);
        }
      }
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
      contents = (<LoaderScreen type="horizontal" />);
    } else if (this.state.status === "success") {
      if (this.state.images.length > 0) {
        contents = (<BlogView group={this.state.group} images={this.state.images} blogViewURL={this.blogViewURL} incrementNumOfDownloads={(order, num) => this.incrementNumOfDownloads(order, num)} putDownload={(order) => this.putDownload(order)}
          mode={this.state.mode} blogUrl={this.state.url} officialUrl={this.state.officialUrl} writer={this.state.writer} blogCt={this.state.blogCt} blogTitle={this.state.title} groupID={this.state.groupID} />);
      } else {
        contents = (<NotFoundMessage type="image" margin={true} />);
      }
    } else if (this.state.status === "accepted") {
      contents = (<BlogViewLoader progress={this.state.progress} loadingImageUrl={LOAD_IMG_URL} />);
    } else if (this.state.status === "blog_not_found" || this.state.status === "get_image_failed") {
      contents = (<NotFoundMessage type="blogFailed" margin={true} />);
    }
    return (
      <>{this.isRender &&
        <div className="container mt-3 text-muted">
          <Headline title="ブログ詳細" type="blogView" mode={this.state.mode} changeMode={(mode) => this.changeMode(mode)} />
          {this.state.status !== "blog_not_found"
            ? <BlogViewInfo group={this.state.group} title={this.state.title} writer={this.state.writer} postDate={this.state.postDate}
              officialUrl={this.state.officialUrl} numOfViews={this.state.numOfViews} numOfDownloads={this.state.numOfDownloads} />
            : <BlogSearchListInfo group={this.state.group} title={this.state.title} numOfHit={0} />
          }
          {contents}

          {/* Google Adsense */}
          <div class="container mt-3">
            {/* {isSmp ? <LandscapeAds height="100px" /> : <SquareAds />} */}
            {/* <LandscapeAds height="100px" /> */}
            <SquareAds />
          </div>
        </div>
      }</>
    );
  }
}

export default withRouter(BlogViewTemplate);