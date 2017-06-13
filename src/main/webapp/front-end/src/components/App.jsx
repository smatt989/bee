import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import NavBarContainer from './NavBar.jsx';
import Home from './Home.jsx';
import LoginContainer from './Login.jsx';
import RegisterContainer from './Register.jsx';
import PrivateRouteContainer from './PrivateRoute.jsx';
import Tasks from './Tasks.jsx';
import Images from './Images.jsx';
import Err from './Error.jsx';

export default class App extends React.Component {
  render() {
    return <Router>
      <Grid>
        <Row>
          <Col>
            <NavBarContainer />
          </Col>
        </Row>
        <Row className="show-grid">
          <Col>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/login" component={LoginContainer}/>
              <Route exact path="/register" component={RegisterContainer}/>
              <Route exact path="/recover" component={LoginContainer}/>
              <PrivateRouteContainer exact path="/images" component={Images}/>
              <PrivateRouteContainer exact path="/tasks" component={Tasks}/>
              <Route component={Err}/>
            </Switch>
          </Col>
        </Row>
      </Grid>
    </Router>
  }
}
