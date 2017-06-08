import React from 'react';
import { 
  Button,
  Row, 
  Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EmailFormGroup from './account_forms/EmailFormGroup.jsx'
import PasswordFormGroup from './account_forms/PasswordFormGroup.jsx'

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