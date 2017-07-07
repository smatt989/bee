import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { viewTaskOntology, viewTaskOntologySuccess, viewTaskOntologyError } from '../../actions.js';
import ImageSourcesCount from './ImageSourcesCount.jsx';
import ImageSourcesImageCount from './ImageSourcesImageCount.jsx';

class OntologyInfo extends React.Component {
  componentDidMount() {
    this.props.getOntology(this.props.match.params.id);
  }

  render() {

    var rangeDisplay = null
    if(this.props.currentTaskOntology.getIn(['ontology', 'minValue']) != null) {
      rangeDisplay = <span>({this.props.currentTaskOntology.getIn(['ontology', 'minValue'])} - {this.props.currentTaskOntology.getIn(['ontology', 'maxValue'])})</span>
    }

    return <div>
                <div><b>Name: </b>{this.props.currentTaskOntology.getIn(['ontology', 'name'], 'error...')}</div>
                <div><b>Type: </b>{this.props.currentTaskOntology.getIn(['ontology', 'ontologyType'], 'error...')} {rangeDisplay}</div>
                <LinkContainer to={'/tasks/'+this.props.match.params.id+'/labels/new'}>
                    <Button className="new-tbl-item-btn" bsStyle="primary" type="button">Edit</Button>
                </LinkContainer>
            </div>
  }
}

const mapStateToProps = state => {
  return {
    currentTaskOntology: state.get('currentTaskOntology')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getOntology: (taskId) => {
        return dispatch(viewTaskOntology(taskId))
            .then(response => {
                if (response.error) {
                    dispatch(viewTaskOntologyError(response.error));
                    return false;
                }

                dispatch(viewTaskOntologySuccess(response.payload.data));
                return true;
            })
    }
  };
};

const OntologyInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OntologyInfo);

export default OntologyInfoContainer;
