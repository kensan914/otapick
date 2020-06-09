import React from 'react';
import BlogCard from '../molecules/BlogCard';
import Loader from '../atoms/Loader';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';


class OrderlyBlogList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    const options = {
      itemSelector: '.grid-item',
      transitionDuration: 0,
      stagger: 0
    };

    return (
      <InfiniteScroll
        hasMore={this.state.hasMore}
        loadMore={this.setBlogList}
        initialLoad={true}
        loader={<Loader />}
      >
        <Masonry options={options}>
          {
            this.state.blogs.map(({ blogCt, title, postDate, writer, writerCt, numOfViews, numOfDownloads, thumbnail }, i) => (
              <BlogCard key={i} id={i} groupID={this.props.groupID} group={this.props.group} blogCt={blogCt} thumbnail={thumbnail} title={title} writer={writer} writerCt={writerCt} postDate={postDate} numOfViews={numOfViews} numOfDownloads={numOfDownloads} />
            ))
          }
        </Masonry>
      </InfiniteScroll >
    );
  };
};


export default OrderlyBlogList;