import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const RemoveLabelButton = ({ remove }) => {

  const removeButtonStyle = {
      borderRadius: "50%",
      background: "grey",
      textAlign: "center",
      position: "absolute",
      display: "inline-block",
      pointerEvents: "auto",
      height: 25,
      width: 25,
      top: -12,
      left: -12
  }

  return (<div style={removeButtonStyle} onClick={remove}>X</div>)
};

export default RemoveLabelButton;
