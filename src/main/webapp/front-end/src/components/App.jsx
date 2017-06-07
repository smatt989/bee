import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import NavBar from './NavBar';
import Home from './Home';
import Register from './Register';
import Err from './Error';

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
              <Route exact path="/register" component={Register}/>
              <Route path="/" component={Err}/>
            </Switch>
          </Col>
        </Row>
      </Grid>
    </Router>
  }
}
