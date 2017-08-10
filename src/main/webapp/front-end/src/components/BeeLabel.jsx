import React from 'react';
import { Link } from 'react-router-dom';

export default class BeeLabel extends React.Component {
  render() {

    var linkTo = "/tasks"
    if(this.props.inverse){
        linkTo = "/"
    }

    return <Link to={linkTo}><h1 className='logo-font'>bee</h1></Link>
  }
};
