import React from 'react';
import AccountFormGroupBase from './AccountFormGroupBase.jsx'

export default class PasswordFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.validation = (state) => {
      if (state.focused || !state.hasFocused) {
        return null;
      }

      if (state.value.length > 6) {
        return 'success';
      }

      return 'error';
    }
  }

  render() {
    const { isSignup, placeholder } = this.props.pwInputProps;
    const baseProps = {
      type: "password",
      validation: isSignup ? this.validation : null,
      label: "Password",
      placeholder: placeholder
    }

    return <AccountFormGroupBase baseProps={baseProps} />
  }
}
