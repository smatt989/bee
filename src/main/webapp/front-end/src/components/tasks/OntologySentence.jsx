import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { viewTaskOntology, viewTaskOntologySuccess, viewTaskOntologyError } from '../../actions.js';
import { ONTOLOGY_TYPE_BINARY, ONTOLOGY_TYPE_FLOAT_RANGE, ONTOLOGY_TYPE_INTEGER_RANGE } from './../../utilities.js';

class OntologySentence extends React.Component {
  componentDidMount() {
    this.props.getOntology(this.props.match.params.id);
  }

  constructor(props) {
    super(props);

    this.displayType = this.displayType.bind(this)
  }

  displayType() {
    const ontology = this.props.currentTaskOntology.get('ontology', null);
    if(ontology){
        const unlimited = ontology.get('labelLimit', 1) != 1;

        const unlimitedLabel = unlimited ? "multiple" : "one"

        var labelTargetType = ontology.get('isAreaLabel', false) ? "area label" : ontology.get('isLengthLabel', false) ? "length label" : "image label";

        if(unlimited){
            labelTargetType += "s"
        }

        const ontologyType = ontology.get('ontologyType', null)
        var labelValueType = ontologyType == ONTOLOGY_TYPE_FLOAT_RANGE ? "float range" : ontologyType == ONTOLOGY_TYPE_INTEGER_RANGE ? "integer range" : "binary"

        if(ontology.get('minValue', null) != null) {
          labelValueType += ": "+ontology.get('minValue') + " - " + ontology.get('maxValue')
        }

        return unlimitedLabel+" "+labelTargetType+" ("+labelValueType+")"
    } else {
        return null
    }
  }

  render() {

    var rangeDisplay = null
    if(this.props.currentTaskOntology.getIn(['ontology', 'minValue']) != null) {
      rangeDisplay = <span>({this.props.currentTaskOntology.getIn(['ontology', 'minValue'])} - {this.props.currentTaskOntology.getIn(['ontology', 'maxValue'])})</span>
    }

    return <p>Labeling <b>"{this.props.currentTaskOntology.getIn(['ontology', 'name'], 'error...')}"</b>, {this.displayType()}</p>
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

const OntologySentenceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OntologySentence);

export default OntologySentenceContainer;
