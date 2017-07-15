import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { saveTask, saveTaskSuccess, saveTaskError, viewTask, viewTaskSuccess, viewTaskError, stopEditingTask, startEditingTask } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';

class NewTask extends React.Component {
  componentDidMount() {
    if(this.props.match.params.id && !this.props.currentTask.get('task')) {
        this.props.getTask(this.props.match.params.id)
    }
    if(this.props.match.params.id){
        this.props.startEditingTask()
    } else {
        this.props.stopEditingTask()
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
      this.props.onSubmit(this.state.name, this.state.id)
        .then(isSuccess => this.setState({ redirectToReferrer: isSuccess }));
    };
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/tasks' } };

    var buttonText = "Create Task"
    var buttonRedirectTo = "/tasks/"+ this.props.currentTask.getIn(['task', 'id']) +"/labels/new"
    var cancelRedirectTo = "/tasks"

    if(this.props.editingTask){
        buttonText = "Save Task"
        buttonRedirectTo = "/tasks/"+ this.props.currentTask.getIn(['task', 'id']) +"/view"
        cancelRedirectTo = buttonRedirectTo
    }

    if (this.state.redirectToReferrer && this.props.currentTask.getIn(['task', 'id'])) {
        return <Redirect to={buttonRedirectTo} />;
    }

    const nameFormProps = {
      type: 'name',
      label: 'Name:',
      placeholder: 'Task Name',
      onChange: this.onNameChange,
      value: this.state.name
    };

    return <div className="center-form center box-border">
                <h1>New Task</h1>
                  <form role="form" onSubmit={this.onSubmit}>
                    <FormGroupBase baseProps={nameFormProps}/>
                    <div className="form-submit-box">
                        <Button
                          bsStyle="primary"
                          type="submit">
                          {buttonText}
                        </Button>
                        <p><Link to={{ pathname: buttonRedirectTo }}>Cancel</Link></p>
                    </div>
                  </form>
            </div>;
  }
}

const mapStateToProps = state => {
  return {
    currentTask: state.get('currentTask'),
    editingTask: state.get('editingTask')
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
    },
    stopEditingTask: () => {
        dispatch(stopEditingTask())
    },
    startEditingTask: () => {
        dispatch(startEditingTask())
    }
  };
};

const NewTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTask);

export default NewTaskContainer;
