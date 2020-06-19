import React from 'react';
import BlogCard from '../molecules/BlogCard';
import { HorizontalLoader } from '../molecules/Loader';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import { withRouter } from 'react-router-dom';
import { BASE_URL } from '../tools/env';


class BlogList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      blogs: [],
    };
    this.setBlogList = this.setBlogList.bind(this);

    this.loading = false;
    this.page = 1;
  }

  setBlogList(page) {
    if (this.state.hasMore && !this.loading) {
      this.loading = true;

      console.log('スタートsetBlogList, ' + page);
      const url = URLJoin(BASE_URL, "api/blogs/", this.props.groupID, this.props.ct);
      console.log('blogs', url);

      setTimeout(() => {
        axios
          .get(url, { params: { page: page, sort: this.props.orderFormat, keyword: this.props.narrowingKeyword, post: this.props.narrowingPost } })
          .then(res => {
            if (res.data.length > 0) {
              const newBlogs = res.data.map((blog, index) =>
                ({
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
                  blogs: state.blogs.concat(newBlogs),
                  hasMore: false,
                }));
              } else {
                this.setState(state => ({
                  blogs: state.blogs.concat(newBlogs),
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
              console.log("エンドsetBlogList, " + page)
              this.loading = false;
              this.page += 1;
            }
          )
      }, 2000);

    }
    else console.log("setBlogList失敗");
  };

  componentDidMount() {
    this.setBlogList(this.page);
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
        loadMore={() => this.setBlogList(this.page)}
        initialLoad={false}
        loader={<HorizontalLoader />}
        className="mb-5"
      >
        <Masonry options={options}>
          {
            this.state.blogs.map(({ blogCt, title, postDate, writer, numOfViews, numOfDownloads, thumbnail, url, officialUrl }, i) => (
              <BlogCard key={i} id={i} groupID={this.props.groupID} group={this.props.group} blogCt={blogCt} thumbnail={thumbnail}
                title={title} writer={writer} postDate={postDate} numOfViews={numOfViews} numOfDownloads={numOfDownloads} url={url}
                officialUrl={officialUrl} />
            ))
          }
        </Masonry>
      </InfiniteScroll >
    );
  };
};


export default withRouter(BlogList);