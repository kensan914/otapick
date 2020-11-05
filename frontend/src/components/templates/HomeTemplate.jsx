import React from "react";
import HomeList from '../organisms/List/HomeList';
import Headline from '../molecules/Headline';
import ToTopButton from "../atoms/ToTopButton";
import { isMobile } from '../modules/utils';
import ImageListInfo from "../molecules/info/ImageListInfo";
import { withRouter } from "react-router-dom";


class HomeTemplate extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <div className={"container text-muted mt-3"}>
        <Headline type="home" />

        <ImageListInfo groupID={0} hide={true} home={true} />

        {!isMobile && <div className="py-2"></div>}
        <HomeList />

        <ToTopButton />
      </div>
    );
  };
};

export default withRouter(HomeTemplate);