import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { 
  Grid, 
  PageHeader,
  FormControl,
  FormGroup,
  ControlLabel,
  Button
} from 'react-bootstrap';
import { saveTask, saveTaskSuccess, saveTaskError } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';

class NewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      label: '',
      redirectToReferrer: false
    }

    this.onNameChange = (e) => this.setState({ name: e.target.value });
    this.onLabelChange = (e) => this.setState({ label: e.target.value });
    this.onSubmit = (e) => {
      e.preventDefault();
      this.props.onSubmit(this.state.name, this.state.label)
        .then(isSuccess => this.setState({ redirectToReferrer: isSuccess }));
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/tasks' } }
    if (this.state.redirectToReferrer) {
      return <Redirect to={from} />
    }

    const nameFormProps = {
      type: "name",
      label: "Name:",
      placeholder: "Task Name",
      onChange: this.onNameChange,
      value: this.state.name
    };

    const labelFormProps = {
      type: "label",
      label: "Label:",
      placeholder: "Task Label",
      onChange: this.onLabelChange,
      value: this.state.label
    };

    return <Grid>
      <PageHeader>
        New Task
      </PageHeader>
      <form role="form" onSubmit={this.onSubmit}>
        <FormGroupBase baseProps={nameFormProps}/>
        <FormGroupBase baseProps={labelFormProps}/>
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
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (name, label) => {
      return dispatch(saveTask(name))
        .then(response => {
          if (response.error) {
            dispatch(saveTaskError(response.error));
            return false;
          }

          dispatch(saveTaskSuccess(response.payload));
          return true;
        })
    }
  }
}

const NewTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTask)

export default NewTaskContainer;