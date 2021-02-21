import React, { useEffect, useRef } from "react";
import { Route, withRouter } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";

import { isMobile } from "./modules/utils";
import Footer from "./organisms/Footer";
import BlogViewTemplate from "./templates/BlogViewTemplate";
import MemberListTemplate from "./templates/MemberListTemplate";
import ImageListTemplate from "./templates/ImageListTemplate";
import ImageViewTemplate from "./templates/ImageViewTemplate";
import HomeTemplate from "./templates/HomeTemplate";
import NotFound404 from "./pages/NotFound404";
import BottomNavigationBar from "./organisms/BottomNavigationBar";
import TermsTemplate from "./templates/TermsTemplate";
import NavigationBar from "./organisms/NavigationBar";
import BlogListTemplate from "./templates/BlogListTemplate";
import BlogSearchListTemplate from "./templates/BlogSearchListTemplate";
import { useDomDispatch } from "./contexts/DomContext";
import UsersDetailPage from "./pages/UsersDetailPage";
import LowerRightMenu from "./organisms/LowerRightMenu";


const Screens = (props) => {
  const domDispatch = useDomDispatch();
  const footerRef = useRef(0);

  useEffect(() => {
    domDispatch({ type: "SET_FOOTER_REF", footerRef: footerRef });
  }, []);

  return (
    <>
      <NavigationBar />
      {isMobile && <BottomNavigationBar />}

      <CacheSwitch >
        <CacheRoute exact path="/" render={() => <HomeTemplate />} when="always" multiple={10} unmount={true} />

        <CacheRoute exact path="/blogs/" render={() => <BlogListTemplate />} when="always" multiple={10} />
        <CacheRoute exact path="/blogs/:groupID/" render={() => <BlogListTemplate />} when="always" multiple={10} />
        <CacheRoute exact path="/blogs/:groupID/:ct/" render={() => <BlogListTemplate />} when="always" multiple={10} />

        <CacheRoute exact path="/images/" render={() => <ImageListTemplate />} when="always" multiple={10} />
        <CacheRoute exact path="/images/:groupID/" render={() => <ImageListTemplate />} when="always" multiple={10} />
        <CacheRoute exact path="/images/:groupID/:ct/" render={() => <ImageListTemplate />} when="always" multiple={10} />

        <Route exact path="/search/" render={() => <BlogSearchListTemplate />} />
        <Route exact path="/members/" render={() => <MemberListTemplate />} />
        <Route exact path="/blog/:groupID/:blogCt/" render={() => <BlogViewTemplate />} />

        {/* <Route exact path="/image/:groupID/:blogCt/:order/" render={() => <ImageViewTemplate />} /> */}
        <CacheRoute exact path="/image/:groupID/:blogCt/:order/" render={() => <ImageViewTemplate />} when="always" multiple={10} />
        <CacheRoute exact path="/users/:username/" render={() => <UsersDetailPage />} when="always" multiple={10} />

        <Route exact path="/contact/" render={() => <TermsTemplate mode="contact" />} />
        <Route exact path="/terms-of-service/" render={() => <TermsTemplate mode="termsOfService" />} />
        <Route exact path="/privacy-policy/" render={() => <TermsTemplate mode="privacyPolicy" />} />

        <Route render={() => <NotFound404 footerRef={footerRef} domDispatch={domDispatch} />} />
      </CacheSwitch>

      <Footer ref={footerRef} />
      <LowerRightMenu />
    </>
  );
}


export default withRouter(Screens);


const CacheRouteCustom = (props) => {
  const { exact, path, render } = props;
  return (
    <CacheRoute exact={exact} path={path} render={render} when="always" multiple={10} />
  );
}