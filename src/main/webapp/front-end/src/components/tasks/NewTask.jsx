import React from 'react';
import { connect } from 'react-redux';
import { 
  Grid, 
  PageHeader,
  FormControl,
  FormGroup,
  ControlLabel,
  Button
} from 'react-bootstrap';
import FormGroupBase from '../shared/FormGroupBase.jsx';

class NewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      label: ''
    }

    this.onNameChange = (e) => this.setState({ name: e.target.value });
    this.onLabelChange = (e) => this.setState({ label: e.target.value });
    this.onSubmit = (e) => {
      e.preventDefault();
      this.props.onSubmit(this.state.name, this.state.label);
    }
  }

  render() {
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

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSubmit: (name, label) => {
          console.log(name, label);
        }
    }
}

const NewTaskContainer = connect(
  mapDispatchToProps
)(NewTask)

export default NewTaskContainer;