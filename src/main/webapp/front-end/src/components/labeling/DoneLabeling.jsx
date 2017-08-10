import React from 'react';
import { Grid, Jumbotron, Button, Glyphicon } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import LabelImage from './LabelImage.jsx';
import NavBar from '../NavBar.jsx';

export default class DoneLabeling extends React.Component {
  render() {
    return <div className="col-md-push-3 col-md-5 m-t-5">
                 <h1>Done Labeling for now!</h1>
                 <div className="text-xs-center">
                   <Link to={'/tasks'}>
                     <Button bsStyle="primary">Done</Button>
                   </Link>
                 </div>

               </div>;
  }
};
