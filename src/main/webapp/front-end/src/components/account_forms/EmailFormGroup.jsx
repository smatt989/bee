import React from 'react';
import AccountFormGroupBase from './AccountFormGroupBase.jsx'

export default class EmailFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.regexp = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$/);
    this.getValidationState = (state) => {
      if (state.focused || !state.hasFocused) {
        return null;
      }

      if (state.value.length > 0 && this.regexp.exec(state.value)) {
        return 'success';
      }

      return 'error';
    }
  }

  render() {
    const baseProps = {
      type: "email",
      getValidationState: this.getValidationState,
      label: "Email Address",
      placeholder: "Enter your email"
    };

    return <AccountFormGroupBase baseProps={baseProps} />;
  }
}
