import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  PageHeader
} from 'react-bootstrap';
import { viewTask } from '../../actions.js';

class ViewTask extends React.Component {
  componentDidMount() {
    this.props.getTask();
  }

  buildContent() {
    const { task, loading, error } = this.props;
    if (error) {
      return <div>Error</div>;
    } else if (loading) {
      return <div>Loading</div>;
    } else if (!task) {
      return null;
    }

    return (
      <div>
        <div>Id: { task.id }</div>
        <div>Name: { task.name }</div>
      </div>
    );
  }

  render() {
    return (
      <Grid>
        <PageHeader>
          View Task
        </PageHeader>
        { this.buildContent() }
      </Grid>
    );
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
    getTask: viewTask(ownProps.match.params.id)
  };
};

const ViewTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewTask);

export default ViewTaskContainer;
