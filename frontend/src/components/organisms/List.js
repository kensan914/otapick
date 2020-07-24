import React from 'react';
import BlogCard from '../molecules/BlogCard';
import { HorizontalLoader } from '../molecules/Loader';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import { URLJoin, getGroup, generateRandomSeed, generateWavesVals, isMobile, generateKeepAliveName, isSmp, updateMeta } from '../tools/support';
import { withRouter } from 'react-router-dom';
import { BASE_URL, DELAY_TIME, BLOGS_DISCRIPTION, ADS_INTERVAL, ADS_INDEX, ADS_INTERVAL_MORE } from '../tools/env';
import ImageCard from '../molecules/ImageCard';
import MemberCard from "../molecules/MemberCard";
import { NotFoundMessage } from '../atoms/NotFound';
import { SquareAds, LandscapeAds } from '../atoms/Adsense';


class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      items: [],
      status: "",
    };
    this.getItemList = this.getItemList.bind(this);

    this.loading = false;
    this.page = 1;
  }

  componentDidMount() {
    this.getItemList(this.page);
  }

  componentDidUpdate(prevProps, prevState) {
    // KeepAliveにより、UnMountされずにDOM上に保存されているコンポーネントは、裏でcomponentDidUpdateが常に働いているため、
    // このようにそのページのlocation.keyと照合して適切に実行制限をかけてあげる必要がある。
    if (this.props.keepAliveName === generateKeepAliveName(this.props.location.key)) {
      if (prevState.hasMore !== this.state.hasMore && !this.state.hasMore) {
        this.props.applyShowFooter(this.props.location);
      }
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
      <>
        {/* related image title */}
        {(this.props.related && this.state.isShowRelatedImageTitle && this.state.status === "success") &&
          <h3 className={"text-center related-image-title " + (isSmp ? "mt-2" : "")}>関連画像</h3>
        }

        <InfiniteScroll
          hasMore={this.state.hasMore}
          loadMore={() => this.getItemList(this.page)}
          initialLoad={false}
          loader={<HorizontalLoader />}
          className="mb-5"
        >
          {this.state.status === "success" &&
            <Masonry options={options}>
              {this.generateCards()}
            </Masonry>
          }
          {this.state.status === "blog_not_found" &&
            <div><NotFoundMessage type="blogFailed" margin={true} /></div>
          }
          {(this.state.status === "image_not_found" && !this.props.related) &&
            <div><NotFoundMessage type="imageFailed" margin={true} /></div>
          }

        </InfiniteScroll >
      </>
    );
  };
};


class BlogList_ extends List {
  constructor(props) {
    super(props);
    this.randomSeed = generateRandomSeed();
  }

  getItemList(page) {
    if (this.state.hasMore && !this.loading) {
      this.loading = true;
      const url = URLJoin(BASE_URL, "api/blogs/", this.props.groupID, this.props.ct);

      setTimeout(() => {
        axios
          .get(url, { params: { page: page, sort: this.props.orderFormat, keyword: this.props.narrowingKeyword, post: this.props.narrowingPost, random_seed: this.randomSeed } })
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
                  status: "success",
                }));
              } else {
                this.setState(state => ({
                  items: state.items.concat(newBlogs),
                  status: "success",
                }));
              }
            } else {
              if (page == 1) {
                this.setState({ hasMore: false, status: "blog_not_found" })
              } else this.setState({ hasMore: false });
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(
            () => {
              this.loading = false;
              this.page += 1;
            }
          )
      }, DELAY_TIME);
    }
  };

  generateCards = () => {
    return (this.state.items.map(({ groupID, blogCt, title, postDate, writer, numOfViews, numOfDownloads, thumbnail, url, officialUrl }, i) => (
      <>
        <div className="grid-item col-6 col-md-4 col-lg-3 my-2 px-2 px-sm-3 blog-card">
          <BlogCard key={i} id={i} groupID={this.props.groupID || groupID} group={this.props.group || getGroup(groupID)} blogCt={blogCt} thumbnail={thumbnail}
            title={title} writer={writer} postDate={postDate} numOfViews={numOfViews} numOfDownloads={numOfDownloads} url={url} officialUrl={officialUrl} />
        </div>
        {(i % ADS_INTERVAL === ADS_INDEX) &&
          <div className="grid-item col-6 col-md-4 col-lg-3 my-2 px-2 px-sm-3">
            <SquareAds />
          </div>
        }
      </>
    )));
  }
}


