import React, { useEffect, useRef } from "react";
import { Switch, Route } from "react-router-dom";
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

  return (
    <>
      <NavigationBar />
      <NavigationAdmin isShowNBShadow={domState.isShowNBShadow} isShowNB={domState.isShowNB} isShowSubNB={domState.isShowSubNB} isTop={domState.isTop} domDispatch={domDispatch} />
      { isMobile && <BottomNavigationBar />}

      <Switch>
        <Route exact path="/" render={() =>
          <HomeTemplate />
        } />

        <Route exact path="/blogs/" render={() => <BlogListTemplate />} />
        <Route exact path="/blogs/:groupID/" render={() => <BlogListTemplate />} />
        <Route exact path="/blogs/:groupID/:ct/" render={() => <BlogListTemplate />} />

        <Route exact path="/images/" render={() => <ImageListTemplate />} />
        <Route exact path="/images/:groupID/" render={() => <ImageListTemplate />} />
        <Route exact path="/images/:groupID/:ct/" render={() => <ImageListTemplate />} />



        <Route exact path="/search/" render={() => <BlogSearchListTemplate />} />

        <Route exact path="/members/" render={() => <MemberListTemplate />} />

        <Route exact path="/blog/:groupID/:blogCt/" render={() => <BlogViewTemplate />} />

        <Route exact path="/image/:groupID/:blogCt/:order/" render={() => <ImageViewTemplate />} />

        <Route exact path="/users/:username/" render={() => <UsersDetailPage />} />

        <Route exact path="/contact/" render={() => <TermsTemplate mode="contact" />} />
        <Route exact path="/terms-of-service/" render={() => <TermsTemplate mode="termsOfService" />} />
        <Route exact path="/privacy-policy/" render={() => <TermsTemplate mode="privacyPolicy" />} />

        <Route render={() => <NotFound404 footerRef={footerRef} domDispatch={domDispatch} />} />
      </Switch>

      <Footer ref={footerRef} />
    </>
  );
}


export default Screens;