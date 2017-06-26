import React from 'react';
import { connect } from 'react-redux';
import { 
  Grid,
  PageHeader
} from 'react-bootstrap';
import { viewTask, viewTaskSuccess, viewTaskError } from '../../actions.js';
import ImageSourcesInfoContainer from './ImageSourcesInfo.jsx';
import { ParticipantsListContainer } from './ParticipantsList.jsx';

class ViewTask extends React.Component {
  componentDidMount() {
    this.props.getTask(this.taskId());
  }

  taskId() {
    return this.props.match.params.id
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
      <div>Id: { task.id }</div>
      <div>Name: { task.name }</div>
    </div> 
  }

  render() {
    return <Grid>
      <PageHeader>
        View Task
      </PageHeader>
      { this.buildContent() }
      <ImageSourcesInfoContainer {...this.props} />
      <ParticipantsListContainer {...this.props} />
    </Grid>;
  }
}

const mapStateToProps = state => {
  const currentTask = state.getIn(['currentTask', 'task']);
  return {
    task: currentTask ? currentTask.toJS() : null,
    error: state.getIn(['currentTask', 'error']),
    loading: state.getIn(['currentTask', 'loading'])
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getTask: (id) => {
      return dispatch(viewTask(id))
        .then(response => {
          if (response.error) {
            dispatch(viewTaskError(response.error));
            return false;
          }

          dispatch(viewTaskSuccess(response.payload.data));
          return true;
        });
    }
  };
};

const ViewTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewTask);

export default ViewTaskContainer;
