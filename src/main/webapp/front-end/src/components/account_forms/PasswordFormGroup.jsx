import React from 'react'
import { connect } from 'react-redux'
import AccountFormGroupBase from './AccountFormGroupBase.jsx'

class PasswordFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = (e) => this.props.onChange(e.target.value, this.props.pwInputProps.action);
  }

  render() {
    const { value, validation, placeholder } = this.props.pwInputProps;
    const baseProps = {
      type: "password",
      validation: validation,
      label: "Password",
      placeholder: placeholder,
      onChange: this.onChange,
      value: value
    }

    return <AccountFormGroupBase baseProps={baseProps} />
  }
}

const mapStateToProps = state => { return {} }
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (password, action) => dispatch(action(password))
  }
}

const PasswordFormGroupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordFormGroup)

export default PasswordFormGroupContainer;