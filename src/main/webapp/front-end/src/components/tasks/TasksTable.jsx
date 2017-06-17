import React from 'react';
import { connect } from 'react-redux';
import { 
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { tasksCreated, tasksCreatedSuccess, tasksCreatedError } from '../../actions.js';
import TasksTableItem from './TasksTableItem.jsx';

class TasksTable extends React.Component {
  componentDidMount() {
    this.props.getTasksCreated();
  }

  buildContent() {
    const { tasks, loading, error } = this.props;
    if (error) {
      return <div>Error</div>;
    } else if (loading) {
      return <div>Loading</div>;
    } else if (!tasks) {
      return null;
    } 

    return <Table id="task-tbl" responsive striped hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        { tasks ? tasks.map(o => 
          <TasksTableItem key={o.id} data={o} {...this.props} />) : 
          null }
      </tbody>
    </Table>;
  }

  render() {
    return this.buildContent();
  }
}

const mapStateToProps = state => {
  const tasksCreated = state.getIn(['tasksCreated', 'tasks']);
  return {
    tasks: tasksCreated ? tasksCreated.toJS().data : null,
    loading: state.getIn(['tasksCreated', 'loading']),
    error: state.getIn(['tasksCreated', 'error'])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getTasksCreated: () => {
      return dispatch(tasksCreated())
        .then(response => {
          if (response.error) {
            dispatch(tasksCreatedError(response.error));
            return false;
          }

          dispatch(tasksCreatedSuccess(response.payload));
          return true;
        })
    }
  }
}

const TasksTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksTable)

export default TasksTableContainer;