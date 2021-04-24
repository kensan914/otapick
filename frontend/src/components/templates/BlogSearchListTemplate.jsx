import React from "react";
import BlogSearchListInfo from "../molecules/info/BlogSearchListInfo";
import Headline from "../molecules/Headline";
import {
  getGroup,
  generateWavesVals,
  updateMeta,
  gtagTo,
  isMobile,
} from "../modules/utils";
import { OrderlyBlogCard } from "../molecules/BlogCard";
import axios from "axios";
import { URLJoin } from "../modules/utils";
import queryString from "query-string";
import MemberCard from "../molecules/MemberCard";
import { NotFoundMessage } from "../atoms/NotFound";
import { withRouter } from "react-router-dom";
import { BASE_URL, DELAY_TIME } from "../modules/env";
import { LoaderScreen } from "../molecules/Loader";

class BlogSearchListTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.initState = {
      groupID: 0,
      group: "",
      title: "",
      numOfHit: 0,
      blogs: [],
      members: [],
      searchStatus: "",
      searchType: "",
      wavesVals: [],
    };
    this.state = this.initState;
    this.search();
  }

  search() {
    const url = URLJoin(BASE_URL, "search/");

    setTimeout(() => {
      axios
        .get(url, {
          params: {
            q: queryString.parse(this.props.location.search).q,
            ...(isMobile ? { mobile: "true" } : {}), // paginate_by決定のため
          },
        })
        .then((res) => {
          if (res.data["status"] === "success" && res.data["type"] === "url") {
            // redirect to blog view
            if (res.data["items"].length == 1) {
              this.props.history.replace(res.data["items"][0].url);
            }

            const blogs = res.data["items"].map((blog) => ({
              blogCt: blog.blog_ct,
              title: blog.title,
              postDate: blog.post_date,
              writer: blog.writer,
              numOfViews: blog.num_of_views,
              numOfDownloads: blog.num_of_downloads,
              thumbnail: blog.thumbnail,
              url: blog.url,
              officialUrl: blog.official_url,
            }));
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

            updateMeta({
              title: `${res.data["title"]}｜ブログ検索結果`,
              description: "",
            });
          } else if (
            res.data["status"] === "success" &&
            res.data["type"] === "member"
          ) {
            const members = res.data["items"].map((member) => ({
              image: member.image,
              url: member.url,
              officialUrl: member.official_url,
              ct: member.ct,
              lastKanji: member.last_kanji,
              firstKanji: member.first_kanji,
              lastKana: member.last_kana,
              firstKana: member.first_kana,
              belongingGroup: getGroup(member.belonging_group),
            }));
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

            updateMeta({
              title: `"${
                queryString.parse(this.props.location.search).q
              }"｜メンバー検索結果`,
              description: "",
            });
          } else {
            let title;
            if (res.data["type"] === "url")
              title = "ブログが見つかりませんでした。";
            else if (res.data["type"] === "member")
              title = "メンバーが見つかりませんでした。";
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

            if (res.data["type"] === "url")
              updateMeta({ title: "Not Found Blog", description: "" });
            else if (res.data["type"] === "member")
              updateMeta({ title: "Not Found Member", description: "" });
            else updateMeta({ title: "Not Found", description: "" });
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

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.setState(this.initState);
      this.search();
    }
  }

  render() {
    let itemsComponent;
    if (this.state.blogs.length > 0) {
      itemsComponent = this.state.blogs.map(
        (
          {
            blogCt,
            title,
            postDate,
            writer,
            numOfViews,
            numOfDownloads,
            thumbnail,
            url,
            officialUrl,
          },
          i
        ) => (
          <OrderlyBlogCard
            key={i}
            id={i}
            groupID={this.state.groupID}
            group={this.state.group}
            blogCt={blogCt}
            thumbnail={thumbnail}
            title={title}
            writer={writer}
            postDate={postDate}
            numOfViews={numOfViews}
            numOfDownloads={numOfDownloads}
            url={url}
            officialUrl={officialUrl}
          />
        )
      );
    } else if (this.state.members.length > 0) {
      itemsComponent = this.state.members.map(
        (
          {
            image,
            url,
            officialUrl,
            ct,
            lastKanji,
            firstKanji,
            lastKana,
            firstKana,
            belongingGroup,
          },
          i
        ) => (
          <div key={i} className="col-6 col-md-4 col-xl-3 my-2 px-1 px-sm-3">
            <MemberCard
              ct={ct}
              image={image}
              url={url}
              officialUrl={officialUrl}
              lastKanji={lastKanji}
              firstKanji={firstKanji}
              lastKana={lastKana}
              firstKana={firstKana}
              belongingGroup={belongingGroup}
              wavesVals={this.state.wavesVals}
            />
          </div>
        )
      );
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
        <div className="pb-5">
          <NotFoundMessage type="blog" />
        </div>
      );
    } else if (this.state.searchType === "member") {
      contents = (
        <div className="pb-5">
          <NotFoundMessage type="member" />
        </div>
      );
    } else {
      contents = <LoaderScreen type="horizontal" />;
    }

    return (
      <div className="container mt-3 text-muted">
        <Headline title="検索" key={this.props.location.key} />
        <BlogSearchListInfo
          group={this.state.group}
          title={this.state.title}
          numOfHit={this.state.numOfHit}
        />
        {contents}
      </div>
    );
  }
}

export default withRouter(BlogSearchListTemplate);
