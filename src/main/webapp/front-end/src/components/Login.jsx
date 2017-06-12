import React from 'react'
import { connect } from 'react-redux'
import { 
  Grid,
  PageHeader,
  Button  
} from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom'
import { loginEmailChanged, loginPasswordChanged, login, loginSuccess, loginError } from '../actions.js'
import EmailFormGroup from './account_forms/EmailFormGroup.jsx'
import PasswordFormGroup from './account_forms/PasswordFormGroup.jsx'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false
    }

    this.onSubmit = (e) => {
      e.preventDefault();
      this.props.onSubmit(this.props.email, this.props.password)
        .then(response => this.setState({ redirectToReferrer: response }))
    }
  }

  render() {
    const emailInputProps = { value: this.props.email, validation: null, placeholder: "Enter your email", action: (email) => loginEmailChanged(email) };
    const pwInputProps = { value: this.props.password, validation: null, placeholder: "Enter your password", action: (password) => loginPasswordChanged(password) };
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    
    if (this.state.redirectToReferrer) {
      return <Redirect to={from} />
    }

    return <Grid>
        <PageHeader>Log in</PageHeader>
        <form role="form" onSubmit={this.onSubmit}>
          <EmailFormGroup emailInputProps={emailInputProps} />
          <PasswordFormGroup pwInputProps={pwInputProps} />
          <Button
            bsStyle="primary"
            type="submit">
            Log In
          </Button>
          <span className="altAuthMsg"><Link to={{ pathname: "/recover" }}>Forgot your password?</Link></span>
        </form>
      </Grid>
  }
}

const mapStateToProps = state => {
  return {
      email: state.get('loginEmail').get('email'),
      password: state.get('loginPassword').get('password')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // TODO onSubmit validation, prevent submission if error
    onSubmit: (email, password) => {
      return dispatch(login(email, password))
        .then(response => {
          if (response.error) {
            dispatch(loginError(response.error));
            return false;
          }

          const session = response.payload.headers["bee-session-key"];
          dispatch(loginSuccess(session));
          return true;
        })
    }
  }
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default LoginContainer;