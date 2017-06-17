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
    this.state = {
      isLoading: true,
      isError: false
    };

    this.props.getTask(this.props.match.params.id)
      .then(isSuccess => this.setState({ isLoading: false, isError: isSuccess }));
  }

  render() {
    const { task } = this.props;
    const body = this.state.isLoading ? 
      <div>Loading</div> : 
      <div>
        <div>Id: { task.id }</div>
        <div>Name: { task.name }</div>
      </div>

    return <Grid>
      <PageHeader>
        View Task
      </PageHeader>
      { body } 
    </Grid>;
  }
}

const mapStateToProps = state => {
  const currentTask = state.get('currentTask').toJS().task;
  return {
    task: currentTask ? currentTask.data : null
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