import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import NavBar from './NavBar';

export default class App extends React.Component {
  render() {
    return <Grid>
        <Row>
            <Col>
                <NavBar />
            </Col>
        </Row>
        <Row className="show-grid">
            <Col>
              { React.cloneElement(this.props.children) }
            </Col>
        </Row>
    </Grid>
  }
}
