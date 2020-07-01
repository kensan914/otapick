import React from 'react';
import BlogCard from '../molecules/BlogCard';
import { HorizontalLoader } from '../molecules/Loader';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import { URLJoin, getGroup } from '../tools/support';
import { withRouter } from 'react-router-dom';
import { BASE_URL, DELAY_TIME } from '../tools/env';
import ImageCard from '../molecules/ImageCard';


class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      items: [],
    };
    this.getItemList = this.getItemList.bind(this);

    this.loading = false;
    this.page = 1;
  }

  componentDidMount() {
    this.getItemList(this.page);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.hasMore !== this.state.hasMore && !this.state.hasMore) {
      this.props.applyShowFooter(this.props.location);
    }
  }

  render() {
    const options = {
      itemSelector: '.grid-item',
      // transitionDuration: "0.1s",
      transitionDuration: 0,
      stagger: 0
    };

    return (
      <InfiniteScroll
        hasMore={this.state.hasMore}
        loadMore={() => this.getItemList(this.page)}
        initialLoad={false}
        loader={<HorizontalLoader />}
        className="mb-5"
      >
        <Masonry options={options}>
          {this.generateCards()}
        </Masonry>
      </InfiniteScroll >
    );
  };
};


class BlogList_ extends List {
  constructor(props) {
    super(props);
  }

  getItemList(page) {
    if (this.state.hasMore && !this.loading) {
      this.loading = true;

      console.log('スタートgetBlogList, ' + page);
      const url = URLJoin(BASE_URL, "api/blogs/", this.props.groupID, this.props.ct);
      console.log('blogs', url);

      setTimeout(() => {
        axios
          .get(url, { params: { page: page, sort: this.props.orderFormat, keyword: this.props.narrowingKeyword, post: this.props.narrowingPost } })
          .then(res => {
            if (res.data.length > 0) {
              const newBlogs = res.data.map((blog, index) =>
                ({
                  groupID: blog.group_id,
                  blogCt: blog.blog_ct,
                  title: blog.title,
                  postDate: blog.post_date,
                  writer: blog.writer,
                  numOfViews: blog.num_of_views,
                  numOfDownloads: blog.num_of_downloads,
                  thumbnail: blog.thumbnail,
                  url: blog.url,
                  officialUrl: blog.official_url,
                })
              );

              if (res.data.length < 20) {
                this.setState(state => ({
                  items: state.items.concat(newBlogs),
                  hasMore: false,
                }));
              } else {
                this.setState(state => ({
                  items: state.items.concat(newBlogs),
                }));
              }
            } else {
              this.setState({ hasMore: false });
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(
            () => {
              console.log("エンドgetBlogList, " + page)
              this.loading = false;
              this.page += 1;
            }
          )
      }, DELAY_TIME);
    }
    else console.log("getBlogList失敗");
  };

  generateCards = () =>
    this.state.items.map(({ groupID, blogCt, title, postDate, writer, numOfViews, numOfDownloads, thumbnail, url, officialUrl }, i) => (
      <BlogCard key={i} id={i} groupID={this.props.groupID || groupID} group={this.props.group || getGroup(groupID)} blogCt={blogCt} thumbnail={thumbnail}
        title={title} writer={writer} postDate={postDate} numOfViews={numOfViews} numOfDownloads={numOfDownloads} url={url}
        officialUrl={officialUrl} />
    ))
}


class ImageList_ extends List {
  constructor(props) {
    super(props);
    this.randomSeed = Math.floor(Math.random() * (10 ** 10));
  }

  getItemList(page) {
    if (this.state.hasMore && !this.loading) {
      this.loading = true;

      console.log('スタートgetImageList, ' + page);
      const url = URLJoin(BASE_URL, "api/images/", this.props.groupID, this.props.ct);
      console.log('images', url);

      setTimeout(() => {
        axios
          .get(url, { params: { page: page, random_seed: this.randomSeed, sort: this.props.orderFormat } })
          .then(res => {
            if (res.data.length > 0) {
              const newImages = res.data.map((item, index) =>
                ({
                  groupID: item.blog.group_id,
                  blogCt: item.blog.blog_ct,
                  blogTitle: item.blog.title,
                  src: item.image.src,
                  url: item.image.url,
                  blogUrl: item.blog.url,
                  officialUrl: item.blog.official_url,
                  writer: item.blog.writer,
                })
              );
              if (res.data.length < 20) {
                this.setState(state => ({
                  items: state.items.concat(newImages),
                  hasMore: false,
                }));
              } else {
                this.setState(state => ({
                  items: state.items.concat(newImages),
                }));
              }
            } else {
              this.setState({ hasMore: false });
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(
            () => {
              console.log("エンドgetImageList, " + page)
              this.loading = false;
              this.page += 1;
            }
          )
      }, DELAY_TIME);
    }
    else console.log("getImageList失敗");
  };

  generateCards = () =>
    this.state.items.map(({ groupID, blogCt, blogTitle, src, url, blogUrl, officialUrl, writer }, i) => (
      <ImageCard key={i} id={i} groupID={this.props.groupID || groupID} group={this.props.group || getGroup(groupID)} blogCt={blogCt} blogTitle={blogTitle}
        src={src} url={url} blogUrl={blogUrl} officialUrl={officialUrl} writer={writer}/>
    ))
}


export const BlogList = withRouter(BlogList_);
export const ImageList = withRouter(ImageList_);