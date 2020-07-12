import React from "react";
import { HomeList } from '../organisms/List';
import Headline from '../molecules/Headline';
import { KeepAlive } from 'react-keep-alive';
import ToTopButton from "../atoms/ToTopButton";
import { URLJoin, generateKeepAliveName, isMobile } from '../tools/support';
import { BASE_URL } from "../tools/env";


class HomeTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keepAliveName: generateKeepAliveName(props.location.key),
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({
        keepAliveName: generateKeepAliveName(this.props.location.key),
      })
    }
  }

  render() {
    return (
      <div className={"container text-muted " + (!isMobile ? "mt-3" : "mt-1")}>
        <Headline type="home" />
        {!isMobile && <div className="py-2"></div> }
        <KeepAlive name={this.state.keepAliveName}>
          <HomeList url={URLJoin(BASE_URL, "api/home/")} applyShowFooter={this.props.applyShowFooter} />
        </KeepAlive>
        {!this.props.isTop && <ToTopButton />}
      </div>
    );
  };
};

export default HomeTemplate;