class ImageList_ extends List {
  constructor(props) {
    super(props);
    this.randomSeed = generateRandomSeed();
    this.state["isShowRelatedImageTitle"] = false;
    this.state["status"] = "";
  }

  getItemList(page) {
    if (this.state.hasMore && !this.loading) {
      this.loading = true;

      let url;
      if (typeof this.props.url == "undefined") {
        url = URLJoin(BASE_URL, "api/images/", this.props.groupID, this.props.ct);
      } else {
        url = this.props.url;
      }

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
                  status: "success",
                }));
              } else {
                this.setState(state => ({
                  items: state.items.concat(newImages),
                  status: "success",
                }));
              }
            } else {
              if (page == 1) {
                this.setState({ hasMore: false, status: "image_not_found" });
              } else this.setState({ hasMore: false });
            }

            // relatedImageTitle表示
            this.setState({ isShowRelatedImageTitle: true });
          })
          .catch(err => {
            console.log(err);
          })
          .finally(
            () => {
              this.loading = false;
              this.page += 1;
            }
          )
      }, DELAY_TIME);
    }
  };

  generateCards = () =>
    this.state.items.map(({ groupID, blogCt, blogTitle, src, url, blogUrl, officialUrl, writer }, i) => {
      const gridItemClassName = "grid-item " +
        (this.props.related
          ? "col-6 col-md-4 col-lg-3 col-xl-2 px-1 px-sm-2 " + (isMobile ? "my-1 " : "my-3 ")
          : "col-6 col-md-4 col-lg-3 px-1 px-sm-2 " + (isMobile ? "my-1 " : "my-3 "));
      return (
        <>
          <div className={gridItemClassName}>
            <ImageCard key={i} id={i} groupID={this.props.groupID || groupID} group={this.props.group || getGroup(groupID)} blogCt={blogCt} blogTitle={blogTitle}
              src={src} url={url} blogUrl={blogUrl} officialUrl={officialUrl} writer={writer} />
          </div >

          {(!this.props.related && i % ADS_INTERVAL === ADS_INDEX) &&
            <div className={gridItemClassName + (isMobile ? "mb-4" : "")} >
              <SquareAds />
            </div>
          }
        </>
      )
    });
}


