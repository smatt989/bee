import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import RemoveLabelButton from './RemoveLabelButton.jsx';
import LabelValueInput from './LabelValueInput.jsx';

const RectangleLabel = ({ rect, remove }) => {

  var divStyle = {
    display: "none"
  }

  var removeButtonStyle = {
    display: "none"
  }

  if(rect != null && rect != {} && !(rect.h == 0 && rect.w == 0)){
    var left = rect.w > 0 ? rect.startX : rect.startX + rect.w
    var top = rect.h > 0 ? rect.startY : rect.startY + rect.h
    var height = Math.abs(rect.h)
    var width = Math.abs(rect.w)
    divStyle = {
        color: 'white',
        backgroundColor: 'clear',
        position: 'absolute',
        border: '5px solid green',
        pointerEvents: "none",
        left: left,
        top: top,
        height: height,
        width: width
    }
  }

  return (<div style={divStyle}>
    <RemoveLabelButton remove={remove}/>
    <LabelValueInput rect={rect} />
  </div>)
};

export default RectangleLabel;
