import React from 'react';
import { Grid, Jumbotron, Button, Glyphicon } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import BeeLabel from './BeeLabel.jsx';

export default class Home extends React.Component {
  render() {
    return <div className="landing full-screen-page">
        <div className="home-header">
            <BeeLabel />
            <Link to="/login"><Button className="home-login-button" bsStyle="primary"><Glyphicon glyph="lock" /> Login</Button></Link>
        </div>
        <div className="home-action center">
            <h1>Knowledge Acquisition</h1>
            <h3>Efficiently and Intelligently Collect Expert Annotations</h3>
            <Link to="/register"><Button bsSize="large" className="home-create-account-button" bsStyle="success">Create Account</Button></Link>
        </div>
      </div>;
  }
};