import React from "react";
import Headline from '../molecules/Headline';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import { BlogViewLoader, LoaderScreen } from "../molecules/Loader";
import { LOAD_IMG_URL, BASE_URL } from "../tools/env";
import { withRouter } from 'react-router-dom';
import { NotFoundMessage } from "../atoms/NotFound";
import ImageView from "../organisms/ImageView";
import { ViewTemplate } from "./BlogViewTemplate";
import BackButton from "../atoms/BackButton";


class ImageViewTemplate extends ViewTemplate {
  constructor(props) {
    super(props);
    this.state["order"] = this.props.match.params.order;
    this.imageViewURL = URLJoin(BASE_URL, "api/image/", this.state.groupID, this.state.blogCt, this.props.match.params.order);
  }

  putView() {
    axios
      .put(this.imageViewURL, {
        action: 'view',
        key: this.state.VIEW_KEY,
      }, {
        headers: {
          'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').getAttribute('value')
        }
      })
      .then(res => {
        if (res.data["status"] == "success") {
          this.incrementNumOfViews(this.state.order);
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    // image が view されたとき
    if (prevState.status !== this.state.status && this.state.status === "success") {
      if (this.state.VIEW_KEY) {
        if (!this.props.accessedImages.includes(`${this.state.groupID}_${this.state.blogCt}_${this.state.order}_${this.props.location.key}`)) {
          console.log("描画されました。");
          this.putView();
          this.props.setAccessedImage(`${this.state.groupID}_${this.state.blogCt}_${this.state.order}_${this.props.location.key}`);
        }
      }
    }

    // accepted
    super.componentDidUpdate(prevProps, prevState);
  }

  render() {
    let contents;
    if (this.state.status === "") {
      contents = (<LoaderScreen type="horizontal" />);
    } else if (this.state.status === "success") {
      contents = (
        <ImageView group={this.state.group} image={this.state.images[this.state.order]} officialUrl={this.state.officialUrl}
          title={this.state.title} blogUrl={this.state.url} writer={this.state.writer} incrementNumOfDownloads={() => this.incrementNumOfDownloads(this.state.order)} />);
    } else if (this.state.status === "accepted") {
      contents = (<BlogViewLoader progress={this.state.progress} loadingImageUrl={LOAD_IMG_URL} />);
    } else if (this.state.status === "blog_not_found" || this.state.status === "get_image_failed") {
      contents = (<div className="pb-5"><NotFoundMessage type="blogFailed" /></div>);
    }
    return (
      <>
        <BackButton fixed={true} className="in-image-view" />
        {contents}
      </>
    );
  }
}


export default withRouter(ImageViewTemplate);