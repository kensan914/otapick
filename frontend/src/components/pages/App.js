import React from "react";
import NavigationBar from '../organisms/NavigationBar';
import BlogListTemplate from '../templates/BlogListTemplate';
import BlogSearchListTemplate from '../templates/BlogSearchListTemplate';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from 'react-keep-alive';
import { setUserAgent, setBodyPadding, watchCurrentPosition, getIsMobile } from '../tools/support';
import Footer from '../organisms/Footer';
import LocationAdmin from "../atoms/LocationAdmin";
import MemberListTemplate from "../templates/MemberListTemplate";
import BlogViewTemplate from "../templates/BlogViewTemplate";
import ImageListTemplate from "../templates/ImageListTemplate";
import ImageViewTemplate from "../templates/ImageViewTemplate";
import HomeTemplate from "../templates/HomeTemplate";
import { NotFoundMessage } from "../atoms/NotFound";
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT, setEnvConstant } from "../tools/env";
import NavigationAdmin from "../atoms/NavigationAdmin";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNBShadow: false,
      isShowNB: true,
      isShowSubNB: false,
      accessedBlogs: [], // ["1_34360_2341234", "2_34230_51451345"]
      accessedImages: [], // ["1_34360_0_2341234", "2_34230_3_51451345"]
    }
    this.footerRef = React.createRef();
    setUserAgent();
    setEnvConstant();
    if (getIsMobile()) setBodyPadding(NAVBAR_HEIGHT + SUB_NAVBAR_HEIGHT);
    else setBodyPadding(NAVBAR_HEIGHT);
    this.startPos = 0;
  }

  setAccessedBlog = (blogID) => {
    this.setState(function (state) {
      state.accessedBlogs.push(blogID)
      return {
        accessedBlogs: state.accessedBlogs
      };
    });
  }

  setAccessedImage = (imageID) => {
    this.setState(function (state) {
      state.accessedImages.push(imageID)
      return {
        accessedImages: state.accessedImages
      };
    });
  }

  setStateIsShowNBShadow = (bool) => {
    if (bool !== null) {
      if (bool && !this.state.isShowNBShadow) {
        this.setState({ isShowNBShadow: true });
      } else if (!bool && this.state.isShowNBShadow) {
        this.setState({ isShowNBShadow: false });
      }
    }
  }

  setStateIsShowNB = (bool) => {
    if (bool !== null) {
      if (bool && !this.state.isShowNB) {
        this.setState({ isShowNB: true });
      } else if (!bool && this.state.isShowNB) {
        this.setState({ isShowNB: false });
      }
    }
  }

  setStateIsShowSubNB = (bool) => {
    if (bool !== null) {
      if (bool && !this.state.isShowSubNB) {
        this.setState({ isShowSubNB: true });
      } else if (!bool && this.state.isShowSubNB) {
        this.setState({ isShowSubNB: false });
      }
    }
  }

  scrollHandler = e => {
    const result = watchCurrentPosition(this.startPos);
    this.setStateIsShowNBShadow(result.isShowNBShadow);
    this.setStateIsShowNB(result.isShowNB);
    this.setStateIsShowSubNB(result.isShowSubNB);
    this.startPos = result.startPos;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollHandler, true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  render() {
    return (
      <BrowserRouter>
        <LocationAdmin>
          <Provider>

            <NavigationBar />
            <NavigationAdmin isShowNBShadow={this.state.isShowNBShadow} isShowNB={this.state.isShowNB} isShowSubNB={this.state.isShowSubNB} />

            <Switch>
              <Route exact path="/" render={({ match, location, history }) =>
                <HomeTemplate match={match} location={location} history={history} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
              } />

              <Route exact path="/blogs/" render={({ match, location, history }) =>
                <BlogListTemplate match={match} location={location} history={history} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
              } />
              <Route exact path="/blogs/:groupID" render={({ match, location, history }) =>
                <BlogListTemplate match={match} location={location} history={history} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
              } />
              <Route exact path="/blogs/:groupID/:ct" render={({ match, location, history }) =>
                <BlogListTemplate match={match} location={location} history={history} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
              } />

              <Route exact path="/images/" render={({ match, location, history }) =>
                <ImageListTemplate match={match} location={location} history={history} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
              } />
              <Route exact path="/images/:groupID" render={({ match, location, history }) =>
                <ImageListTemplate match={match} location={location} history={history} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
              } />
              <Route exact path="/images/:groupID/:ct" render={({ match, location, history }) =>
                <ImageListTemplate match={match} location={location} history={history} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
              } />

              <Route exact path="/search/" render={({ match, location, history }) =>
                <BlogSearchListTemplate match={match} location={location} history={history} />
              } />

              <Route exact path="/members/" render={({ match, location, history }) =>
                <MemberListTemplate match={match} location={location} history={history} />
              } />

              <Route exact path="/blog/:groupID/:blogCt" render={({ match, location, history }) =>
                <BlogViewTemplate match={match} location={location} history={history} accessedBlogs={this.state.accessedBlogs} setAccessedBlog={(blogID) => this.setAccessedBlog(blogID)} />
              } />

              <Route exact path="/image/:groupID/:blogCt/:order" render={({ match, location, history }) =>
                <ImageViewTemplate match={match} location={location} history={history} accessedImages={this.state.accessedImages} setAccessedImage={(imageID) => this.setAccessedImage(imageID)}
                  applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
              } />

              <Route render={() => <div className="container mt-3 text-muted py-5"><NotFoundMessage type="404" margin={true} /></div>} />
            </Switch>

            <Footer ref={this.footerRef} />
          </Provider>
        </LocationAdmin>
      </BrowserRouter>
    );
  }
}

export default App;