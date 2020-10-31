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
import { DomDispatchContext, DomStateContext, useDomDispatch, useDomState } from "./contexts/DomContext";
import UsersDetailPage from "./pages/UsersDetailPage";


const Screens = (props) => {
  const domState = useDomState();
  const domDispatch = useDomDispatch();
  const footerRef = useRef(0);

  useEffect(() => {
    domDispatch({ type: "SET_FOOTER_REF", footerRef: footerRef });
  }, []);

  return (
    // <Provider include={/^(?!ImageView|ImageList).*$/} exclude={/^(ImageView|ImageList).*$/}>
    <Provider>
      {/* <> */}
      <NavigationBar />
      <NavigationAdmin isShowNBShadow={domState.isShowNBShadow} isShowNB={domState.isShowNB} isShowSubNB={domState.isShowSubNB} isTop={domState.isTop} domDispatch={domDispatch} />
      {isMobile && <BottomNavigationBar />}

      <Switch>

        {/* <Provider> */}
        <Route exact path="/" render={() => <HomeTemplate />} />

        <Route exact path="/blogs/" render={() => <BlogListTemplate />} />
        <Route exact path="/blogs/:groupID/" render={() => <BlogListTemplate />} />
        <Route exact path="/blogs/:groupID/:ct/" render={() => <BlogListTemplate />} />

        <Route exact path="/images/" render={() => <ImageListTemplate />} />
        <Route exact path="/images/:groupID/" render={() => <ImageListTemplate />} />
        <Route exact path="/images/:groupID/:ct/" render={() => <ImageListTemplate />} />
        {/* </Provider> */}

        <Route exact path="/search/" render={() => <BlogSearchListTemplate />} />

        <Route exact path="/members/" render={() => <MemberListTemplate />} />

        <Route exact path="/blog/:groupID/:blogCt/" render={() =>
          <DomStateContext.Consumer>
            {domState =>
              <DomDispatchContext.Consumer>
                {domDispatch =>
                  <BlogViewTemplate domState={domState} domDispatch={domDispatch} />}
              </DomDispatchContext.Consumer>}
          </DomStateContext.Consumer>
        } />

        <Route exact path="/image/:groupID/:blogCt/:order/" render={() => (
          // <Provider include={/^(ImageView|ImageList).*$/} exclude={/^(?!ImageView|ImageList).*$/}>
            <ImageViewTemplate />
          // </Provider>
        )} />

        <Route exact path="/users/:username" render={() => (
          // <Provider include={/^(bookmark).*$/} exclude={/^(?!bookmark).*$/}>
            <UsersDetailPage />
          // </Provider>
        )} />

        <Route exact path="/contact/" render={() => <TermsTemplate mode="contact" />} />
        <Route exact path="/terms-of-service/" render={() => <TermsTemplate mode="termsOfService" />} />
        <Route exact path="/privacy-policy/" render={() => <TermsTemplate mode="privacyPolicy" />} />

        <Route render={() =>
          <NotFound404 footerRef={footerRef} domDispatch={domDispatch} />
        } />
      </Switch>

      <Footer ref={footerRef} />
    </Provider>
    // </>
  );
}


export default Screens;