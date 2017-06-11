import React from 'react';
import { connect } from 'react-redux'
import AccountFormGroupBase from './AccountFormGroupBase.jsx'

class EmailFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = (e) => this.props.onChange(e.target.value, this.props.emailInputProps.action);
  }

  render() {
    const { value, validation, placeholder } = this.props.emailInputProps;
    const baseProps = {
      type: "email",
      validation: validation,
      label: "Email Address",
      placeholder: placeholder,
      onChange: this.onChange,
      value: value
    };

    return <AccountFormGroupBase baseProps={baseProps} />;
  }
}

const mapStateToProps = state => { return {} }
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (email, action) => dispatch(action(email))
  }
}

const EmailFormGroupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailFormGroup)

export default EmailFormGroupContainer;
