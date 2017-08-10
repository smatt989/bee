import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { Map, List} from 'immutable';
import { viewImageSourcesDetails, viewImageSourcesDetailsSuccess, viewImageSourcesDetailsError } from '../../actions.js';
import {sum} from '../../utilities.js'

class Participation extends React.Component {
  render() {
    return <div className="inline m-t-2">
        <p><b>{this.props.currentParticipationDetails.getIn(['details', 'labeled'], 0)}</b> labeled</p>
        <p><b>{this.props.currentParticipationDetails.getIn(['details', 'seen'], 0)}</b> seen</p>
    </div>
  }
}

const mapStateToProps = state => {
  return {
    currentParticipationDetails: state.get('currentParticipationDetails')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  };
};

const ParticipationContainers = connect(
  mapStateToProps,
  mapDispatchToProps
)(Participation);

export default ParticipationContainers;
