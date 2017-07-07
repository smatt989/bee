import React from 'react';
import { connect } from 'react-redux';
import { 
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { viewTask, viewTaskSuccess, viewTaskError, cleanTaskState, startEditingTask } from '../../actions.js';
import ImageSourcesInfoContainer from './ImageSourcesInfo.jsx';
import { ParticipantsListContainer } from './ParticipantsList.jsx';
import OntologyInfoContainer from './OntologyInfo.jsx';

class ViewTask extends React.Component {
  componentDidMount() {
    this.props.cleanTask()
    this.props.getTask(this.taskId());
    this.props.startEditingTask()
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
      <div>
        Name: { task.name }
        <LinkContainer to={'/tasks/'+task.id+'/edit'}>
            <Button className="new-tbl-item-btn" bsStyle="primary" type="button">Edit</Button>
        </LinkContainer>
      </div>
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
      <OntologyInfoContainer {...this.props} />
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
    cleanTask: () => {
        dispatch(cleanTaskState())
    },
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
    },
    startEditingTask: () => {
        dispatch(startEditingTask())
    }
  };
};

const ViewTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewTask);

export default ViewTaskContainer;
