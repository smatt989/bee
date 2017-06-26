import React from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { Map, List } from 'immutable';
import { taskParticipants, taskParticipantsSuccess, taskParticipantsError, activateParticipant, activateParticipantSuccess, activateParticipantError, deactivateParticipant, deactivateParticipantSuccess, deactivateParticipantError } from '../../actions.js';
import ParticipantTableItem from './ParticipantTableItem.jsx';

class ParticipantsList extends React.Component {
  componentDidMount() {
    this.props.getParticipants(this.props.match.params.id);
  }

  buildContent() {
    const { participants, loading, error } = this.props;
    if (error) {
      return <div>Error</div>;
    } else if (loading) {
      return <div>Loading</div>;
    } else if (!participants) {
      return null;
    };

    return <Table id="participant-tbl" responsive striped hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        { participants.map(o =>
          <ParticipantTableItem key={o.email} data={o} {...this.props} />)}
      </tbody>
    </Table>;
  }

  render() {
    return this.buildContent();
  }
}

const mapStateToProps = state => {
  return {
    participants: state.getIn(['taskParticipants', 'participants'], List.of()).toJS(),
    loading: state.getIn(['taskParticipants', 'loading']),
    error: state.getIn(['taskParticipants', 'error'])
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getParticipants: (taskId) => {
        return dispatch(taskParticipants(taskId))
            .then(response => {
                if(response.error) {
                    dispatch(taskParticipantsError(response.error));
                    return false;
                }

                dispatch(taskParticipantsSuccess(response.payload.data));
                return true;
            });
    },
    activate: (participantId) => {
        return dispatch(activateParticipant(participantId))
            .then(response => {
                if(response.error) {
                    dispatch(activateParticipantError(response.error));
                    return false;
                }

                dispatch(activateParticipantSuccess(response.payload.data));
                return true;
            })
    },
    deactivate: (participantId) => {
        return dispatch(deactivateParticipant(participantId))
            .then(response => {
                if(response.error) {
                    dispatch(deactivateParticipantError(response.error));
                    return false;
                }

                dispatch(deactivateParticipantSuccess(response.payload.data));
                return true;
            })
    }
  };
};

export const ParticipantsListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantsList)