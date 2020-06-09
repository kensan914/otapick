import React from "react";
import NavigationBar from '../organisms/NavigationBar';
import BlogListTemplate from '../templates/BlogListTemplate';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from 'react-keep-alive';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL = "http://192.168.99.100:8000/";
    this.state = {
      isTop: true,
    }
  }

  // ex)URLJoin('http://www.google.com', 'a', undefined, '/b/cd', undifined, '?foo=123', '?bar=foo'); => 'http://www.google.com/a/b/cd/?foo=123&bar=foo' 
  URLJoin = (...args) => {
    args = args.filter(n => n !== undefined);
    for (let i = args.length - 1; i >= 0; i--) {
      if (args[i].startsWith('?')) continue;
      if (!args[i].endsWith('/')) {
        args[i] += '/';
        break;
      }
    }
    return args.join('/').replace(/[\/]+/g, '/').replace(/^(.+):\//, '$1://').replace(/^file:/, 'file:/').replace(/\/(\?|&|#[^!])/g, '$1').replace(/\?/g, '&').replace('&', '?')
  }

  watchCurrentPosition = () => {
    if (this.scrollTop() === 0 && !this.state.isTop) {
      this.setState({
        isTop: true,
      });
    } else if (this.scrollTop() !== 0 && this.state.isTop) {
      this.setState({
        isTop: false,
      });
    }
  }
  scrollTop = () => {
    return Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop);
  }

  getGroup(groupID) {
    var group = "keyaki";
    if (groupID == 2) group = "hinata";
    return group;
  }

  componentDidMount() {
    window.addEventListener('scroll', event => this.watchCurrentPosition(), true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll');
  }


  render() {
    return (
      <div>
        <BrowserRouter>
          <Provider>

            <NavigationBar URLJoin={this.URLJoin} baseURL={this.baseURL} isTop={this.state.isTop} />
            <div className="container mt-3 text-muted">
              <Switch>
                <Route exact path="/react">
                  {/* <BlogListTemplate headlineTitle="ブログ一覧" /> */}
                  <div>testtest</div>
                </Route>
                <Route exact path="/react/blogs/:groupID" render={({ match, location, history }) =>
                  <BlogListTemplate headlineTitle="ブログ一覧" match={match} location={location} history={history} URLJoin={this.URLJoin} baseURL={this.baseURL} isTop={this.state.isTop} getGroup={(groupID) => this.getGroup(groupID)} />}
                />
                <Route exact path="/react/blogs/:groupID/:ct" render={({ match, location, history }) =>
                  <BlogListTemplate headlineTitle="ブログ一覧" match={match} location={location} history={history} URLJoin={this.URLJoin} baseURL={this.baseURL} isTop={this.state.isTop} getGroup={(groupID) => this.getGroup(groupID)} />}
                />

              </Switch>
            </div>

          </Provider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;