import React from "react";
import BlogSearchListInfo from '../molecules/BlogSearchListInfo';
import Headline from '../molecules/Headline';
import { getGroup, generateWavesVals } from '../tools/support';
import { OrderlyBlogCard } from '../molecules/BlogCard';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import queryString from 'query-string';
import MemberCard from "../molecules/MemberCard";
import { NotFoundBlogs, NotFoundMembers } from "../atoms/NotFound";


class BlogSearchListTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupID: 0,
      group: "",
      title: "",
      numOfHit: 0,
      blogs: [],
      members: [],
      searchStatus: "",
      searchType: "",
      wavesVals: [],
    }
    this.search();
  };

  search() {
    const url = URLJoin(this.props.baseURL, "api/search/");

    setTimeout(() => {
      axios
        .get(url, { params: { q: queryString.parse(this.props.location.search).q } })
        .then(res => {
          if (res.data["status"] === "success" && res.data["type"] === "url") {
            const blogs = res.data["items"].map((blog, index) =>
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
            this.setState({
              groupID: res.data["group_id"],
              group: getGroup(res.data["group_id"]),
              title: res.data["title"],
              numOfHit: res.data["num_of_hit"],
              blogs: blogs,
              members: [],
              searchStatus: res.data["status"],
              searchType: res.data["type"],
            });
          } else if (res.data["status"] === "success" && res.data["type"] === "member") {
            const members = res.data["items"].map((member, index) =>
              ({
                image: member.image,
                url: member.url,
                offcialUrl: member.official_url,
                ct: member.ct,
                lastKanji: member.last_kanji,
                firstKanji: member.first_kanji,
                lastKana: member.last_kana,
                firstKana: member.first_kana,
                belongingGroup: getGroup(member.belonging_group),
              })
            );
            this.setState({
              groupID: 0,
              group: "",
              title: `"${queryString.parse(this.props.location.search).q}"`,
              numOfHit: res.data["num_of_hit"],
              members: members,
              blogs: [],
              searchStatus: res.data["status"],
              searchType: res.data["type"],
              wavesVals: generateWavesVals(),
            });
          } else {
            let title;
            if (res.data["type"] === "url") title = "ブログが見つかりませんでした。";
            else if (res.data["type"] === "member") title = "メンバーが見つかりませんでした。";
            else title = "条件に合う結果が見つかりませんでした。";
            this.setState({
              groupID: 0,
              group: "",
              title: title,
              numOfHit: 0,
              blogs: [],
              members: [],
              searchStatus: res.data["status"],
              searchType: res.data["type"],
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

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.search();
    }
  }

  render() {
    let itemsComponent;
    if (this.state.blogs.length > 0) {
      itemsComponent = this.state.blogs.map(({ blogCt, title, postDate, writer, numOfViews, numOfDownloads, thumbnail, url, officialUrl }, i) => (
        <OrderlyBlogCard key={i} id={i} groupID={this.state.groupID} group={this.state.group} blogCt={blogCt} thumbnail={thumbnail}
          title={title} writer={writer} postDate={postDate} numOfViews={numOfViews} numOfDownloads={numOfDownloads} url={url}
          officialUrl={officialUrl} />
      ))
    } else if (this.state.members.length > 0) {
      itemsComponent = this.state.members.map(({ image, url, offcialUrl, ct, lastKanji, firstKanji, lastKana, firstKana, belongingGroup }, i) => (
        <MemberCard key={i} ct={ct} image={image} url={url} offcialUrl={offcialUrl} lastKanji={lastKanji} firstKanji={firstKanji} lastKana={lastKana}
          firstKana={firstKana} belongingGroup={belongingGroup} wavesVals={this.state.wavesVals} />
      ))
    } else itemsComponent = null;

    let contents;
    if (itemsComponent !== null && this.state.searchStatus === "success") {
      contents = (
        <div className="container">
          <div className="row mb-5" style={{ marginTop: "2rem" }}>
            {itemsComponent}
          </div>
        </div>
      );
    } else if (this.state.searchType === "url") {
      contents = (
        <div className="container px-4 pb-5">
          <NotFoundBlogs />
        </div>
      );
    } else if (this.state.searchType === "member") {
      contents = (
        <div className="container px-4 pb-5">
          <NotFoundMembers />
        </div>
      );
    }

    return (
      <>
        <Headline title="検索" />
        <BlogSearchListInfo group={this.state.group} title={this.state.title} numOfHit={this.state.numOfHit} />
        {contents}
      </>
    );
  };
};

export default BlogSearchListTemplate;