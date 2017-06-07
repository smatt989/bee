import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import NavBar from './NavBar.jsx';
import Home from './Home.jsx';
import Register from './Register.jsx';
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
              <Route exact path="/register" component={Register}/>
              <Route path="/" component={Err}/>
            </Switch>
          </Col>
        </Row>
      </Grid>
    </Router>
  }
}
