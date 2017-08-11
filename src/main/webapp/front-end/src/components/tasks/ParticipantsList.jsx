import React from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Map, List } from 'immutable';
import { taskParticipants, taskParticipantsSuccess, taskParticipantsError, activateParticipant, activateParticipantSuccess, activateParticipantError, deactivateParticipant, deactivateParticipantSuccess, deactivateParticipantError, viewParticipantsDetails, viewParticipantsDetailsSuccess, viewParticipantsDetailsError, downloadLabels, downloadLabelsSuccess, downloadLabelsError, domain } from '../../actions.js';
import ParticipantTableItem from './ParticipantTableItem.jsx';

class ParticipantsList extends React.Component {
  constructor(props) {
    super(props);

    this.participantDetailsFromParticipantId = this.participantDetailsFromParticipantId.bind(this);

  }

  componentDidMount() {
    this.props.getParticipants(this.props.match.params.id);
    this.props.getParticipantsDetails(this.props.match.params.id);
  }

  participantDetailsFromParticipantId(id){
    return this.props.participantsDetails.get('details').find(function(a){return a.get('participantId') == id}, null, Map({}))
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


    var participantsText = participants.length > 1 ? "Participants" : "Participant"

    return <div>
        <div className="inline m-t-5">
            <h3>{participants.length} {participantsText}</h3>
            <LinkContainer to={'/tasks/'+this.props.match.params.id+'/participant-link/new'}>
                <Button className="new-tbl-item-btn" bsStyle="primary" type="button">Share</Button>
            </LinkContainer>
            <a className="pull-right" href={domain+'/tasks/'+this.props.match.params.id+'/labels/dump'}>
                <Button className="pull-right">Download Labels</Button>
            </a>
        </div>
        <Table id="participant-tbl" responsive striped hover>
          <thead>
            <tr>
              <th>Name</th>
              <th># Labeled</th>
              <th># Seen</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { participants.map(o =>
              <ParticipantTableItem details={this.participantDetailsFromParticipantId(o.participantId)} key={o.email} data={o} {...this.props} />)}
          </tbody>
        </Table>
    </div>;
  }

  render() {
    return this.buildContent();
  }
}

const mapStateToProps = state => {
  return {
    participants: state.getIn(['taskParticipants', 'participants'], List.of()).toJS(),
    participantsDetails: state.get('currentParticipantsDetails'),
    loading: state.getIn(['taskParticipants', 'loading']),
    error: state.getIn(['taskParticipants', 'error']),
    downloadLabels: state.get('downloadLabels')
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
    getParticipantsDetails: (taskId) => {
        return dispatch(viewParticipantsDetails(taskId))
            .then(response => {
                if(response.error) {
                    dispatch(viewParticipantsDetailsError(response.error));
                    return false;
                }

                dispatch(viewParticipantsDetailsSuccess(response.payload.data));
                return true;
            })
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
    },
    downloadLabels: (taskId) => {
        return dispatch(downloadLabels(taskId))
            .then(response => {
                if(response.error){
                    dispatch(downloadLabelsError(response.error));
                    return false;
                }
                //return response;
                window.open(response.file)
                dispatch(downloadLabelsSuccess());
                return true;
            })
    }
  };
};

export const ParticipantsListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantsList)