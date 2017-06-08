import React from 'react';
import { 
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Row, 
  Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

class EmailFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.regexp = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$/);
    this.state = {
      value: '',
      focused: false,
      hasFocused: false
    }

    this.getValidationState = () => {
      if (this.state.focused || !this.state.hasFocused) {
        return null;
      }

      if (this.state.value.length > 0 && this.regexp.exec(this.state.value)) {
        return 'success';
      }

      return 'error';
    }

    this.onChange = (e) => this.setState({ value: e.target.value });
    this.onFocus = () => this.setState({ focused: true });
    this.onBlur = () => this.setState({ focused: false, hasFocused: true });
  }

  render() {
    return <FormGroup controlId="email" validationState={this.getValidationState()}>
      <ControlLabel>Email Address</ControlLabel>
      <FormControl 
        type="email"
        value={this.state.value}
        placeholder="Enter your email"
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur} />
      <FormControl.Feedback />
    </FormGroup>
  }
}

class PasswordFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      hasFocused: false,
      focused: false
    }

    this.getValidationState = () => {
      if (this.state.focused || !this.state.hasFocused) {
        return null;
      }

      if (this.state.value.length > 6) {
        return 'success';
      }

      return 'error';
    }

    this.onChange = (e) => this.setState({ value: e.target.value });
    this.onFocus = () => this.setState({ focused: true });
    this.onBlur = () => this.setState({ focused: false, hasFocused: true });
  }

  render() {
    return <FormGroup controlId="password" validationState={this.getValidationState()}>
      <ControlLabel>Password</ControlLabel>
      <FormControl 
        type="password"
        ref="password"
        value={this.state.value}
        placeholder="Choose a password"
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur} />
      <FormControl.Feedback />
    </FormGroup>
  }
}

export default class Register extends React.Component {
  render() {
    // TODO onSubmit validation, prevent submission if error
    return <div>
        <Row>
          <h1>Register</h1>
        </Row>
        <form role="form" action="/auth/signup" method="post">
          <Row><EmailFormGroup /></Row>
          <Row><PasswordFormGroup /></Row>
          <Row>
            <Button
              bsStyle="primary"
              type="submit">
              Register
            </Button>
            <span className="altAuthMsg">Have an account? <Link to={{ pathname: "/login" }}>Log in</Link>.</span>
          </Row>
        </form>
      </div>
  }
}