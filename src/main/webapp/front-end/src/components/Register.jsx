import React from 'react';
import {
  Grid, 
  Row, 
  Col,
  Button  
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EmailFormGroup from './account_forms/EmailFormGroup.jsx'
import PasswordFormGroup from './account_forms/PasswordFormGroup.jsx'

export default class Register extends React.Component {
  render() {
    const emailInputProps = { isSignup: true, placeholder: "Enter your email" };
    const pwInputProps = { isSignup: true, placeholder: "Choose a password" };

    // TODO onSubmit validation, prevent submission if error
    return <div>
        <Row>
          <h1>Register</h1>
        </Row>
        <form role="form" action="/auth/signup" method="post">
          <Row><EmailFormGroup emailInputProps={emailInputProps}/></Row>
          <Row><PasswordFormGroup pwInputProps={pwInputProps}/></Row>
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