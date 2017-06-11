import React from 'react'
import { connect } from 'react-redux'
import { signupPasswordChanged } from '../../actions.js'
import AccountFormGroupBase from './AccountFormGroupBase.jsx'

class PasswordFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.validation = (state) => {
      if (state.focused || !state.hasFocused) {
        return null;
      }

      if (this.props.password.length > 6) {
        return 'success';
      }

      return 'error';
    }

    this.onChange = (e) => this.props.onChange(e.target.value);
  }

  render() {
    const { isSignup, placeholder } = this.props.pwInputProps;
    const { password } = this.props;
    const baseProps = {
      type: "password",
      validation: isSignup ? this.validation : null,
      label: "Password",
      placeholder: placeholder,
      onChange: this.onChange,
      value: password
    }

    return <AccountFormGroupBase baseProps={baseProps} />
  }
}

const mapStateToProps = state => {
    return {
        password: state.password
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onChange: (password) => dispatch(signupPasswordChanged(password))
    }
}

const PasswordFormGroupContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PasswordFormGroup)

export default PasswordFormGroupContainer;