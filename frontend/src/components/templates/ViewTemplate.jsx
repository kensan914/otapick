import React from "react";
import { getGroup, gtagTo } from "../modules/utils";
import axios from "axios";
import { URLJoin } from "../modules/utils";
import { BASE_URL, DELAY_TIME } from "../modules/env";



class ViewTemplate extends React.Component {
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
    this.blogViewURL = URLJoin(BASE_URL, "blog/", this.state.groupID, this.state.blogCt);
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
            };
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
        if (images.length > order)
          images[Number(order)].num_of_views += 1;
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
        if (images.length > order)
          images[Number(order)].num_of_downloads += num;
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


export default ViewTemplate;