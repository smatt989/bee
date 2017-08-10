import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import RemoveLabelButton from './RemoveLabelButton.jsx';
import LabelValueInput from './LabelValueInput.jsx';
import { ONTOLOGY_TYPE_BINARY, ONTOLOGY_TYPE_FLOAT_RANGE, ONTOLOGY_TYPE_INTEGER_RANGE } from './../../utilities.js';

const RectangleLabel = ({ rect, remove, ontologyType, update, min, max, handleFocus, handleBlur, autofocusState }) => {

  var divStyle = {
    display: "none"
  }

  const className = "rectangle-label"

  if(rect.xCoordinate != null && !(rect.height == 0 && rect.width == 0)){
    var left = rect.xCoordinate
    var top = rect.yCoordinate
    var height = rect.height
    var width = rect.width
    divStyle = {
        marginLeft: left,
        marginTop: top,
        height: height,
        width: width
    }
  }

  var labelValueInput = null

  if(ontologyType == ONTOLOGY_TYPE_FLOAT_RANGE || ontologyType == ONTOLOGY_TYPE_INTEGER_RANGE){
    labelValueInput = <LabelValueInput top={rect.height} left={5} label={rect} update={update} min={min} max={max} handleFocus={handleFocus} handleBlur={handleBlur} autofocusState={autofocusState} />
  }

  return (<div style={divStyle} className={className}>
    <RemoveLabelButton remove={remove}/>
    {labelValueInput}
  </div>)
};

export default RectangleLabel;
