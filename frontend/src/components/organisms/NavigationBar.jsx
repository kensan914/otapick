import React, { useState } from "react";
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
import { MobileTopMenu } from "../molecules/MobileMenu";
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
  faExternalLinkAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const NavigationBar = () => {
  const profileState = useProfileState();
  const profileDispatch = useProfileDispatch();
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();

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
        <SearchDownshift />
        <MobileTopMenu
          profileState={profileState}
          authState={authState}
          authDispatch={authDispatch}
          profileDispatch={profileDispatch}
          type="navbarMenu"
        />
      </Navbar>
    );
  }
  // PC
  else {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownToggle = () => setDropdownOpen((prevState) => !prevState);
    const [dropdownOpen3, setDropdownOpen3] = useState(false);
    const dropdownToggle3 = () => setDropdownOpen3((prevState) => !prevState);
    const [dropdownOpen4, setDropdownOpen4] = useState(false);
    const dropdownToggle4 = () => setDropdownOpen4((prevState) => !prevState);

    const resetNavBar = () => {
      setDropdownOpen(false);
      setDropdownOpen3(false);
      setDropdownOpen4(false);
    };

    const getMainDropdown = (quickStartItems) => {
      return (
        <ButtonDropdown
          direction="down"
          isOpen={dropdownOpen3}
          toggle={dropdownToggle3}
        >
          <DropdownToggle className="rounded-pill navbar-dropdown-button">
            {authState.status === "Authenticated" ? (
              <div className="navbar-profile-icon-wrapper rounded-pill">
                <img
                  src={profileState.profile.image}
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
            )}
          </DropdownToggle>
          <DropdownMenu className={"navbar-dropdown-menu bold"}>
            {authState.status === "Authenticated" && (
              <>
                <DropdownItem header className="omit-title">
                  {profileState.profile.name}
                </DropdownItem>
                <DropdownItem
                  tag={Link}
                  // to={`/users/${profileState.profile.username}/`}
                  to={{
                    pathname: `/users/${profileState.profile.username}/`,
                    state: { accessKey: generateUuid4() },
                  }}
                >
                  マイページ
                </DropdownItem>

                <DropdownItem
                  tag={Link}
                  to={{
                    pathname: `/settings/`,
                  }}
                >
                  設定
                </DropdownItem>
                <DropdownItem divider />
              </>
            )}

            {quickStartItems}

            <DropdownItem header>公式リンク</DropdownItem>
            {sortGROUPSByFav(profileState.profile.favGroups).map((groupObj) => (
              <DropdownItem
                key={groupObj.id}
                href={groupObj.blogUrl}
                target="_blank"
              >
                {groupObj.name}公式ブログ{" "}
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </DropdownItem>
            ))}
            <DropdownItem divider />

            <DropdownItem header>ヲタピックについて</DropdownItem>
            <DropdownItem tag={Link} to="/contact/">
              お問い合わせ
            </DropdownItem>
            <DropdownItem tag={Link} to="/terms-of-service/">
              利用規約
            </DropdownItem>
            <DropdownItem tag={Link} to="/privacy-policy/">
              プライバシーポリシー
            </DropdownItem>
            <DropdownItem href="https://twitter.com/otapick/" target="_blank">
              公式Twitter <FontAwesomeIcon icon={faTwitter} />
            </DropdownItem>

            {authState.status === "Authenticated" && (
              <>
                <DropdownItem divider />
                <DropdownItem
                  onClick={() => {
                    authDispatch({
                      type: "COMPLETE_LOGOUT",
                      profileDispatch: profileDispatch,
                    });
                    window.location.href = "/";
                  }}
                >
                  ログアウト <FontAwesomeIcon icon={faSignOutAlt} />
                </DropdownItem>
              </>
            )}
          </DropdownMenu>
        </ButtonDropdown>
      );
    };

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
        />

        {/* shorter width */}
        <MediaQuery query="(max-width: 991px)">
          {authState.status !== "Authenticated" && (
            <Button href="/accounts/login/" className="login-button">
              <FontAwesomeIcon icon={faTwitter} /> ログイン
            </Button>
          )}
          {getMainDropdown(
            <>
              <DropdownItem header>クイックスタート</DropdownItem>
              <DropdownItem tag={Link} to="/images/">
                画像一覧
              </DropdownItem>
              <DropdownItem tag={Link} to="/blogs/">
                ブログ一覧
              </DropdownItem>
              <DropdownItem tag={Link} to="/members/">
                メンバーリスト
              </DropdownItem>
              <DropdownItem divider />
            </>
          )}
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

            {getMainDropdown()}
          </Nav>
        </MediaQuery>
      </Navbar>
    );
  }
};

export default NavigationBar;
