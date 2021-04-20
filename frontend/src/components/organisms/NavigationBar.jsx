import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import SearchDownshift from "../molecules/SearchDownshift";
import {
  isMobile,
  isSmp,
  generateUuid4,
  sortGROUPSByFav,
} from "../modules/utils";
import {
  useProfileDispatch,
  useProfileState,
} from "../contexts/ProfileContext";
import MediaQuery from "react-responsive";
import { useAuthDispatch, useAuthState } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faCaretDown,
  faCog,
  faEnvelope,
  faExternalLinkAlt,
  faHouseUser,
  faImages,
  faNewspaper,
  faSignOutAlt,
  faUsers,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { NAVBAR_LS_ZINDEX, OTAPICK_TWITTER_URL } from "../modules/env";
import DropdownMobileFriendly from "../molecules/DropdownMobileFriendly";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";

const NavbarMenu = (props) => {
  const { children, isLongerWidthOnlyPc = false } = props;
  const profileState = useProfileState();
  const profileDispatch = useProfileDispatch();
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

  return (
    <DropdownMobileFriendly
      id="navbar-menu"
      isLocatedNavbarOnlyMobile
      lockScreenZIndex={NAVBAR_LS_ZINDEX}
      directionOnlyPc="down"
      isSmallerTitle
      buttonClass={
        isMobile
          ? authState.status === "Authenticated"
            ? "navbar-profile-icon-mobile-button"
            : "rounded-circle transparent-button-mobile"
          : "rounded-pill navbar-dropdown-button"
      }
      dropdownMenuClassOnlyPc="navbar-dropdown-menu"
      menuSettings={[
        ...(authState.status === "Authenticated"
          ? [
              { type: "TITLE", label: profileState.profile.name },
              {
                type: "LINK",
                pathname: `/users/${profileState.profile.username}/`,
                state: { accessKey: generateUuid4() },
                label: "マイページ",
                icon: faHouseUser,
              },
              {
                type: "LINK",
                pathname: `/settings/`,
                label: "設定",
                icon: faCog,
              },
            ]
          : isMobile
          ? [
              { type: "TITLE", label: "Twitterアカウントで簡単ログイン" },
              {
                type: "CUSTOM_ONLY_MOBILE",
                menuComponent: (
                  <Button
                    href="/accounts/login/"
                    className="login-button mt-1 mb-2"
                  >
                    <div style={{ color: "white" }}>
                      <FontAwesomeIcon icon={faTwitter} /> ログイン
                    </div>
                  </Button>
                ),
              },
            ]
          : []),

        ...(!isLongerWidthOnlyPc
          ? [
              { type: "TITLE", label: "クイックアクセス" },

              {
                type: "LINK",
                pathname: `/images/`,
                label: "画像一覧",
                icon: faImages,
              },
              {
                type: "LINK",
                pathname: `/blogs/`,
                label: "ブログ一覧",
                icon: faNewspaper,
              },
              {
                type: "LINK",
                pathname: `/members/`,
                label: "メンバーリスト",
                icon: faUsers,
              },
            ]
          : []),

        { type: "TITLE", label: "公式リンク" },
        ...sortGROUPSByFav(profileState.profile.favGroups).map((groupObj) => ({
          type: "ANCHOR",
          href: groupObj.blogUrl,
          targetBlank: true,
          label: `${groupObj.name}公式ブログ`,
          icon: faExternalLinkAlt,
        })),

        { type: "TITLE", label: "ヲタピックについて" },
        {
          type: "LINK",
          pathname: `/contact/`,
          label: "お問い合わせ",
          icon: faEnvelope,
        },
        {
          type: "LINK",
          pathname: `/terms-of-service/`,
          label: "利用規約",
          icon: faFileAlt,
        },
        {
          type: "LINK",
          pathname: `/privacy-policy/`,
          label: "プライバシーポリシー",
          icon: faUserShield,
        },
        {
          type: "ANCHOR",
          href: OTAPICK_TWITTER_URL,
          targetBlank: true,
          label: "公式Twitter",
          icon: faTwitter,
        },
        ...(authState.status === "Authenticated"
          ? [
              { type: "HR" },
              {
                type: "ONCLICK",
                label: "ログアウト",
                onClick: () => {
                  authDispatch({
                    type: "COMPLETE_LOGOUT",
                    profileDispatch: profileDispatch,
                  });
                  window.location.href = "/";
                },
                icon: faSignOutAlt,
              },
            ]
          : []),
      ]}
    >
      {children}
    </DropdownMobileFriendly>
  );
};

