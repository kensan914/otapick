import React from "react";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import { setUserAgent, setBodyPadding, getIsMobile } from "./components/modules/utils";
import LocationAdmin from "./components/atoms/LocationAdmin";
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT, setEnvConstant } from "./components/modules/env";
import Screens from "./components/Screens";
import AuthProvider from "./components/contexts/AuthContext";
import DomProvider from "./components/contexts/DomContext";
import { ProfileProvider } from "./components/contexts/ProfileContext";
import "./static/css/index.css";


class App extends React.Component {
  constructor(props) {
    super(props);
    setUserAgent();
    setEnvConstant();
  }

  render() {
    return (
      <CookiesProvider>
        <BrowserRouter>
          <AuthProvider>
            <DomProvider>
              <ProfileProvider>
                <LocationAdmin>
                  <Screens />
                </LocationAdmin>
              </ProfileProvider>
            </DomProvider>
          </AuthProvider>
        </BrowserRouter>
      </CookiesProvider>
    );
  }
}

export default App;