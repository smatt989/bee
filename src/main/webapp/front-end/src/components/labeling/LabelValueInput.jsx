import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const LabelValueInput = ({ top, left, update, label }) => {

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

  return (<input type="text" onClick={function(e){e.target.focus()}} style={inputStyle} defaultValue={currentLabelValue} onChange={updateFunction} placeholder="Label value" />
)
};

export default LabelValueInput;