class HomeList_ extends ImageList_ {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, {
      additionalItems: [],
      additionalItemsStart: 0,
    });
    this.additionalItemsIndex = 0;
    this.wavesVals = generateWavesVals();
  }

  componentDidMount() {
    super.componentDidMount();
    this.getHomeAdditional();
  }

  getHomeAdditional() {
    setTimeout(() => {
      axios
        .get(URLJoin(BASE_URL, "api/home/additional/"), { params: { random_seed: this.randomSeed } })
        .then(res => {
          if (res.data.length > 0) {
            let additionalItems = [];
            for (const item of res.data) {
              if (item === null) {
                additionalItems.push(null);
              } else if (item.type === "image") {
                additionalItems.push({
                  groupID: item.blog.group_id,
                  blogCt: item.blog.blog_ct,
                  blogTitle: item.blog.title,
                  src: item.image.src,
                  url: item.image.url,
                  blogUrl: item.blog.url,
                  officialUrl: item.blog.official_url,
                  writer: item.blog.writer,
                  type: "image",
                  message: item.message,
                });
              } else if (item.type === "blog") {
                additionalItems.push({
                  groupID: item.blog.group_id,
                  blogCt: item.blog.blog_ct,
                  title: item.blog.title,
                  postDate: item.blog.post_date,
                  writer: item.blog.writer,
                  numOfViews: item.blog.num_of_views,
                  numOfDownloads: item.blog.num_of_downloads,
                  thumbnail: item.blog.thumbnail,
                  url: item.blog.url,
                  officialUrl: item.blog.official_url,
                  type: "blog",
                  message: item.message,
                });
              } else if (item.type === "member") {
                additionalItems.push({
                  image: item.member.image,
                  url: item.member.url,
                  officialUrl: item.member.official_url,
                  ct: item.member.ct,
                  lastKanji: item.member.last_kanji,
                  firstKanji: item.member.first_kanji,
                  lastKana: item.member.last_kana,
                  firstKana: item.member.first_kana,
                  belongingGroup: getGroup(item.member.belonging_group),
                  type: "member",
                  message: item.message,
                });
              }
            }

            this.setState({
              additionalItems: additionalItems,
              additionalItemsStart: this.page,
            });
          }
        })
        .catch(err => {
          console.log(err);
        })
    }, DELAY_TIME);
  }

  generateCards = () => {
    this.additionalItemsIndex = 0;
    return this.state.items.map(({ groupID, blogCt, blogTitle, src, url, blogUrl, officialUrl, writer }, i) => {
      let additionalItem;
      if (this.state.additionalItems.length > this.additionalItemsIndex &&
        (Math.floor(i / 20) >= this.state.additionalItemsStart) && // additionalItemsがloadされた以降に表示されるように
        (i % 10 === 0) // item10コごとに表示
      ) {
        const add = this.state.additionalItems[this.additionalItemsIndex];
        if (add === null) {
          additionalItem = null;
        } else if (add.type === "image") {
          additionalItem =
            <ImageCard id={`additional_${this.additionalItemsIndex}`} groupID={add.groupID} group={getGroup(add.groupID)} blogCt={add.blogCt} blogTitle={add.blogTitle}
              src={add.src} url={add.url} blogUrl={add.blogUrl} officialUrl={add.officialUrl} writer={add.writer} message={add.message} />
        } else if (add.type === "blog") {
          additionalItem =
            <BlogCard id={`additional_${this.additionalItemsIndex}`} groupID={add.groupID} group={getGroup(add.groupID)} blogCt={add.blogCt} thumbnail={add.thumbnail} title={add.title}
              writer={add.writer} postDate={add.postDate} numOfViews={add.numOfViews} numOfDownloads={add.numOfDownloads} url={add.url} officialUrl={add.officialUrl} message={add.message} />
        } else if (add.type === "member") {
          additionalItem =
            <MemberCard id={`additional_${this.additionalItemsIndex}`} ct={add.ct} image={add.image} url={add.url} officialUrl={add.officialUrl} lastKanji={add.lastKanji} firstKanji={add.firstKanji} lastKana={add.lastKana}
              firstKana={add.firstKana} belongingGroup={add.belongingGroup} wavesVals={this.wavesVals} message={add.message} />
        }
        this.additionalItemsIndex++;
      }

      const gridItemClassName = "grid-item col-6 col-md-4 col-lg-3 px-1 px-sm-2 " + (isMobile ? "my-1 " : "my-3 ");
      return (<>
        <div className={gridItemClassName}>
          <ImageCard key={i} id={i} groupID={groupID} group={getGroup(groupID)} blogCt={blogCt} blogTitle={blogTitle}
            src={src} url={url} blogUrl={blogUrl} officialUrl={officialUrl} writer={writer} />
        </div >
        {/* additionalItem */}
        {additionalItem &&
          <div className={gridItemClassName}>
            {additionalItem}
          </div>
        }
        {/* Google Adsense */}
        {(i % ADS_INTERVAL === ADS_INDEX) &&
          <div className={gridItemClassName + (isMobile ? "mb-4" : "")} >
            <SquareAds />
          </div>
        }
      </>);
    })
  }
}


export const BlogList = withRouter(BlogList_);
export const ImageList = withRouter(ImageList_);
export const HomeList = withRouter(HomeList_);