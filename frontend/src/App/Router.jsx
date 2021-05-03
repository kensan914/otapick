import React, { useEffect, useRef, Suspense } from "react";
import { Route, withRouter } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";

import { HorizontalLoader } from "~/components/molecules/Loader";
import NavigationBar from "~/components/organisms/NavigationBar";
import { useDomDispatch } from "~/contexts/DomContext";
import PortalContainer from "~/components/atoms/PortalContainer";
import BottomAnchorAdsOnlyMobile from "~/components/molecules/BottomAnchorAdsOnlyMobile";
import LowerRightMenu from "~/components/organisms/LowerRightMenu";
import { isMobile } from "~/utils";

const Footer = React.lazy(() => import("~/components/organisms/Footer"));
const BlogViewPage = React.lazy(() => import("~/pages/BlogViewPage"));
const MemberListPage = React.lazy(() => import("~/pages/MemberListPage"));
const ImageListPage = React.lazy(() => import("~/pages/ImageListPage"));
const ImageViewPage = React.lazy(() => import("~/pages/ImageViewPage"));
const HomePage = React.lazy(() => import("~/pages/HomePage"));
const NotFound404Page = React.lazy(() => import("~/pages/NotFound404Page"));
const TermsPage = React.lazy(() => import("~/pages/TermsPage"));
const BlogListPage = React.lazy(() => import("~/pages/BlogListPage"));
const BlogSearchListPage = React.lazy(() =>
  import("~/pages/BlogSearchListPage")
);
const SettingsPage = React.lazy(() => import("~/pages/SettingsPage"));
const UsersDetailPage = React.lazy(() => import("~/pages/UsersDetailPage"));

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
            render={() => <HomePage />}
            when="always"
            multiple={10}
            unmount={true}
          />

          <CacheRoute
            exact
            path="/blogs/"
            render={() => <BlogListPage />}
            when="always"
            multiple={10}
          />
          <CacheRoute
            exact
            path="/blogs/:groupId/"
            render={() => <BlogListPage />}
            when="always"
            multiple={10}
          />
          <CacheRoute
            exact
            path="/blogs/:groupId/:ct/"
            render={() => <BlogListPage />}
            when="always"
            multiple={10}
          />

          <CacheRoute
            exact
            path="/images/"
            render={() => <ImageListPage />}
            when="always"
            multiple={10}
          />
          <CacheRoute
            exact
            path="/images/:groupId/"
            render={() => <ImageListPage />}
            when="always"
            multiple={10}
          />
          <CacheRoute
            exact
            path="/images/:groupId/:ct/"
            render={() => <ImageListPage />}
            when="always"
            multiple={10}
          />

          <Route exact path="/search/" render={() => <BlogSearchListPage />} />
          <Route exact path="/members/" render={() => <MemberListPage />} />
          <Route
            exact
            path="/blog/:groupId/:blogCt/"
            render={() => <BlogViewPage />}
          />

          <CacheRoute
            exact
            path="/image/:groupId/:blogCt/:order/"
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
            render={() => <TermsPage mode="contact" />}
          />
          <Route
            exact
            path="/terms-of-service/"
            render={() => <TermsPage mode="termsOfService" />}
          />
          <Route
            exact
            path="/privacy-policy/"
            render={() => <TermsPage mode="privacyPolicy" />}
          />

          <Route
            render={() => <NotFound404Page footerRef={footerRef} />}
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
