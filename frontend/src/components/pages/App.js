import React from "react";
import NavigationBar from '../organisms/NavigationBar';
import BlogListTemplate from '../templates/BlogListTemplate';
import BlogSearchListTemplate from '../templates/BlogSearchListTemplate';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from 'react-keep-alive';
import { scrollTop, setUserAgent } from '../tools/support';
import Footer from '../organisms/Footer';
import KeepScrollTop from "../atoms/KeepScrollTop";
import MemberListTemplate from "../templates/MemberListTemplate";
import BlogViewTemplate from "../templates/BlogViewTemplate";
import ImageListTemplate from "../templates/ImageListTemplate";
import ImageViewTemplate from "../templates/ImageViewTemplate";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTop: true,
      accessedBlogs: [], // ["1_34360_2341234", "2_34230_51451345"]
      accessedImages: [], // ["1_34360_0_2341234", "2_34230_3_51451345"]
    }
    this.footerRef = React.createRef();
    setUserAgent();
  }

  watchCurrentPosition = () => {
    if (scrollTop() === 0 && !this.state.isTop) {
      this.setState({
        isTop: true,
      });
    } else if (scrollTop() !== 0 && this.state.isTop) {
      this.setState({
        isTop: false,
      });
    }
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

  componentDidMount() {
    window.addEventListener('scroll', event => this.watchCurrentPosition(), true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll');
  }

  render() {
    return (
      <BrowserRouter>
        <KeepScrollTop>
          <Provider>

            <NavigationBar isTop={this.state.isTop} />
            <div className="container mt-3 text-muted">
              <Switch>
                <Route exact path="/blogs/" render={({ match, location, history }) =>
                  <BlogListTemplate match={match} location={location} history={history} isTop={this.state.isTop} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
                } />
                <Route exact path="/blogs/:groupID" render={({ match, location, history }) =>
                  <BlogListTemplate match={match} location={location} history={history} isTop={this.state.isTop} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
                } />
                <Route exact path="/blogs/:groupID/:ct" render={({ match, location, history }) =>
                  <BlogListTemplate match={match} location={location} history={history} isTop={this.state.isTop} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
                } />

                <Route exact path="/images/" render={({ match, location, history }) =>
                  <ImageListTemplate match={match} location={location} history={history} isTop={this.state.isTop} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
                } />
                <Route exact path="/images/:groupID" render={({ match, location, history }) =>
                  <ImageListTemplate match={match} location={location} history={history} isTop={this.state.isTop} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
                } />
                <Route exact path="/images/:groupID/:ct" render={({ match, location, history }) =>
                  <ImageListTemplate match={match} location={location} history={history} isTop={this.state.isTop} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
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
                  <ImageViewTemplate match={match} location={location} history={history} accessedImages={this.state.accessedImages} setAccessedImage={(imageID) => this.setAccessedImage(imageID)}/>
                } />
              </Switch>
            </div>

            <Footer ref={this.footerRef} />
          </Provider>
        </KeepScrollTop>
      </BrowserRouter>
    );
  }
}

export default App;