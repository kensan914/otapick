import React from "react";
import Headline from '../molecules/Headline';
import { getGroup } from '../tools/support';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import BlogViewInfo from "../molecules/BlogInfo";
import BlogView from "../organisms/BlogView";
import { BlogViewLoader, LoaderScreen } from "../molecules/Loader";
import { LOAD_IMG_URL, BASE_URL } from "../tools/env";
import { withRouter } from 'react-router-dom';
import { NotFoundMessage } from "../atoms/NotFound";
import BlogSearchListInfo from "../molecules/BlogSearchListInfo";


class BlogViewTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: getGroup(this.props.match.params.groupID),
      groupID: this.props.match.params.groupID,
      blogCt: this.props.match.params.blogCt,
      title: "",
      postDate: "",
      writer: {},
      numOfViews: 0,
      numOfDownloads: 0,
      officialUrl: "",
      images: [],
      status: "",
      progress: 0,
      loadingImageUrl: "",
      BLOG_VIEW_KEY: "",
    }
    this.blogViewURL = URLJoin(BASE_URL, "api/blog/", this.state.groupID, this.state.blogCt);
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
            }
          }

          if (res.data["status"] === "success") {
            this.setState(Object.assign({
              images: res.data["images"],
              status: res.data["status"],
              BLOG_VIEW_KEY: res.data["BLOG_VIEW_KEY"],
            }, blogData));
          } else if (res.data["status"] === "start_download" || res.data["status"] === "downloading") {
            this.setState(Object.assign({
              progress: res.data["progress"],
              loadingImageUrl: res.data["loading_image"],
              status: "accepted",
            }, blogData));
          } else if (res.data["status"] === "blog_not_found") {
            this.setState({
              status: "blog_not_found",
              title: "ブログが見つかりませんでした。"
            });
          } else if (res.data["status"] === "get_image_failed") {
            this.setState(Object.assign({
              status: "get_image_failed"
            }, blogData));
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(
        )
    }, 100);
  }

  putView() {
    axios
      .put(this.blogViewURL, {
        action: 'view',
        key: this.state.BLOG_VIEW_KEY,
      }, {
        headers: {
          'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').getAttribute('value')
        }
      });
  }

  componentDidMount() {
    this.getBlog();
  }

  componentDidUpdate(prevProps, prevState) {
    // blog が view されたとき
    if (prevState.status !== this.state.status && this.state.status === "success") {
      if (this.state.BLOG_VIEW_KEY) {
        if (!this.props.accessedBlogs.includes(`${this.state.groupID}_${this.state.blogCt}_${this.props.location.key}`)) {
          console.log("描画されました。");
          this.putView();
          this.props.setAccessedBlog(`${this.state.groupID}_${this.state.blogCt}_${this.props.location.key}`);
        }
      }
    }

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

  render() {
    let contents;
    if (this.state.status === "") {
      contents = (<LoaderScreen type="horizontal" />);
    } else if (this.state.status === "success") {
      if (this.state.images.length > 0) {
        contents = (<BlogView group={this.state.group} images={this.state.images} blogViewURL={this.blogViewURL} />);
      } else {
        contents = (<div className="pb-5"><NotFoundMessage type="image" /></div>);
      }
    } else if (this.state.status === "accepted") {
      contents = (<BlogViewLoader progress={this.state.progress} loadingImageUrl={LOAD_IMG_URL} />);
    } else if (this.state.status === "blog_not_found" || this.state.status === "get_image_failed") {
      contents = (<div className="pb-5"><NotFoundMessage type="blogFailed" /></div>);
    }
    return (
      <>
        <Headline title="保存" />
        {this.state.status !== "blog_not_found"
          ? <BlogViewInfo group={this.state.group} title={this.state.title} writer={this.state.writer} postDate={this.state.postDate}
            officialUrl={this.state.officialUrl} numOfViews={this.state.numOfViews} numOfDownloads={this.state.numOfDownloads} />
          : <BlogSearchListInfo group={this.state.group} title={this.state.title} numOfHit={0} />
        }
        {contents}
      </>
    );
  };
};

export default withRouter(BlogViewTemplate);