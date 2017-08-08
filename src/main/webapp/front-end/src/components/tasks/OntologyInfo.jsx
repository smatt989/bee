import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import OntologySentenceContainer from './OntologySentence.jsx';

class OntologyInfo extends React.Component {

  render() {

    return <div className="inline">
                <OntologySentenceContainer {...this.props} />
                <Link to={'/tasks/'+this.props.match.params.id+'/labels/new'}>Edit</Link>
            </div>
  }
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

const OntologyInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OntologyInfo);

export default OntologyInfoContainer;
