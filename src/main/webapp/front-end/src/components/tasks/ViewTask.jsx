import React from 'react';
import { connect } from 'react-redux';
import { 
  Grid,
  PageHeader
} from 'react-bootstrap';
import { viewTask, viewTaskSuccess, viewTaskError } from '../../actions.js';

class ViewTask extends React.Component {
  constructor(props) {
    super(props);

    this.props.getTask(this.props.match.params.id);
  }

  buildContent() {
    const { task, loading, error } = this.props;
    if (error) {
      return <div>Error</div>
    } else if (loading) {
      return <div>Loading</div>
    } else if (task) {
      return <div>
        <div>Id: { task.id }</div>
        <div>Name: { task.name }</div>
      </div> 
    } else {
      return null;
    }
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
    task: currentTask ? currentTask.toJS().data : null,
    error: state.getIn(['currentTask', 'error']),
    loading: state.getIn(['currentTask', 'loading'])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getTask: (id) => {
      return dispatch(viewTask(id))
        .then(response => {
          if (response.error) {
            dispatch(viewTaskError(response.error));
            return false;
          }

          dispatch(viewTaskSuccess(response.payload));
          return true;
        });
    }
  }
}

const ViewTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewTask)

export default ViewTaskContainer;