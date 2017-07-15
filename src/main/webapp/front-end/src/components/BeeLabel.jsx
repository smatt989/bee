import React from 'react';
import { Link, Redirect } from 'react-router-dom';

export default class BeeLabel extends React.Component {
    render() {
      return <Link to="/"><h1 className="header-label">bee</h1></Link>
  }
};