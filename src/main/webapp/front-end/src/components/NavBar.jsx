import React from 'react';
import {Navbar, NavItem, NavDropdown, MenuItem, Nav} from 'react-bootstrap';

export default class NavBar extends React.Component {
  render() {
    return <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">Bee</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <NavItem eventKey={1} href="#">Tasks</NavItem>
                <NavItem eventKey={2} href="#">Images</NavItem>
              </Nav>
              <Nav pullRight>
                <NavItem eventKey={1} href="#">Log In</NavItem>
                <NavItem eventKey={2} href="#/register">Sign Up</NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>;
  }
}