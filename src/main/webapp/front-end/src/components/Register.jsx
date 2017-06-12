import React from 'react';
import {
  Grid, 
  PageHeader,
  Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signupEmailChanged, signupPasswordChanged, createUser } from '../actions.js'
import EmailFormGroupContainer from './account_forms/EmailFormGroup.jsx'
import PasswordFormGroup from './account_forms/PasswordFormGroup.jsx'

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = (e) => {
      e.preventDefault();
      this.props.onSubmit(this.props.email, this.props.password);
    }
  }

  render() {
    const emailInputProps = { value: this.props.email, placeholder: "Enter your email", action: (email) => signupEmailChanged(email) };
    const pwInputProps = { value: this.props.password, placeholder: "Choose a password", action: (password) => signupPasswordChanged(password) };

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
        email: state.get('signupEmail').get('email'),
        password: state.get('signupPassword').get('password')
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        // TODO onSubmit validation, prevent submission if error
        onSubmit: (email, password) => dispatch(createUser(email, password))
    }
}

const RegisterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Register)

export default RegisterContainer;