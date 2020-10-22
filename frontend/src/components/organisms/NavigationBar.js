import React, { useState } from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";
import SearchDownshift from "../molecules/SearchDownshift"
import { isMobile, isSmp } from "../modules/utils";
import { MobileTopMenu } from "../molecules/MobileMenu";
import { GROUPS } from "../modules/env";


const NavigationBar = (props) => {
  // mobile
  if (isMobile) {
    return (
      <Navbar color="light" light expand="lg" className={"static-top fixed-top border-bottom " + (isSmp ? "smp" : "")}
        id="otapick-navbar" style={{ transitionTimingFunction: "ease-out" }}>
        <NavbarBrand tag={Link} to="/" className="mx-0 navbar-brand-responsive" />
        <SearchDownshift />
        <MobileTopMenu type="navbarMenu" />
      </Navbar>
    );
  }
  // PC
  else {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownToggle = () => setDropdownOpen(prevState => !prevState);
    const [dropdownOpen2, setDropdownOpen2] = useState(false);
    const dropdownToggle2 = () => setDropdownOpen2(prevState => !prevState);
    const [dropdownOpen3, setDropdownOpen3] = useState(false);
    const dropdownToggle3 = () => setDropdownOpen3(prevState => !prevState);
    const [dropdownOpen4, setDropdownOpen4] = useState(false);
    const dropdownToggle4 = () => setDropdownOpen4(prevState => !prevState);

    const resetNavBar = () => {
      document.getElementById("otapick-navbar-collapse").classList.remove("show");
      setDropdownOpen(false);
      setDropdownOpen2(false);
      setDropdownOpen3(false);
      setDropdownOpen4(false);
    }

    return (
      <Navbar color="light" light expand="lg" className="static-top fixed-top border-bottom"
        id="otapick-navbar" style={{ transitionTimingFunction: "ease-out" }}>
        <NavbarBrand tag={Link} to="/" className="mr-1 navbar-brand-responsive" />
        <SearchDownshift resetNavBar={() => resetNavBar()} navbarToggle={() => setIsOpen(false)} />

        <NavbarToggler onClick={toggle} />

        <Collapse isOpen={isOpen} navbar id="otapick-navbar-collapse" style={{ flexGrow: 0 }}>
          <Nav className="mx-4 mx-lg-0" navbar>

            <Dropdown nav inNavbar id="nav-dropdown-blogs" className="mr-3" isOpen={dropdownOpen4} toggle={dropdownToggle4}>
              <DropdownToggle nav caret>
                画像一覧
              </DropdownToggle>
              <DropdownMenu right>
                {Object.values(GROUPS).map(groupObj => (
                  <DropdownItem key={groupObj.id} tag={Link} to={`/images/${groupObj.id}`}>{groupObj.name}</DropdownItem>
                ))}
                <DropdownItem tag={Link} to="/images">おすすめ画像</DropdownItem>
                <DropdownItem tag={Link} to="/members">メンバーリスト</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown nav inNavbar id="nav-dropdown-blogs" className="mr-3" isOpen={dropdownOpen} toggle={dropdownToggle}>
              <DropdownToggle nav caret>
                ブログ一覧
              </DropdownToggle>
              <DropdownMenu right>
                {Object.values(GROUPS).map(groupObj => (
                  <DropdownItem key={groupObj.id} tag={Link} to={`/blogs/${groupObj.id}`}>{groupObj.name}</DropdownItem>
                ))}
                <DropdownItem tag={Link} to="/blogs">おすすめブログ</DropdownItem>
                <DropdownItem tag={Link} to="/members">メンバーリスト</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown nav inNavbar id="nav-dropdown-official" className="mr-3" isOpen={dropdownOpen2} toggle={dropdownToggle2}>
              <DropdownToggle nav caret>
                公式
              </DropdownToggle>
              <DropdownMenu right>
                {Object.values(GROUPS).map(groupObj => (
                  <DropdownItem key={groupObj.id} href={groupObj.blogUrl} target="_blank">
                    {groupObj.name}公式ブログ{"\u00A0"}<i className="fas fa-external-link-alt" />
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown nav inNavbar id="nav-dropdown-otapick" className="mr-0" isOpen={dropdownOpen3} toggle={dropdownToggle3}>
              <DropdownToggle nav caret>
                ヲタピック
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag={Link} to="/contact">お問い合わせ</DropdownItem>
                <DropdownItem tag={Link} to="/terms-of-service">利用規約</DropdownItem>
                <DropdownItem tag={Link} to="/privacy-policy">プライバシーポリシー</DropdownItem>
                <DropdownItem href="https://twitter.com/otapick" target="_blank">
                  公式Twitter{"\u00A0"}<i className="fab fa-twitter" />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
};

export default NavigationBar;