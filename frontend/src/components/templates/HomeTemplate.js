import React from "react";
import { HomeList } from '../organisms/List';
import Headline from '../molecules/Headline';
import { KeepAlive } from 'react-keep-alive';
import ToTopButton from "../atoms/ToTopButton";
import { URLJoin, generateKeepAliveName, isMobile, generateKeepAliveNameInfo } from '../tools/support';
import { BASE_URL } from "../tools/env";
import ImageListInfo from "../molecules/info/ImageListInfo";
import { withRouter } from "react-router-dom";


class HomeTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keepAliveName: generateKeepAliveName(props.location.key),
      keepAliveNameInfo: generateKeepAliveNameInfo(props.location.key),
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({
        keepAliveName: generateKeepAliveName(this.props.location.key),
      });
    }
  }

  render() {
    return (
      <div className={"container text-muted mt-3"}>
        <Headline type="home" />

        <KeepAlive name={this.state.keepAliveNameInfo}>
          <ImageListInfo groupID={0} keepAliveNameInfo={this.state.keepAliveNameInfo} hide={true} home={true} />
        </KeepAlive>

        {!isMobile && <div className="py-2"></div>}
        <KeepAlive name={this.state.keepAliveName}>
          <HomeList url={URLJoin(BASE_URL, "api/home/")} applyShowFooter={this.props.applyShowFooter} />
        </KeepAlive>

        <ToTopButton />
      </div>
    );
  };
};

export default withRouter(HomeTemplate);