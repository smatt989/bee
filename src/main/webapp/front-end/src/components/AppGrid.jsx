import React from 'react';
import { render } from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import {connect} from 'react-redux';
import NavBar from './NavBar';
import Register from './Register';

class AppGrid extends React.Component {
    render() {
        return <Grid>
            <Row>
                <Col>
                    <NavBar />
                </Col>
            </Row>
            <Row className="show-grid">
                <Col>
                    <Register />
                </Col>
            </Row>
        </Grid>
    }
}

function mapStateToProps(state) {
  return {
  };
}

export const AppGridContainer = connect(mapStateToProps)(AppGrid);