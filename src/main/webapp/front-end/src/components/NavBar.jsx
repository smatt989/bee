import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class NavBar extends React.Component {
  render() {
    return <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Bee</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <LinkContainer to="/tasks"><NavItem eventKey={1}>Tasks</NavItem></LinkContainer>
                <LinkContainer to="/images"><NavItem eventKey={2}>Images</NavItem></LinkContainer>
              </Nav>
              <Nav pullRight>
                <LinkContainer to="/login"><NavItem eventKey={1}>Log In</NavItem></LinkContainer>
                <LinkContainer to="/register"><NavItem eventKey={2}>Sign Up</NavItem></LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Navbar>;
  }
}