import React from "react";
import NavigationBar from '../organisms/NavigationBar';
import BlogListTemplate from '../templates/BlogListTemplate';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider, KeepAlive } from 'react-keep-alive';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Provider>

          <NavigationBar />
          <div className="container mt-3 text-muted">
            <Switch>
              <Route exact path="/react">
                <KeepAlive name="react">
                  {/* <BlogListTemplate headlineTitle="ブログ一覧" /> */}
                  <div>testtest</div>
                </KeepAlive>
              </Route>
              <Route exact path="/react/blogs/:groupID" render={({ match, location, history }) =>
                <BlogListTemplate headlineTitle="ブログ一覧" match={match} location={location} history={history} />}
              />
              <Route exact path="/react/blogs/:groupID/:ct" render={({ match, location, history }) =>
                <BlogListTemplate headlineTitle="ブログ一覧" match={match} location={location} history={history} />}
              />

            </Switch>
          </div>

        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;