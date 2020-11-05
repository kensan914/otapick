import React, { useEffect, useRef } from "react";
import { Switch, Route } from "react-router-dom";
import { Provider } from "react-keep-alive";
import { isMobile } from "./modules/utils";
import Footer from "./organisms/Footer";
import BlogViewTemplate from "./templates/BlogViewTemplate";
import MemberListTemplate from "./templates/MemberListTemplate";
import ImageListTemplate from "./templates/ImageListTemplate";
import ImageViewTemplate from "./templates/ImageViewTemplate";
import HomeTemplate from "./templates/HomeTemplate";
import NavigationAdmin from "./atoms/NavigationAdmin";
import NotFound404 from "./pages/NotFound404";
import BottomNavigationBar from "./organisms/BottomNavigationBar";
import TermsTemplate from "./templates/TermsTemplate";
import NavigationBar from "./organisms/NavigationBar";
import BlogListTemplate from "./templates/BlogListTemplate";
import BlogSearchListTemplate from "./templates/BlogSearchListTemplate";
import { useDomDispatch, useDomState } from "./contexts/DomContext";
import UsersDetailPage from "./pages/UsersDetailPage";


const Screens = (props) => {
  const domState = useDomState();
  const domDispatch = useDomDispatch();
  const footerRef = useRef(0);

  useEffect(() => {
    domDispatch({ type: "SET_FOOTER_REF", footerRef: footerRef });
  }, []);

  const renderDefault = (component) => (
    // <Provider include={/^(?!ImageView|ImageList|bookmark).*$/} exclude={/^(ImageView|ImageList|bookmark).*$/}>
    // { component }
    // </Provider>
    component
  );

  return (
    <Provider max={4}>
      <NavigationBar />
      <NavigationAdmin isShowNBShadow={domState.isShowNBShadow} isShowNB={domState.isShowNB} isShowSubNB={domState.isShowSubNB} isTop={domState.isTop} domDispatch={domDispatch} />
      { isMobile && <BottomNavigationBar />}

      <Switch>
        <Route exact path="/" render={() =>
          // <Provider include={/^(?!ImageView|ImageList|bookmark).*$/} exclude={/^(ImageView|ImageList|bookmark).*$/}>
          <HomeTemplate />
          // </Provider>
        } />

        <Route exact path="/blogs/" render={() => renderDefault(<BlogListTemplate />)} />
        <Route exact path="/blogs/:groupID/" render={() => renderDefault(<BlogListTemplate />)} />
        <Route exact path="/blogs/:groupID/:ct/" render={() => renderDefault(<BlogListTemplate />)} />

        <Route exact path="/images/" render={() => renderDefault(<ImageListTemplate />)} />
        <Route exact path="/images/:groupID/" render={() => renderDefault(<ImageListTemplate />)} />
        <Route exact path="/images/:groupID/:ct/" render={() => renderDefault(<ImageListTemplate />)} />



        <Route exact path="/search/" render={() => renderDefault(<BlogSearchListTemplate />)} />

        <Route exact path="/members/" render={() => renderDefault(<MemberListTemplate />)} />

        <Route exact path="/blog/:groupID/:blogCt/" render={() => renderDefault(<BlogViewTemplate />)} />

        <Route exact path="/image/:groupID/:blogCt/:order/" render={() => (
          <Provider include={/^(ImageView|ImageList).*$/} exclude={/^(?!ImageView|ImageList).*$/}>
            <ImageViewTemplate />
          </Provider>
        )} />

        {/* TODO(TODOで検索): PCだと一応機能する。が、mobileだとエラー吐く */}
        <Route exact path="/users/:username/" render={() => (
          // <Provider include={/^(bookmark).*$/} exclude={/^(?!bookmark).*$/}>
          <UsersDetailPage />
          // </Provider>
        )} />

        <Route exact path="/contact/" render={() => renderDefault(<TermsTemplate mode="contact" />)} />
        <Route exact path="/terms-of-service/" render={() => renderDefault(<TermsTemplate mode="termsOfService" />)} />
        <Route exact path="/privacy-policy/" render={() => renderDefault(<TermsTemplate mode="privacyPolicy" />)} />

        <Route render={() => (
          renderDefault(<NotFound404 footerRef={footerRef} domDispatch={domDispatch} />)
        )} />
      </Switch>

      <Footer ref={footerRef} />
    </Provider>
  );
}


export default Screens;