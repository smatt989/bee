import React from 'react';
import { 
  Button,
  Row, 
  Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EmailFormGroup from './account_forms/EmailFormGroup.jsx'
import PasswordFormGroup from './account_forms/PasswordFormGroup.jsx'

export default class Login extends React.Component {
  render() {
    const emailInputProps = { isSignup: false, placeholder: "Enter your email" };
    const pwInputProps = { isSignup: false, placeholder: "Enter your password" };

    return <div>
        <Row>
          <h1>Log in</h1>
        </Row>
        <form role="form" action="/auth/login" method="post">
          <Row><EmailFormGroup emailInputProps={emailInputProps} /></Row>
          <Row><PasswordFormGroup pwInputProps={pwInputProps} /></Row>
          <Row>
            <Button
              bsStyle="primary"
              type="submit">
              Log In
            </Button>
            <span className="altAuthMsg"><Link to={{ pathname: "/recover" }}>Forgot your password?</Link></span>
          </Row>
        </form>
      </div>
  }
}