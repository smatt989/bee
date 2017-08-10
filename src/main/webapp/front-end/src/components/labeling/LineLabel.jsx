import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import RemoveLabelButton from './RemoveLabelButton.jsx';
import LabelValueInput from './LabelValueInput.jsx';
import { ONTOLOGY_TYPE_BINARY, ONTOLOGY_TYPE_FLOAT_RANGE, ONTOLOGY_TYPE_INTEGER_RANGE } from './../../utilities.js';

const LineLabel = ({ rect, remove, ontologyType, update, min, max, handleFocus, handleBlur, autofocusState }) => {

 var divStyle = {
   display: "none"
 }

 const className = "line-label"

 if(rect.point1x != null && !(rect.point1x == rect.point2x && rect.point1y == rect.point2y)){
   const left = rect.point1x < rect.point2x ? rect.point1x : rect.point2x
   const top = rect.point1y < rect.point2y ? rect.point1y : rect.point2y
   const height = Math.abs(rect.point1x - rect.point2x)
   const width = Math.abs(rect.point1y - rect.point2y)


   const lengthOfDiagonal = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));

   var degrees

   const asin = Math.asin(width / lengthOfDiagonal)

    //down to the right
   if(rect.point1x < rect.point2x && rect.point1y <= rect.point2y){
       degrees = asin * 180 / Math.PI
    //up to the left
   } else if(rect.point1x >= rect.point2x && rect.point1y > rect.point2y){
        degrees = (asin * 180 / Math.PI) + 180
    //up to the right
   } else if(rect.point1x < rect.point2x && rect.point1y > rect.point2y) {
       degrees = (asin * 180 / Math.PI) * -1
       //down to the left
   } else {
        degrees = (asin * 180 / Math.PI) * -1 + 180
   }

   divStyle = {
       marginLeft: rect.point1x,
       marginTop: rect.point1y,
       width: lengthOfDiagonal,
       transform: "rotate("+degrees+"deg)",
       transformOrigin: "0% 0%"
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

export default LineLabel;
