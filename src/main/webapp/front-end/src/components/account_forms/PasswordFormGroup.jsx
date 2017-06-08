import React from 'react';
import AccountFormGroupBase from './AccountFormGroupBase.jsx'

export default class PasswordFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.getValidationState = (state) => {
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
    const baseProps = {
      type: "password",
      getValidationState: this.getValidationState,
      label: "Password",
      placeholder: "Choose a password"
    }

    return <AccountFormGroupBase baseProps={baseProps} />
  }
}
