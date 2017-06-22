import React from 'react';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { signupEmailChanged, signupPasswordChanged, signupClearInputs, createUser, createUserSuccess, createUserError } from '../../actions.js';
import { tryLogin } from '../../utilities.js';
import EmailFormGroupContainer from './EmailFormGroup.jsx';
import PasswordFormGroup from './PasswordFormGroup.jsx';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false
    };

    this.onSubmit = (e) => {
      e.preventDefault();
      this.props.onSubmit(this.props.email, this.props.password)
        .then(isSuccess => {
          this.setState({ redirectToReferrer: isSuccess })
          if (isSuccess) {
            this.props.clearInputs();
          }
        });
    };
  }

  render() {
    const emailInputProps = { value: this.props.email, placeholder: "Enter your email", action: (email) => signupEmailChanged(email) };
    const pwInputProps = { value: this.props.password, placeholder: "Choose a password", action: (password) => signupPasswordChanged(password) };
    const { from } = this.props.location.state || { from: { pathname: '/' } }

    if (this.state.redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <Grid>
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
    );
  }
}

const mapStateToProps = state => {
  return {
    email: state.getIn(['signupEmail', 'email']),
    password: state.getIn(['signupPassword', 'password'])
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // TODO onSubmit validation, prevent submission if error
    onSubmit: (email, password) => {
      return dispatch(createUser(email, password))
        .then(response => {
          if (response.error) {
            dispatch(createUserError(response.error));
            return false;
          }

          dispatch(createUserSuccess(response.payload.data));
          return tryLogin(email, password);
        });
    },
    clearInputs: () => dispatch(signupClearInputs())
  };
};

const RegisterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);

export default RegisterContainer;