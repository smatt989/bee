import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  PageHeader
} from 'react-bootstrap';
import { participantLink, participantLinkSuccess, participantLinkError } from '../../actions.js';

class ShareTask extends React.Component {
    componentDidMount() {
        this.props.getLink(this.props.task.id)
    }

    invitationLink() {
        if(this.props.participantLink.get('link')) {
            const currentUrl = window.location.href
            const urlLeftSide = currentUrl.split("#")[0] + "#"
            return (urlLeftSide + "/invitation/"+this.props.participantLink.get('link'))
        }
        return 'error'
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
        <h2>Share link to invite people to participate!</h2>
        <h4>{this.invitationLink()}</h4>
    </div>
  }

  render() {
    return <Grid>
      <PageHeader>
        View Task
      </PageHeader>
      { this.buildContent() }
    </Grid>;
  }
}

const mapStateToProps = state => {
  const currentTask = state.getIn(['currentTask', 'task']);
  return {
    task: currentTask ? currentTask.toJS() : null,
    error: state.getIn(['currentTask', 'error']),
    loading: state.getIn(['currentTask', 'loading']),
    participantLink: state.get('participantLink')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getLink: (taskId) => {
        return dispatch(participantLink(taskId))
            .then(response => {
                if(response.error) {
                    dispatch(participantLinkError(response.error));
                    return false
                }

                dispatch(participantLinkSuccess(response.payload.data));
                return true;
            })
    }
  };
};

const ShareTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareTask);

export default ShareTaskContainer;
