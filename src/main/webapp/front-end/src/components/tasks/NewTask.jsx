import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { saveTask, saveTaskSuccess, saveTaskError, viewTask, viewTaskSuccess, viewTaskError } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';

class NewTask extends React.Component {
  componentDidMount() {
    if(this.props.match.params.id && !this.props.currentTask.get('task')) {
        this.props.getTask(this.props.match.params.id)
    }
  }


  constructor(props) {
    super(props);
    this.state = {
      name: this.props.currentTask.getIn(['task', 'name'], ''),
      id: this.props.currentTask.getIn(['task', 'id'], null),
      redirectToReferrer: false
    };

    this.onNameChange = (e) => this.setState({ name: e.target.value });
    this.onSubmit = (e) => {
      e.preventDefault();
      console.log(this.state.id)
      this.props.onSubmit(this.state.name, this.state.id)
        .then(isSuccess => this.setState({ redirectToReferrer: isSuccess }));
    };
  }

  render() {

    if(!this.state.id){
        this.state.name = this.props.currentTask.getIn(['task', 'name'], '')
        this.state.id = this.props.currentTask.getIn(['task', 'id'], null)
    }

    const { from } = this.props.location.state || { from: { pathname: '/tasks' } };
    if (this.state.redirectToReferrer && this.props.currentTask.getIn(['task', 'id'])) {
      return <Redirect to={"/tasks/"+ this.props.currentTask.getIn(['task', 'id']) +"/labels/new"} />;
    }

    const nameFormProps = {
      type: 'name',
      label: 'Name:',
      placeholder: 'Task Name',
      onChange: this.onNameChange,
      value: this.state.name
    };

    return <Grid>
      <PageHeader>
        New Task
      </PageHeader>
      <form role="form" onSubmit={this.onSubmit}>
        <FormGroupBase baseProps={nameFormProps}/>
        <Button
          bsStyle="primary"
          type="submit">
          Create Task
        </Button>
      </form>
    </Grid>;
  }
}

const mapStateToProps = state => {
  return {
    currentTask: state.get('currentTask')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (name, id) => {
      return dispatch(saveTask(name, id))
        .then(response => {
          if (response.error) {
            dispatch(saveTaskError(response.error));
            return false;
          }

          dispatch(saveTaskSuccess(response.payload.data));
          return true;
        });
    },
    getTask: (taskId) => {
        return dispatch(viewTask(taskId))
            .then(response => {
                if(response.error) {
                    dispatch(viewTaskError(response.error));
                    return false;
                }

                dispatch(viewTaskSuccess(response.payload.data));
                return true;
            })
    }
  };
};

const NewTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTask);

export default NewTaskContainer;
