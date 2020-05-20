import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { withRouter } from 'react-router';


const NavigationBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="light" light expand="lg" className="static-top fixed-top border-bottom">
      <NavbarBrand href="/"></NavbarBrand>
      <NavbarToggler onClick={toggle} />

      <Collapse isOpen={isOpen} navbar>
        <form className="form-inline mt-3 mb-2 my-lg-0 justify-content-center col" autoComplete="off">
          <input className="col form-control autocomplete" type="search" placeholder="Search"
            aria-label="Search" name="q"></input>
        </form>
        <Nav className="mx-4 mx-lg-0" navbar>
          <UncontrolledDropdown nav inNavbar id="nav-dropdown1" className="mr-3">
            <DropdownToggle nav caret>
              ブログ一覧
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => props.history.push('/react/blogs/1')}>欅坂46</DropdownItem>
              <DropdownItem onClick={() => props.history.push('/react/blogs/2')}>日向坂46</DropdownItem>
              <DropdownItem onClick={() => props.history.push('/react/blogs/2/2')}>新着ブログ</DropdownItem>
              <DropdownItem onClick={() => props.history.push('/react/blogs/1/13')}>人気ブログ</DropdownItem>
              <DropdownItem onClick={() => props.history.push('/react/blogs/2/13')}>メンバーリスト</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar id="nav-dropdown2" className="mr-3">
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
          </UncontrolledDropdown>
          <NavItem><NavLink href="/#howto" className="mr-3">つかい方</NavLink></NavItem>
          <NavItem><NavLink href="/support/" className="mr-0">サポート</NavLink></NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default withRouter(NavigationBar);