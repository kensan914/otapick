import React from "react";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider, withCookies } from "react-cookie";

import { getItem, setUserAgent } from "./components/modules/utils";
import LocationAdmin from "./components/pages/admin/LocationAdmin";
import { setEnvConstant } from "./components/modules/env";
import "./static/css/index.css";
import Screens from "./components/Screens";
import AuthProvider from "./components/contexts/AuthContext";
import DomProvider from "./components/contexts/DomContext";
import ProfileProvider from "./components/contexts/ProfileContext";
import ScrollAdmin from "./components/pages/admin/ScrollAdmin";

class App extends React.Component {
  render() {
    return (
      <CookiesProvider>
        <Provider />
      </CookiesProvider>
    );
  }
}

export default App;

class _Provider extends React.Component {
  constructor(props) {
    super(props);
    setUserAgent();
    setEnvConstant();

    // localstorage(優先), cookiesからtokenを取得
    this.token = getItem("token");
    if (
      !this.token &&
      Object.keys(props.cookies.cookies).indexOf("token") !== -1
    ) {
      this.token = props.cookies.get("token");
      props.cookies.remove("token");
    }
  }

  render() {
    return (
      <BrowserRouter>
        <AuthProvider token={this.token}>
          <ProfileProvider>
            <DomProvider>
              <LocationAdmin>
                <ScrollAdmin>
                  <Screens />
                </ScrollAdmin>
              </LocationAdmin>
            </DomProvider>
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  }
}

const Provider = withCookies(_Provider);
