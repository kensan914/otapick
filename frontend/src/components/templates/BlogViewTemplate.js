import React from "react";
import Headline from '../molecules/Headline';
import { getGroup } from '../tools/support';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import BlogViewInfo from "../molecules/BlogInfo";
import BlogView from "../organisms/BlogView";


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
    }
  };

  getBlog() {
    const url = URLJoin(this.props.baseURL, "api/blog/", this.state.groupID, this.state.blogCt);

    setTimeout(() => {
      axios
        .get(url)
        .then(res => {
          if (res.data["status"] === "success") {
            this.setState({
              title: res.data["title"],
              postDate: res.data["post_date"],
              writer: res.data["writer"],
              numOfViews: res.data["num_of_views"],
              numOfDownloads: res.data["num_of_downloads"],
              officialUrl: res.data["official_url"],
              images: res.data["images"],
              status: res.data["status"],
            });
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(
        )
    }, 300);
  }

  componentDidMount() { this.getBlog() }

  render() {
    return (
      <>
        <Headline title="保存" />
        <BlogViewInfo group={this.state.group} title={this.state.title} writer={this.state.writer} postDate={this.state.postDate}
          officialUrl={this.state.officialUrl} numOfViews={this.state.numOfViews} numOfDownloads={this.state.numOfDownloads} />
        <BlogView group={this.state.group} images={this.state.images}/>
      </>
    );
  };
};

export default BlogViewTemplate;