const NavigationBar = () => {
  const profileState = useProfileState();
  const authState = useAuthState();

  // mobile
  if (isMobile) {
    return (
      <Navbar
        color="light"
        light
        expand="lg"
        className={"static-top fixed-top border-bottom " + (isSmp ? "smp" : "")}
        id="otapick-navbar"
        style={{ transitionTimingFunction: "ease-out" }}
      >
        <NavbarBrand
          tag={Link}
          to="/"
          className="mx-0 navbar-brand-responsive"
        />
        <SearchDownshift profileState={profileState} />

        <NavbarMenu>
          {authState.status === "Authenticated" ? (
            <img
              src={profileState.profile.image}
              className="navbar-profile-icon-mobile"
            />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </NavbarMenu>
      </Navbar>
    );
  }
  // PC
  else {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownToggle = () => setDropdownOpen((prevState) => !prevState);
    const [dropdownOpen4, setDropdownOpen4] = useState(false);
    const dropdownToggle4 = () => setDropdownOpen4((prevState) => !prevState);

    const resetNavBar = () => {
      setDropdownOpen(false);
      setDropdownOpen4(false);
    };

    const navbarMenuChildren =
      authState.status === "Authenticated" ? (
        <div className="navbar-profile-icon-wrapper rounded-pill">
          <img
            src={profileState.profile.imageThumbnail}
            className="navbar-profile-icon"
          />
          <FontAwesomeIcon
            className="navbar-profile-icon-arrow"
            icon={faCaretDown}
          />
        </div>
      ) : (
        <div className="navbar-hamburger-wrapper">
          <FontAwesomeIcon className="navbar-hamburger" icon={faBars} />
        </div>
      );

    return (
      <Navbar
        color="light"
        light
        className="static-top fixed-top border-bottom"
        id="otapick-navbar"
        style={{ transitionTimingFunction: "ease-out" }}
      >
        <NavbarBrand
          tag={Link}
          to="/"
          className="mx-0 navbar-brand-responsive"
        />
        <SearchDownshift
          resetNavBar={() => resetNavBar()}
          navbarToggle={() => {}}
          profileState={profileState}
        />

        {/* shorter width */}
        <MediaQuery query="(max-width: 991px)">
          {authState.status !== "Authenticated" && (
            <Button href="/accounts/login/" className="login-button">
              <FontAwesomeIcon icon={faTwitter} /> ログイン
            </Button>
          )}
          <NavbarMenu>{navbarMenuChildren}</NavbarMenu>
        </MediaQuery>

        {/* longer width */}
        <MediaQuery query="(min-width: 992px)" navbar>
          <Nav className="mx-4 mx-lg-0">
            <ButtonDropdown
              id="nav-dropdown-images"
              isOpen={dropdownOpen4}
              toggle={dropdownToggle4}
            >
              <DropdownToggle className="rounded-pill navbar-dropdown-button">
                <div className="navbar-dropdownToggle-wrapper rounded-pill">
                  <div className="navbar-dropdownToggle-title">
                    画像一覧
                    <FontAwesomeIcon
                      className="navbar-profile-icon-arrow"
                      icon={faCaretDown}
                    />
                  </div>
                </div>
              </DropdownToggle>
              <DropdownMenu right className="bold">
                <DropdownItem tag={Link} to="/images/">
                  おすすめ画像
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem header>グループから探す</DropdownItem>
                {sortGROUPSByFav(profileState.profile.favGroups).map(
                  (groupObj) => (
                    <DropdownItem
                      key={groupObj.id}
                      tag={Link}
                      to={`/images/${groupObj.id}/`}
                    >
                      {groupObj.name}
                    </DropdownItem>
                  )
                )}
                <DropdownItem divider />
                <DropdownItem header>メンバーから探す</DropdownItem>
                <DropdownItem tag={Link} to="/members/">
                  メンバーリスト
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>

            <ButtonDropdown
              id="nav-dropdown-blogs"
              isOpen={dropdownOpen}
              toggle={dropdownToggle}
            >
              <DropdownToggle className="rounded-pill navbar-dropdown-button">
                <div className="navbar-dropdownToggle-wrapper rounded-pill">
                  <div className="navbar-dropdownToggle-title">
                    ブログ一覧
                    <FontAwesomeIcon
                      className="navbar-profile-icon-arrow"
                      icon={faCaretDown}
                    />
                  </div>
                </div>
              </DropdownToggle>
              <DropdownMenu right className="bold">
                <DropdownItem tag={Link} to="/blogs/">
                  おすすめブログ
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem header>グループから探す</DropdownItem>
                {sortGROUPSByFav(profileState.profile.favGroups).map(
                  (groupObj) => (
                    <DropdownItem
                      key={groupObj.id}
                      tag={Link}
                      to={`/blogs/${groupObj.id}/`}
                    >
                      {groupObj.name}
                    </DropdownItem>
                  )
                )}
                <DropdownItem divider />
                <DropdownItem header>メンバーから探す</DropdownItem>
                <DropdownItem tag={Link} to="/members/">
                  メンバーリスト
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>

            {authState.status !== "Authenticated" && (
              <Button href="/accounts/login/" className="login-button">
                <FontAwesomeIcon icon={faTwitter} /> ログイン
              </Button>
            )}

            <NavbarMenu isLongerWidthOnlyPc>{navbarMenuChildren}</NavbarMenu>
          </Nav>
        </MediaQuery>
      </Navbar>
    );
  }
};

export default NavigationBar;
