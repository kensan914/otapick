import React from "react";
import { BrowserRouter } from "react-router-dom";
import { withCookies } from "react-cookie";

import { setUserAgent } from "~/utils";
import { setEnvConstant } from "~/constants/env";
import "~/static/css/index.css";
import Screens from "~/App/Router";
import AuthProvider from "~/contexts/AuthContext";
import DomProvider from "~/contexts/DomContext";
import ProfileProvider from "~/contexts/ProfileContext";
import { useInitToken } from "~/hooks/useInitToken";
import { useConstructor } from "~/hooks/useConstructor";
import { Administrator } from "~/App/Administrator";

const App = (props) => {
  const { cookies } = props;

  useConstructor(() => {
    setUserAgent();
    setEnvConstant();
  }, []);
  const token = useInitToken(cookies);

  return (
    <BrowserRouter>
      <AuthProvider token={token}>
        <ProfileProvider>
          <DomProvider>
            <Administrator>
              <Screens />
            </Administrator>
          </DomProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default withCookies(App);
