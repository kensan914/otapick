import React from "react";
import { BrowserRouter } from "react-router-dom";
import { withCookies } from "react-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { setUserAgent } from "~/utils";
import { DEBUG, setEnvConstant } from "~/constants/env";
import "~/static/css/index.css";
import { Router } from "~/App/Router";
import AuthProvider from "~/contexts/AuthContext";
import DomProvider from "~/contexts/DomContext";
import ProfileProvider from "~/contexts/ProfileContext";
import { useInitToken } from "~/hooks/useInitToken";
import { useConstructor } from "~/hooks/useConstructor";
import { Administrator } from "~/App/Administrator";
import { initAdsense } from "~/utils/adsense";

const queryClient = new QueryClient();

const App = (props) => {
  const { cookies } = props;

  useConstructor(() => {
    setUserAgent();
    setEnvConstant();
    initAdsense(window, document);
  }, []);
  const token = useInitToken(cookies);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider token={token}>
          <ProfileProvider>
            <DomProvider>
              <Administrator>
                <Router />
              </Administrator>
            </DomProvider>
          </ProfileProvider>
        </AuthProvider>
        {DEBUG && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default withCookies(App);
