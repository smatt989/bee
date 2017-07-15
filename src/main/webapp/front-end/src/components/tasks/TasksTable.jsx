import React from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { getTasks, getTasksSuccess, getTasksError, tasksCreated, tasksCreatedSuccess, tasksCreatedError, tasksParticipating, tasksParticipatingSuccess, tasksParticipatingError, leaveTask, leaveTaskSuccess, leaveTaskError, cleanTaskState } from '../../actions.js';
import TasksTableItem from './TasksTableItem.jsx';
import EmptyTableMessage from './EmptyTableMessage.jsx';

class TasksTable extends React.Component {
  componentDidMount() {
    this.props.cleanTask();
    this.props.getTasks();
  }

  buildContent() {
    const { tasks, loading, error } = this.props;
    if (error) {
      return <div>Error</div>;
    } else if (loading) {
      return <div>Loading</div>;
    } else if (!tasks) {
      return null;
    };

    return <div>
        <h3>{this.props.tableHeader}</h3>
				<Table id="task-tbl" responsive striped hover>
		      <thead>
		        <tr>
		          <th>#</th>
		          <th>Name</th>
		          <th>Actions</th>
		        </tr>
		      </thead>
		      <tbody>
		        { tasks
              ? tasks.map(o =>
		            <TasksTableItem key={o.id} data={o} {...this.props} />)
		          : null
		        }
	      </tbody>
	    </Table>
      { tasks.length > 0 ? null : <EmptyTableMessage /> }
		</div>;
  }

  render() {
    return this.buildContent();
  }
}

const mapStateToProps = state => {
  return {
    tasks: state.getIn(['allTasks', 'tasks']).toJS(),
    loading: state.getIn(['allTasks', 'loading']),
    error: state.getIn(['allTasks', 'error'])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    cleanTask: () => {
        dispatch(cleanTaskState())
    },
    getTasks: () => {
        return dispatch(getTasks())
            .then(response => {
                if(response.error) {
                    dispatch(getTasksError(response.error));
                    return false;
                }

                dispatch(getTasksSuccess(response.payload.data));
                return true;
            })
    },
    leave: (taskId) => {
        return dispatch(leaveTask(taskId))
            .then(response => {
                if(response.error) {
                    dispatch(leaveTaskError(response.error));
                    return false;
                }

                dispatch(leaveTaskSuccess(response.payload.data));
                return true;
            })
    }
  }
}

export const TasksTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksTable)
