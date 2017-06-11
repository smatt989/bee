import React from 'react';
import {
  Grid, 
  PageHeader,
  Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signupEmailChanged, signupPasswordChanged } from '../actions.js'
import EmailFormGroupContainer from './account_forms/EmailFormGroup.jsx'
import PasswordFormGroup from './account_forms/PasswordFormGroup.jsx'

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = (e) => {
      e.preventDefault();
      this.props.onSubmit(this.props.email, this.props.password);
    }

    this.regexp = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$/);
    this.emailValidation = (state) => {
      if (state.focused || !state.hasFocused) {
        return null;
      }

      if (this.props.email.length > 0 && this.regexp.exec(this.props.email)) {
        return 'success';
      }

      return 'error';
    }

    this.passwordValidation = (state) => {
      if (state.focused || !state.hasFocused) {
        return null;
      }

      if (this.props.password.length > 6) {
        return 'success';
      }

      return 'error';
    }
  }

  render() {
    const emailInputProps = { value: this.props.email, validation: (email) => this.emailValidation(email), placeholder: "Enter your email", action: (email) => signupEmailChanged(email) };
    const pwInputProps = { value: this.props.password, validation: (password) => this.passwordValidation(password), placeholder: "Choose a password", action: (password) => signupPasswordChanged(password) };

    return <Grid>
        <PageHeader>Register</PageHeader>
        <form role="form" onSubmit={e => this.onSubmit(e)}>
          <EmailFormGroupContainer emailInputProps={emailInputProps}/>
          <PasswordFormGroup pwInputProps={pwInputProps}/>
          <Button
            bsStyle="primary"
            type="submit">
            Register
          </Button>
          <span className="altAuthMsg">Have an account? <Link to={{ pathname: "/login" }}>Log in</Link>.</span>
        </form>
      </Grid>
  }
}

const mapStateToProps = state => {
    return {
        email: state.signup.email,
        password: state.signup.password
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        // TODO onSubmit validation, prevent submission if error
        onSubmit: (email, password) => {
          console.log(email, password);
        }
    }
}

const RegisterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Register)

export default RegisterContainer;