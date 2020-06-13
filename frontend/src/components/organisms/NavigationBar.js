import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Link } from 'react-router-dom';
import SearchDownshift from '../molecules/SearchDownshift'


const NavigationBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownToggle = () => setDropdownOpen(prevState => !prevState);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const dropdownToggle2 = () => setDropdownOpen2(prevState => !prevState);

  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (mounted.current) {
      if (props.isTop) {
        const navabar = document.getElementById("otapick-navbar")
        navabar.style.transition = "0s";
        navabar.classList.remove("shadow");
      } else {
        const navabar = document.getElementById("otapick-navbar")
        navabar.style.transition = "0.3s";
        navabar.classList.add("shadow");
      }
    } else {
      mounted.current = true
    }
  }, [props.isTop])

  const resetNavBar = () => {
    document.getElementById("otapick-navbar-collapse").classList.remove("show");
    setDropdownOpen(false);
    setDropdownOpen2(false);
  }

  return (
    <Navbar color="light" light expand="lg" className="static-top fixed-top border-bottom"
      id="otapick-navbar" style={{ transitionTimingFunction: "ease-out" }}>
      <NavbarBrand href="/"></NavbarBrand>
      <NavbarToggler onClick={toggle} />

      <Collapse isOpen={isOpen} navbar id="otapick-navbar-collapse">
        <SearchDownshift baseURL={props.baseURL} resetNavBar={() => resetNavBar()} />
        <Nav className="mx-4 mx-lg-0" navbar>
          <Dropdown nav inNavbar id="nav-dropdown-blogs" className="mr-3" isOpen={dropdownOpen} toggle={dropdownToggle}>
            <DropdownToggle nav caret>
              ブログ一覧
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag={Link} to="/blogs/1">欅坂46</DropdownItem>
              <DropdownItem tag={Link} to="/blogs/2">日向坂46</DropdownItem>
              <DropdownItem tag={Link} to="/blogs/2/2">新着ブログ</DropdownItem>
              <DropdownItem tag={Link} to="/blogs/1/13">人気ブログ</DropdownItem>
              <DropdownItem tag={Link} to="/members">メンバーリスト</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown nav inNavbar id="nav-dropdown-official" className="mr-3" isOpen={dropdownOpen2} toggle={dropdownToggle2}>
            <DropdownToggle nav caret>
              公式
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href="https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000" target="_blank">
                欅坂46公式ブログ<i className="fas fa-external-link-alt" />
              </DropdownItem>
              <DropdownItem href="https://www.hinatazaka46.com/s/official/diary/member?ima=0000" target="_blank">
                日向坂46公式ブログ<i className="fas fa-external-link-alt" />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavItem><NavLink href="/#howto" className="mr-3">つかい方</NavLink></NavItem>
          <NavItem><NavLink href="/support/" className="mr-0">サポート</NavLink></NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavigationBar;