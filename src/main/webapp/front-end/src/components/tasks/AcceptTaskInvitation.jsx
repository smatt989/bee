import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  PageHeader
} from 'react-bootstrap';
import { acceptInvitation, acceptInvitationSuccess, acceptInvitationError } from '../../actions.js';

class AcceptTaskInvitation extends React.Component {
  componentDidMount() {
    this.props.accept(this.props.match.params.invitation);
  }

  buildContent() {
    const { task, loading, error } = this.props;
    if (error) {
      return <div>Error</div>
    } else if (loading) {
      return <div>Loading</div>
    } else if (!task) {
      return null;
    }

    return <div>
      <h2>You did it!</h2>
      <div>You are now participating in { task.name }</div>
    </div>
  }

  render() {
    return <Grid>
      <PageHeader>
        Accept Task Invitation
      </PageHeader>
      { this.buildContent() }
    </Grid>;
  }
}

const mapStateToProps = state => {
  const currentTask = state.getIn(['acceptInvitation', 'task']);
  return {
    task: currentTask ? currentTask.toJS() : null,
    error: state.getIn(['acceptInvitation', 'error']),
    loading: state.getIn(['acceptInvitation', 'loading'])
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    accept: (invitation) => {
        return dispatch(acceptInvitation(invitation))
            .then(response => {
                if(response.error) {
                    dispatch(acceptInvitationError(response.error));
                    return false;
                }

                dispatch(acceptInvitationSuccess(response.payload.data));
                return true;
            })
    }
  };
};

const AcceptTaskInvitationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AcceptTaskInvitation);

export default AcceptTaskInvitationContainer;
