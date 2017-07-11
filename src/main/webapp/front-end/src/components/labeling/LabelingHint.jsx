import React from 'react';
import { ONTOLOGY_TYPE_BINARY, ONTOLOGY_TYPE_FLOAT_RANGE, ONTOLOGY_TYPE_INTEGER_RANGE } from './../../utilities.js';

const LabelingHint = ({ currentOntology }) => {

  var actionHint = ""
  var valueHint = ""
  var limitHint = ""

  const labelLimit = currentOntology.getIn(['ontology', 'labelLimit'], 1);
  const ontologyType = currentOntology.getIn(['ontology', 'ontologyType'], ONTOLOGY_TYPE_BINARY);
  const isAreaLabel = currentOntology.getIn(['ontology', 'isAreaLabel'], false);
  const isLengthLabel = currentOntology.getIn(['ontology', 'isLengthLabel'], false);
  const minValue = currentOntology.getIn(['ontology', 'minValue'], null);
  const maxValue = currentOntology.getIn(['ontology', 'maxValue'], null);

  if(isAreaLabel) {
    actionHint = "Click and drag on the image to annotate an area."
  } else if(isLengthLabel) {
    actionHint = "Click and drag on the image to annotate a length."
  } else {
    actionHint = "Click on the image to toggle a positive annotation."
  }

  if(ontologyType == ONTOLOGY_TYPE_FLOAT_RANGE) {
    valueHint = "Then add a floating point value in the range: " + minValue + " - " + maxValue + "."
  } else if(ontologyType == ONTOLOGY_TYPE_INTEGER_RANGE) {
    valueHint = "Then add an integer value in the range: " + minValue + " - " + maxValue + "."
  }

  if(isLengthLabel || isAreaLabel){
      if(labelLimit == 1) {
        limitHint = "You may only add one annotation to this image."
      } else {
        limitHint = "You may add unlimited annotations to this image."
      }
  }

  return (<div>
    <p>{actionHint} {valueHint} {limitHint}</p>
  </div>);
};

export default LabelingHint;
