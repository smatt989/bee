import React from 'react';
import {
  Grid, 
  PageHeader,
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
    return <Grid>
        <PageHeader>Register</PageHeader>
        <form role="form" action="/auth/signup" method="post">
          <EmailFormGroup emailInputProps={emailInputProps}/>
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