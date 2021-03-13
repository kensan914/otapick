import React, { useEffect, useRef, Suspense } from "react";
import { Route, withRouter } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";

import { isMobile } from "./modules/utils";
import { HorizontalLoader } from "./molecules/Loader";
import NavigationBar from "./organisms/NavigationBar";
import BottomNavigationBar from "./organisms/BottomNavigationBar";

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
const ImageViewTemplate = React.lazy(() =>
  import("./templates/ImageViewTemplate")
);
const HomeTemplate = React.lazy(() => import("./templates/HomeTemplate"));
const NotFound404 = React.lazy(() => import("./pages/NotFound404"));
const TermsTemplate = React.lazy(() => import("./templates/TermsTemplate"));
const BlogListTemplate = React.lazy(() =>
  import("./templates/BlogListTemplate")
);
const BlogSearchListTemplate = React.lazy(() =>
  import("./templates/BlogSearchListTemplate")
);
import { useDomDispatch } from "./contexts/DomContext";
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
      {isMobile && <BottomNavigationBar />}
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

          {/* <Route exact path="/image/:groupID/:blogCt/:order/" render={() => <ImageViewTemplate />} /> */}
          <CacheRoute
            exact
            path="/image/:groupID/:blogCt/:order/"
            render={() => <ImageViewTemplate />}
            when="always"
            multiple={10}
          />
          <CacheRoute
            exact
            path="/users/:username/"
            render={() => <UsersDetailPage />}
            // when="forward" // UsersDetailPageマウント後favorite imagesが更新されないため
            when="always"
            multiple={10}
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
          />
        </CacheSwitch>

        <Footer ref={footerRef} />
        <LowerRightMenu />
      </Suspense>
    </>
  );
};

export default withRouter(Screens);