import React from 'react';
import { 
  Grid,
  PageHeader,
  Button  
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EmailFormGroup from './account_forms/EmailFormGroup.jsx'
import PasswordFormGroup from './account_forms/PasswordFormGroup.jsx'

export default class Login extends React.Component {
  render() {
    const emailInputProps = { isSignup: false, placeholder: "Enter your email" };
    const pwInputProps = { isSignup: false, placeholder: "Enter your password" };

    return <Grid>
        <PageHeader>Log in</PageHeader>
        <form role="form" action="/auth/login" method="post">
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