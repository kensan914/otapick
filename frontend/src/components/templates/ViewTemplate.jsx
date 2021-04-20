import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  cvtKeyFromSnakeToCamel,
  deepCvtKeyFromSnakeToCamel,
  getGroup,
  gtagTo,
} from "../modules/utils";
import { URLJoin } from "../modules/utils";
import { BASE_URL, DELAY_TIME } from "../modules/env";
import { useLocation, useRouteMatch } from "react-router";
import { useAxios } from "../modules/axios";

class ViewTemplate extends React.Component {
  constructor(props) {
    super(props);
    const groupID = props.match.params.groupID;
    const blogCt = props.match.params.blogCt;

    this.initState = {
      group: getGroup(groupID),
      groupID: groupID,
      blogCt: blogCt,
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
    this.blogViewURL = URLJoin(
      BASE_URL,
      "blog/",
      this.state.groupID,
      this.state.blogCt
    );
    this.incrementNumOfViews = this.incrementNumOfViews.bind(this);
    this.incrementNumOfDownloads = this.incrementNumOfDownloads.bind(this);
  }

  getBlog() {
    setTimeout(() => {
      // authAxios(this.props.authState.token)
      axios
        .get(this.blogViewURL)
        .then((res) => {
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
            if (
              typeof this.props.order !== "undefined" &&
              res.data["images"].length <= this.props.order
            ) {
              this.setState(
                Object.assign(
                  {
                    status: "get_image_failed",
                  },
                  blogData
                )
              );
              this.updateMetaVerView("get_image_failed");
            } else {
              this.setState(
                Object.assign(
                  {
                    images: res.data["images"].map((image) =>
                      cvtKeyFromSnakeToCamel(image)
                    ),
                    status: "success",
                    VIEW_KEY: res.data["VIEW_KEY"],
                    DOWNLOAD_KEY: res.data["DOWNLOAD_KEY"],
                  },
                  blogData
                )
              );
              this.updateMetaVerView(
                "success",
                blogData.title,
                blogData.writer.name
              );
            }
          } else if (
            res.data["status"] === "start_download" ||
            res.data["status"] === "downloading"
          ) {
            this.setState(
              Object.assign(
                {
                  progress: res.data["progress"],
                  loadingImageUrl: res.data["loading_image"],
                  status: "accepted",
                },
                blogData
              )
            );
            this.updateMetaVerView("accepted");
          } else if (res.data["status"] === "blog_not_found") {
            this.setState({
              status: "blog_not_found",
              title: "ブログが見つかりませんでした。",
            });
            this.updateMetaVerView("blog_not_found");
          } else if (res.data["status"] === "get_image_failed") {
            this.setState(
              Object.assign(
                {
                  status: "get_image_failed",
                },
                blogData
              )
            );
            this.updateMetaVerView("get_image_failed");
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          gtagTo(this.props.location.pathname);
        });
    }, DELAY_TIME);
  }

  incrementNumOfViews(order = -1) {
    if (order < 0) {
      // blog
      this.setState((prevState) => ({ numOfViews: prevState.numOfViews + 1 }));
    } else {
      // image
      this.setState((prevState) => {
        let images = prevState.images;
        if (images.length > order) images[Number(order)].numOfViews += 1;
        return { images: images };
      });
    }
  }

  incrementNumOfDownloads(order = -1, num = 1) {
    if (order < 0) {
      // 総DL数
      this.setState((prevState) => ({
        numOfDownloads: prevState.numOfDownloads + num,
      }));
    } else {
      // DL数
      this.setState((prevState) => {
        let images = prevState.images;
        if (images.length > order) images[Number(order)].numOfDownloads += num;
        return { images: images };
      });
    }
  }

  componentDidMount() {
    this.getBlog();
  }

  componentDidUpdate(prevProps, prevState) {
    // blog の読み込みが開始したとき
    if (
      prevState.status !== this.state.status &&
      this.state.status === "accepted"
    ) {
      this.reqCount = 0;
      this.intervalReqID = setInterval(() => {
        if (this.reqCount++ <= 20) {
          this.getBlog();
        } else {
          this.setState({ status: "get_image_failed" });
          clearInterval(this.intervalReqID);
        }
      }, 1000);
    }
    // blog の読み込みが終了したとき
    if (
      prevState.status !== this.state.status &&
      prevState.status === "accepted"
    ) {
      clearInterval(this.intervalReqID);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalReqID);
  }
}

export default ViewTemplate;

export const useViewMatchParams = () => {
  const match = useRouteMatch();

  const [groupId] = useState(match?.params?.groupId);
  const [blogCt] = useState(match?.params?.blogCt);
  const [order] = useState(match?.params?.order);
  const [groupKey] = useState(getGroup(groupId));

  return { groupId, blogCt, order, groupKey };
};

export const useViewUrl = (groupId, blogCt, order) => {
  const [imageViewUrl] = useState(
    URLJoin(BASE_URL, "image/", groupId, blogCt, order)
  );
  const [blogViewUrl] = useState(URLJoin(BASE_URL, "blog/", groupId, blogCt));

  return { imageViewUrl, blogViewUrl };
};

export const useView = (blogViewUrl, order, updateMetaVerView) => {
  const location = useLocation();

  const [images, setImages] = useState();
  const [blog, setBlog] = useState();

  const [status, setStatus] = useState("");
  const [viewKey, setViewKey] = useState("");
  const [downloadKey, setDownloadKey] = useState("");

  const [isReadyView, setIsReadyView] = useState(false);

  useAxios(blogViewUrl, "get", {
    thenCallback: (res) => {
      let blogData = {};
      if (!status && res.data["status"] !== "blog_not_found") {
        blogData = deepCvtKeyFromSnakeToCamel({ ...res.data });
      }

      if (res.data["status"] === "success") {
        // order error
        if (
          typeof order !== "undefined" &&
          res.data["images"].length <= order
        ) {
          setStatus("get_image_failed");
          setBlog(blogData);
          updateMetaVerView("get_image_failed");
        } else {
          setBlog(blogData);
          setImages(
            res.data["images"].map((image) => deepCvtKeyFromSnakeToCamel(image))
          );
          setStatus("success");
          setViewKey(res.data["VIEW_KEY"]);
          setDownloadKey(res.data["DOWNLOAD_KEY"]);

          updateMetaVerView("success", blogData.title, blogData.writer.name);
        }
      } else if (res.data["status"] === "blog_not_found") {
        setStatus("blog_not_found");
        updateMetaVerView("blog_not_found");
      }
    },
    finallyCallback: () => {
      gtagTo(location.pathname);
    },
    shouldRequestDidMount: true,
  });

  useEffect(() => {
    if (
      !isReadyView &&
      typeof images !== "undefined" &&
      typeof blog !== "undefined" &&
      typeof status === "string" &&
      status.length > 0 &&
      typeof viewKey === "string" &&
      viewKey.length > 0 &&
      typeof downloadKey === "string" &&
      downloadKey.length > 0
    ) {
      setIsReadyView(true);
    }
  }, [images, blog, status, viewKey, downloadKey]);

  return [images, setImages, blog, status, viewKey, downloadKey, isReadyView];
};

export const useViewNum = (images, setImages) => {
  const [numOfViewsOnlyBlog, setNumOfViewsOnlyBlog] = useState(0);
  const [numOfDownloadsOnlyBlog, setNumOfDownloadsOnlyBlog] = useState(0);

  const incrementNumOfViews = (order = -1) => {
    if (order < 0) {
      // blog
      setNumOfViewsOnlyBlog(numOfViewsOnlyBlog + 1);
    } else {
      // image
      let _images = [...images];
      if (_images.length > order) {
        _images[Number(order)].numOfViews += 1;
        setImages(_images);
      }
    }
  };

  const incrementNumOfDownloads = (order = -1, num = 1) => {
    if (order < 0) {
      // 総DL数
      setNumOfDownloadsOnlyBlog(numOfDownloadsOnlyBlog + num);
    } else {
      // DL数
      let _images = [...images];
      if (_images.length > order) {
        _images[Number(order)].numOfDownloads += num;
        setImages(_images);
      }
    }
  };

  return {
    numOfViewsOnlyBlog,
    incrementNumOfViews,
    numOfDownloadsOnlyBlog,
    incrementNumOfDownloads,
  };
};
