import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import RemoveLabelButton from './RemoveLabelButton.jsx';
import LabelValueInput from './LabelValueInput.jsx';
import { ONTOLOGY_TYPE_BINARY, ONTOLOGY_TYPE_FLOAT_RANGE, ONTOLOGY_TYPE_INTEGER_RANGE } from './../../utilities.js';

const RectangleLabel = ({ rect, remove, ontologyType, update }) => {

  var divStyle = {
    display: "none"
  }

  if(rect.xCoordinate != null && !(rect.height == 0 && rect.width == 0)){
    var left = rect.xCoordinate
    var top = rect.yCoordinate
    var height = rect.height
    var width = rect.width
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

  var labelValueInput = null

  if(ontologyType == ONTOLOGY_TYPE_FLOAT_RANGE || ontologyType == ONTOLOGY_TYPE_INTEGER_RANGE){
    labelValueInput = <LabelValueInput top={rect.height} left={5} label={rect} update={update} />
  }

  return (<div style={divStyle}>
    <RemoveLabelButton remove={remove}/>
    {labelValueInput}
  </div>)
};

export default RectangleLabel;
