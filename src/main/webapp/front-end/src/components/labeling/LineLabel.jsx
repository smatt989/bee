import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const LineLabel = ({ rect, remove }) => {

  var newLineStyle = {
    display: "none"
  }

  var x1 = 0
  var x2 = 0
  var y1 = 0
  var y2 = 0

  if(rect != null && rect != {} && !(rect.h == 0 && rect.w == 0)){
      x1 = rect.startX
      x2 = (rect.startX + rect.w)
      y1 = rect.startY
      y2 = (rect.startY + rect.h)

      newLineStyle = {
          display: 'block'
      }
  }

  return (<line onClick={remove} style={newLineStyle} x1={x1} y1={y1} x2={x2} y2={y2}
                strokeWidth="5" stroke="green"/>)
};

export default LineLabel;
