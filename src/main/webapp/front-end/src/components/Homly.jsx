import React from 'react';
import { Grid, Jumbotron, Button, Glyphicon, Row, Media } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import BeeLabel from './BeeLabel.jsx';
import NavBar from './NavBar.jsx';

export default class Homely extends React.Component {
  render() {
    return <div>
            <div className="landing landing-first-segment">
                <NavBar inverse={true} />
                <div className="text-xs-center">
                    <Grid>
                          <Row>
                            <div className='col-md-12 description'>
                              <h1>Knowledge Acquisition</h1>
                              <h3>Efficiently and Intelligently Collect Expert Annotations</h3>
                            </div>
                          </Row>
                          <Row className="m-t-2">
                            <div className='col-md-12'>
                              <Link to="/register">
                                <Button bsStyle="success">Create Account</Button>
                              </Link>
                            </div>
                          </Row>
                    </Grid>
                </div>
            </div>
        <div className="landing-second-segment">
            <div className="text-xs-center">
                <h1>In This Release</h1>
            </div>
            <Grid>
                <Row>
                    <div className="feature-item col-md-4">
                        <div className="image-container">
                            <img src="../../images/amzn.png" />
                        </div>
                        <div className="description-container">
                            <h3>Get up and running fast</h3>
                            <p>Connect to a public Amazon S3 Bucket with images, share a link with annotators, and get started right away.</p>
                        </div>
                    </div>
                    <div className="feature-item col-md-4">
                        <div className="image-container">
                            <img src="../../images/label-example.png" />
                        </div>
                        <div className="description-container">
                            <h3>Flexible labeling</h3>
                            <p>Label the whole image, or label unlimited areas or lengths within the image with simple binary values, or a range of numerical values.</p>
                        </div>
                    </div>
                    <div className="feature-item col-md-4">
                        <div className="image-container">
                            <img src="../../images/graphing.png" />
                        </div>
                        <div className="description-container">
                            <h3>Coordinate and manage</h3>
                            <p>Bee handles the coordination to maximize coverage, and lets you track progress by participant.  Easily export a CSV to use in any ML algorithm.</p>
                        </div>
                    </div>
                </Row>
            </Grid>
        </div>
        <div className="upcoming-features landing-third-segment">
            <Grid>
                <h1>Upcoming Features</h1>
                <Row>
                    <div className="upcoming-feature-item">
                        <Glyphicon glyph="flash" className="col-md-1" />
                        <div className="upcoming-feature-description" className="col-md-11">
                            <h3>Active Learning</h3>
                            <p>Bee will prioritize images that will help the ML algorithm learn faster, and with fewer annotations.</p>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className="upcoming-feature-item">
                        <Glyphicon glyph="ok" className="col-md-1" />
                        <div className="upcoming-feature-description" className="col-md-11">
                            <h3>Double and Triple Check</h3>
                            <p>Specify how many participants should label each image, and see where your annotators disagree.</p>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className="upcoming-feature-item">
                        <Glyphicon glyph="stats" className="col-md-1" />
                        <div className="upcoming-feature-description" className="col-md-11">
                            <h3>Awesome Metrics</h3>
                            <p>Check progress, accuracy, disagreement, and other statistics over time and by participant.</p>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className="upcoming-feature-item">
                        <Glyphicon glyph="globe" className="col-md-1" />
                        <div className="upcoming-feature-description" className="col-md-11">
                            <h3>Find Great Labelers</h3>
                            <p>Find labelers around the world that can help you finish your annotation task faster.  Upload a qualification test to make sure they are up to the challenge.</p>
                        </div>
                    </div>
                </Row>
            </Grid>
        </div>
        <div className="text-xs-center landing-fourth-segment">
            <h3 className="m-b-2">Questions? Interested?</h3>
            <Button>Get in Touch!</Button>
        </div>
    </div>;
  }
};
