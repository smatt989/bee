import React from 'react';
import { 
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap';

export default class AccountFormGroupBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      focused: false,
      hasFocused: false
    }

    this.onChange = (e) => this.setState({ value: e.target.value });
    this.onFocus = () => this.setState({ focused: true });
    this.onBlur = () => this.setState({ focused: false, hasFocused: true });
  }

  render() {
    const { type, label, validation, placeholder } = this.props.baseProps;
    const getValidationState = validation != null ? validation : () => { return null };
    return <FormGroup controlId={type} validationState={getValidationState(this.state)}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl 
        type={type}
        value={this.state.value}
        placeholder={placeholder}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur} />
      <FormControl.Feedback />
    </FormGroup>
  }
}
