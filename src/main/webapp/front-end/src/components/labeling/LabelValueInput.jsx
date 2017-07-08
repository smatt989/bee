import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const LabelValueInput = ({ rect }) => {

  const inputStyle = {
    pointerEvents: "auto",
    color: 'black',
    position: 'absolute',
    top: rect ? Math.abs(rect.h) : 0
  }

  return (<input type="text" onClick={function(e){e.target.focus()}} style={inputStyle} onChange={function(e){console.log(e.target.value)}} placeholder="Label value" />
)
};

export default LabelValueInput;
