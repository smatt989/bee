import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class LabelValueInput extends React.Component {

    constructor(props) {
      super(props);

      this.defaultSize = "150px"

      this.handleFocus = this.handleFocus.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
    }

    componentDidMount(){
      this.nameInput.focus();
    }

    handleFocus(e) {
        this.nameInput.style.width = this.defaultSize
    }

    handleBlur(e) {
        if(this.nameInput.value.length > 0){
            this.nameInput.style.width = ((this.nameInput.value.length + 1) * 9) + 'px';
        } else {
            this.nameInput.style.width = this.defaultSize
        }
    }

    handleEnterPress(e) {
        console.log("inside")
        if(e.key == "Enter") {
            console.log("enter")
            e.currentTarget.blur()
        }
    }

    render(){

      const top = this.props.top
      const left = this.props.left
      const update = this.props.update
      const label = this.props.label

      const inputStyle = {
        pointerEvents: "auto",
        color: 'black',
        position: 'absolute',
        top: top,
        left: left
      }

      function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }

      const updateFunction = (e) => {
        const value = isNumeric(e.target.value) ? Number(e.target.value) : null
        update(label, value)
      }

      const currentLabelValue = label ? isNumeric(label.labelValue) ? Number(label.labelValue) : '' : ''


      return <input type="text"
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        ref={(input) => { this.nameInput = input; }}
        onClick={function(e){e.target.focus()}}
        style={inputStyle}
        value={currentLabelValue}
        onChange={updateFunction}
        onKeyUp={this.handleEnterPress}
        placeholder="Label value" />
      }
}

export default LabelValueInput;
