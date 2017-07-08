import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';

const LineLabel = ({ rect, remove }) => {

  var newLineStyle = {
    display: "none"
  }

  var x1 = 0
  var x2 = 0
  var y1 = 0
  var y2 = 0

  if(rect.point1x != null && !(rect.point1x == rect.point2x && rect.point1y == rect.point2y)){
      x1 = rect.point1x
      x2 = rect.point2x
      y1 = rect.point1y
      y2 = rect.point2y

      newLineStyle = {
          display: 'block'
      }
  }

  return (<line onClick={remove} style={newLineStyle} x1={x1} y1={y1} x2={x2} y2={y2}
                strokeWidth="5" stroke="green"/>)
};

export default LineLabel;
