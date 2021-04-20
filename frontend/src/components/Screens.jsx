import React, { useEffect, useRef, Suspense } from "react";
import { Route, withRouter } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";

import { HorizontalLoader } from "./molecules/Loader";
import NavigationBar from "./organisms/NavigationBar";
import { useDomDispatch } from "./contexts/DomContext";
import PortalContainer from "./atoms/PortalContainer";
import BottomAnchorAdsOnlyMobile from "./molecules/BottomAnchorAdsOnlyMobile";
import { isMobile } from "./modules/utils";

const Footer = React.lazy(() => import("./organisms/Footer"));
const BlogViewTemplate = React.lazy(() =>
  import("./templates/BlogViewTemplate")
);
const MemberListTemplate = React.lazy(() =>
  import("./templates/MemberListTemplate")
);
const ImageListTemplate = React.lazy(() =>
  import("./templates/ImageListTemplate")
);
const ImageViewPage = React.lazy(() => import("./pages/ImageViewPage"));
const HomeTemplate = React.lazy(() => import("./templates/HomeTemplate"));
const NotFound404 = React.lazy(() => import("./pages/NotFound404"));
const TermsTemplate = React.lazy(() => import("./templates/TermsTemplate"));
const BlogListTemplate = React.lazy(() =>
  import("./templates/BlogListTemplate")
);
const BlogSearchListTemplate = React.lazy(() =>
  import("./templates/BlogSearchListTemplate")
);
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));
const UsersDetailPage = React.lazy(() => import("./pages/UsersDetailPage"));
const LowerRightMenu = React.lazy(() => import("./organisms/LowerRightMenu"));

const Screens = () => {
  const domDispatch = useDomDispatch();
  const footerRef = useRef(0);

  useEffect(() => {
    domDispatch({ type: "SET_FOOTER_REF", footerRef: footerRef });
  }, []);

  return (
    <>
      <NavigationBar />
      {isMobile && <BottomAnchorAdsOnlyMobile />}

      <Suspense fallback={() => <HorizontalLoader />}>
        <CacheSwitch>
          <CacheRoute
            exact
            path="/"
            render={() => <HomeTemplate />}
            when="always"
            multiple={10}
            unmount={true}
          />

          <CacheRoute
            exact
            path="/blogs/"
            render={() => <BlogListTemplate />}
            when="always"
            multiple={10}
          />
          <CacheRoute
            exact
            path="/blogs/:groupID/"
            render={() => <BlogListTemplate />}
            when="always"
            multiple={10}
          />
          <CacheRoute
            exact
            path="/blogs/:groupID/:ct/"
            render={() => <BlogListTemplate />}
            when="always"
            multiple={10}
          />

          <CacheRoute
            exact
            path="/images/"
            render={() => <ImageListTemplate />}
            when="always"
            multiple={10}
          />
          <CacheRoute
            exact
            path="/images/:groupID/"
            render={() => <ImageListTemplate />}
            when="always"
            multiple={10}
          />
          <CacheRoute
            exact
            path="/images/:groupID/:ct/"
            render={() => <ImageListTemplate />}
            when="always"
            multiple={10}
          />

          <Route
            exact
            path="/search/"
            render={() => <BlogSearchListTemplate />}
          />
          <Route exact path="/members/" render={() => <MemberListTemplate />} />
          <Route
            exact
            path="/blog/:groupID/:blogCt/"
            render={() => <BlogViewTemplate />}
          />

          <CacheRoute
            exact
            path="/image/:groupId/:blogCt/:order/"
            // render={() => <ImageViewTemplate />}
            render={() => <ImageViewPage />}
            when="always"
            multiple={10}
          />
          <CacheRoute
            exact
            path="/users/:username/"
            render={() => <UsersDetailPage />}
            when="always"
            multiple={10}
          />

          <Route
            exact
            path="/settings/"
            render={() => <SettingsPage type="DEFAULT" />}
          />

          <Route
            exact
            path="/settings/fav-members/"
            render={() => <SettingsPage type="FAV_MEMBERS" />}
          />

          <Route
            exact
            path="/contact/"
            render={() => <TermsTemplate mode="contact" />}
          />
          <Route
            exact
            path="/terms-of-service/"
            render={() => <TermsTemplate mode="termsOfService" />}
          />
          <Route
            exact
            path="/privacy-policy/"
            render={() => <TermsTemplate mode="privacyPolicy" />}
          />

          <Route
            render={() => (
              <NotFound404 footerRef={footerRef} domDispatch={domDispatch} />
            )}
            status={404}
          />
        </CacheSwitch>

        <Footer ref={footerRef} />
        <LowerRightMenu />
      </Suspense>

      <PortalContainer />
    </>
  );
};

export default withRouter(Screens);
