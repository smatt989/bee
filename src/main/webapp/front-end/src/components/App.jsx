import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import NavBar from './NavBar.jsx';
import Home from './Home.jsx';
import LoginContainer from './Login.jsx';
import RegisterContainer from './Register.jsx';
import Tasks from './Tasks.jsx';
import Images from './Images.jsx';
import Err from './Error.jsx';

export default class App extends React.Component {
  render() {
    return <Router>
      <Grid>
        <Row>
          <Col>
            <NavBar />
          </Col>
        </Row>
        <Row className="show-grid">
          <Col>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/login" component={LoginContainer}/>
              <Route exact path="/register" component={RegisterContainer}/>
              <Route exact path="/tasks" component={Tasks}/>
              <Route exact path="/images" component={Images}/>
              <Route exact path="/recover" component={Images}/>
              <Route component={Err}/>
            </Switch>
          </Col>
        </Row>
      </Grid>
    </Router>
  }
}
