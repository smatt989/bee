import React from 'react';
import { connect } from 'react-redux';
import { 
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { tasksCreated, tasksCreatedSuccess, tasksCreatedError } from '../../actions.js';
import TasksTableItemContainer from './TasksTableItem.jsx';

class TasksTable extends React.Component {
  constructor(props) {
    super(props);

    this.props.getTasksCreated()
      .then(isSuccess => {
        if (!isSuccess) {
          // TODO show error
          return null;
        }
      });

    this.onClick = () => console.log("clicked");
  }

  render() {
    const { tasks } = this.props;
    
    return <Table id="task-tbl" responsive striped hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        { tasks ? tasks.map(o => <TasksTableItemContainer key={o.id} data={o} {...this.props} />) : null }
      </tbody>
    </Table>
  }
}

const mapStateToProps = state => {
  const tasksCreatedObj = state.get('tasksCreated').toJS();
  return {
    tasks: tasksCreatedObj ? tasksCreatedObj.tasks.data : null
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