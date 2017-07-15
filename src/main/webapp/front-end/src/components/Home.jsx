import React from 'react';
import { Row, Grid, Jumbotron, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Home extends React.Component {
  render() {
    return <Jumbotron>
      <Grid>
        <div className='container'>
          <Row>
            <h1 className='text-xs-center'>Image Labeling Done Right</h1>
            <p className='text-xs-center'>At Bee Images, we're changing the way you label your image data so that you can focus on saving lives.</p>
            <p className='text-xs-center'>
              <LinkContainer to="/register">
                <Button bsStyle="primary">Learn more  </Button>
              </LinkContainer>
            </p>
          </Row>
        </div>
      </Grid>
    </Jumbotron>;
  }
};
