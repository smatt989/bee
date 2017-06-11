import React from 'react';
import { connect } from 'react-redux'
import { signupEmailChanged } from '../../actions.js';
import AccountFormGroupBase from './AccountFormGroupBase.jsx'

class EmailFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.regexp = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$/);
    this.validation = (state) => {
      if (state.focused || !state.hasFocused) {
        return null;
      }

      if (this.props.email.length > 0 && this.regexp.exec(this.props.email)) {
        return 'success';
      }

      return 'error';
    }

    this.onChange = (e) => this.props.onChange(e.target.value);
  }

  render() {
    const { isSignup, placeholder } = this.props.emailInputProps;
    const { email } = this.props;
    const baseProps = {
      type: "email",
      validation: isSignup ? this.validation : null,
      label: "Email Address",
      placeholder: placeholder,
      onChange: this.onChange,
      value: email
    };

    return <AccountFormGroupBase baseProps={baseProps} />;
  }
}

const mapStateToProps = state => {
    return {
        email: state.email
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onChange: (email) => dispatch(signupEmailChanged(email))
    }
}

const EmailFormGroupContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailFormGroup)

export default EmailFormGroupContainer;
