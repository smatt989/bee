import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { isNumeric, valueInRange, couldBeNumeric, isANumber, writingDecimal } from './../../utilities.js';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap';

class LabelValueInput extends React.Component {

    constructor(props) {
      super(props);

      this.defaultSize = "150px"

      this.handleFocus = this.handleFocus.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
    }

    handleFocus(e) {
        this.props.handleFocus()
        e.currentTarget.style.width = this.defaultSize
    }

    handleBlur(e) {
        this.props.handleBlur()
        if(e.currentTarget.value.length > 0){
            e.currentTarget.style.width = ((e.currentTarget.value.length + 1) * 9 + 20) + 'px';
        } else {
            e.currentTarget.style.width = this.defaultSize
        }
    }

    handleEnterPress(e) {
        if(e.key == "Enter") {
            e.currentTarget.blur()
        }
    }

    render(){

      const top = this.props.top
      const left = this.props.left
      const update = this.props.update
      const label = this.props.label

      const min = this.props.min
      const max = this.props.max

      const inputStyle = {
        pointerEvents: "auto",
        color: 'black',
        position: 'absolute',
        top: top,
        left: left
      }

      const updateFunction = (e) => {
        //const value = couldBeNumeric(e.target.value) ? e.targetValue : isANumber(e.target.value) ? Number(e.target.value) : ''
        const value = couldBeNumeric(e.target.value) ? isANumber(e.target.value) ? Number(e.target.value) : e.target.value : null
        update(label.uuid, value)
      }

      const currentLabelValue = label ? couldBeNumeric(label.labelValue) ? String(label.labelValue) : '' : ''




      function getValidationState() {
        if(valueInRange(currentLabelValue, min, max)){
            return 'success';
        } else if (currentLabelValue == ''){
            return 'warning'
        }
        return 'error'
      }

      return <FormGroup
                controlId="formBasicText"
                validationState={getValidationState()}
                style={inputStyle} >
              <FormControl type="text"
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onClick={function(e){e.target.focus(); e.preventDefault()}}
                value={currentLabelValue}
                onChange={updateFunction}
                onKeyUp={this.handleEnterPress}
                placeholder="Label value" autoFocus={this.props.autofocusState} />

              </FormGroup>
      }
}

export default LabelValueInput;
