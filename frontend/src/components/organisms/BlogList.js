import React from 'react';
import BlogCard from '../molecules/BlogCard';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';


class BlogList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      elements: [
        {
          full_kanji: 'init1-1',
          full_kana: 'init1-2',
        },
        {
          full_kanji: 'init2-1',
          full_kana: 'init2-2',
        }
      ],
    };
    this.getBlogList = this.getBlogList.bind(this);
  }

  getBlogList() {
    setTimeout(() => {
      axios
        .get('http://192.168.99.100:8000/api/member/1/')
        .then(res => {
          const newElements = res.data.map((member, index) =>
            ({
              full_kanji: member.full_kanji,
              full_kana: member.full_kana,
            })
          );

          console.log(newElements);

          this.setState(state => ({
            elements: state.elements.concat(newElements),
          }));
        })
        .catch(err => {
          console.log(err);
        });
    }, 0);
  };

  render() {
    console.log("nibu");
    const options = {
      itemSelector: '.grid-item',
    };

    return (

      <InfiniteScroll
        hasMore={this.state.hasMore}
        loadMore={this.getBlogList}
      >
        <Masonry options={options}>
          {
            this.state.elements.map(({ full_kanji, full_kana }, i) => (
              <BlogCard key={i} group="hinata" img="../../../../static/img/intro_back.png" title={full_kanji} writer={full_kana} postDate="20/02/02" num_of_views="100" num_of_downloads="200" />
            ))
          }
        </Masonry>
      </InfiniteScroll>
    );
  };
};


export default BlogList;