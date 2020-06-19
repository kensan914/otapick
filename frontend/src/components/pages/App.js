import React from "react";
import NavigationBar from '../organisms/NavigationBar';
import BlogListTemplate from '../templates/BlogListTemplate';
import BlogSearchListTemplate from '../templates/BlogSearchListTemplate';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from 'react-keep-alive';
import { scrollTop } from '../tools/support';
import Footer from '../organisms/Footer';
import KeepScrollTop from "../atoms/KeepScrollTop";
import MemberListTemplate from "../templates/MemberListTemplate";
import BlogViewTemplate from "../templates/BlogViewTemplate";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTop: true,
      accessedBlogs: [], // ["1_34360", "2_34230"]
    }
    this.footerRef = React.createRef();
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
                <Route exact path="/react">
                  {/* <BlogListTemplate headlineTitle="ブログ一覧" /> */}
                  <div>testtest</div>
                </Route>
                <Route exact path="/blogs/:groupID" render={({ match, location, history }) =>
                  <BlogListTemplate headlineTitle="ブログ一覧" match={match} location={location} history={history} isTop={this.state.isTop} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
                } />
                <Route exact path="/blogs/:groupID/:ct" render={({ match, location, history }) =>
                  <BlogListTemplate headlineTitle="ブログ一覧" match={match} location={location} history={history} isTop={this.state.isTop} applyShowFooter={(l) => this.footerRef.current.applyShowFooter(l)} />
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