import React from "react";
import BlogListInfo from '../molecules/BlogListInfo';
import BlogList from '../organisms/BlogList';
import Headline from '../molecules/Headline';


class BlogSearchListTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.getGroup(this.props.match.params.groupID),
      groupID: this.props.match.params.groupID,
      // ct: this.props.match.params.ct,
    }
  };

  // pushHistory(qs) {
  //   const currentQs = queryString.parse(this.props.location.search);
  //   if (!qs.sort) { delete currentQs.keyword; delete currentQs.post; }
  //   const queryParamsHash = Object.assign(currentQs, qs);
  //   let queryParams = "";
  //   Object.keys(queryParamsHash).forEach((qsKey, index) => {
  //     if (index == 0) queryParams += `?${qsKey}=${queryParamsHash[qsKey]}`;
  //     else queryParams += `&${qsKey}=${queryParamsHash[qsKey]}`;
  //   })
  //   this.props.history.push(this.props.URLJoin(this.props.match.url, queryParams));
  // }

  componentDidMount() {
    console.log('componentDidMount');
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate ');
  }

  render() {
    return (
      <>
        <Headline title="検索結果" />
        <BlogListInfo groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat} narrowingKeyword={this.state.narrowingKeyword}
          narrowingPost={this.state.narrowingPost} URLJoin={this.props.URLJoin} baseURL={this.props.baseURL} location={this.props.location} pushHistory={(qs) => this.pushHistory(qs)} />
        <BlogList groupID={this.state.groupID} ct={this.state.ct} group={this.state.group} orderFormat={this.state.orderFormat} narrowingKeyword={this.state.narrowingKeyword}
          narrowingPost={this.state.narrowingPost} URLJoin={this.props.URLJoin} baseURL={this.props.baseURL} location={this.props.location} history={this.props.history} />
      </>
    );
  };
};

export default BlogSearchListTemplate;