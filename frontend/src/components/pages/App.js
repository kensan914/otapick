import React from "react";
import NavigationBar from "../organisms/NavigationBar";
import BlogListTemplate from "../templates/BlogListTemplate";
import BlogSearchListTemplate from "../templates/BlogSearchListTemplate";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-keep-alive";
import { setUserAgent, setBodyPadding, watchCurrentPosition, getIsMobile, isMobile } from "../modules/support";
import Footer from "../organisms/Footer";
import LocationAdmin from "../atoms/LocationAdmin";
import MemberListTemplate from "../templates/MemberListTemplate";
import BlogViewTemplate from "../templates/BlogViewTemplate";
import ImageListTemplate from "../templates/ImageListTemplate";
import ImageViewTemplate from "../templates/ImageViewTemplate";
import HomeTemplate from "../templates/HomeTemplate";
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT, setEnvConstant } from "../modules/env";
import NavigationAdmin from "../atoms/NavigationAdmin";
import NotFound404 from "./NotFound404";
import BottomNavigationBar from "../organisms/BottomNavigationBar";
import TermsTemplate from "../templates/TermsTemplate";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNBShadow: false,
      isShowNB: true,
      isShowSubNB: false,
      isTop: true,
      accessedBlogs: [], // ["1_34360_2341234", "2_34230_51451345"]
      accessedImages: [], // ["1_34360_0_2341234", "2_34230_3_51451345"]
      bottomNavbarRef: null,
      footerRef: null,
    }
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

  setBottomNavbarRef = node => this.setState({ bottomNavbarRef: node });

  setFooterRef = node => this.setState({ footerRef: node });

  setScrollState = (stateList) => {
    for (const [key, value] of Object.entries(stateList)) {
      if (value === null) continue;
      if ((value && !this.state[key]) || (!value && this.state[key])) {
        this.setState(stateList);
        break;
      }
    }
  }

  scrollHandler = e => {
    const result = watchCurrentPosition(this.startPos);
    this.setScrollState(result.stateList);
    this.startPos = result.startPos;
  }

  beforeunloadHandler = e => window.scrollTo(0, 0);

  componentDidMount() {
    window.addEventListener("scroll", this.scrollHandler, true);
    window.addEventListener("beforeunload", this.beforeunloadHandler, true);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollHandler);
    window.removeEventListener("beforeunload", this.beforeunloadHandler);
  }

  render() {
    return (
      <BrowserRouter>
        <LocationAdmin>
          <Provider include={/^(?!ImageView|ImageList).*$/} exclude={/^(ImageView|ImageList).*$/}>
            <NavigationBar />
            <NavigationAdmin isShowNBShadow={this.state.isShowNBShadow} isShowNB={this.state.isShowNB} isShowSubNB={this.state.isShowSubNB} isTop={this.state.isTop} scrollHandler={this.scrollHandler} />
            {isMobile && <BottomNavigationBar ref={this.setBottomNavbarRef} />}

            <Switch>
              <Route exact path="/" render={() =>
                <HomeTemplate applyShowFooter={(l) => this.state.footerRef.applyShowFooter(l)} />
              } />

              <Route exact path="/blogs/" render={() =>
                <BlogListTemplate applyShowFooter={(l) => this.state.footerRef.applyShowFooter(l)} />
              } />
              <Route exact path="/blogs/:groupID" render={() =>
                <BlogListTemplate applyShowFooter={(l) => this.state.footerRef.applyShowFooter(l)} />
              } />
              <Route exact path="/blogs/:groupID/:ct" render={() =>
                <BlogListTemplate applyShowFooter={(l) => this.state.footerRef.applyShowFooter(l)} />
              } />

              <Route exact path="/images/" render={() =>
                <ImageListTemplate applyShowFooter={(l) => this.state.footerRef.applyShowFooter(l)} />
              } />
              <Route exact path="/images/:groupID" render={() =>
                <ImageListTemplate applyShowFooter={(l) => this.state.footerRef.applyShowFooter(l)} />
              } />
              <Route exact path="/images/:groupID/:ct" render={() =>
                <ImageListTemplate applyShowFooter={(l) => this.state.footerRef.applyShowFooter(l)} />
              } />

              <Route exact path="/search/" render={() => <BlogSearchListTemplate />} />

              <Route exact path="/members/" render={() => <MemberListTemplate />} />

              <Route exact path="/blog/:groupID/:blogCt" render={() =>
                <BlogViewTemplate accessedBlogs={this.state.accessedBlogs} setAccessedBlog={(blogID) => this.setAccessedBlog(blogID)} />
              } />

              <Route exact path="/image/:groupID/:blogCt/:order" render={() => {
                return (<Provider include={/^(ImageView|ImageList).*$/} exclude={/^(?!ImageView|ImageList).*$/}>
                  <ImageViewTemplate accessedImages={this.state.accessedImages} setAccessedImage={(imageID) => this.setAccessedImage(imageID)}
                    applyShowFooter={(l) => this.state.footerRef.applyShowFooter(l)} />
                </Provider>
                );
              }} />

              <Route exact path="/contact/" render={() => <TermsTemplate mode="contact" />} />
              <Route exact path="/terms-of-service/" render={() => <TermsTemplate mode="termsOfService" />} />
              <Route exact path="/privacy-policy/" render={() => <TermsTemplate mode="privacyPolicy" />} />
              
              <Route render={() =>
                <NotFound404 footerRef={this.state.footerRef} applyShowFooter={(l) => this.state.footerRef.applyShowFooter(l)} />
              } />
            </Switch>

            <Footer ref={this.setFooterRef} />
          </Provider>
        </LocationAdmin>
      </BrowserRouter>
    );
  }
}

export default App;