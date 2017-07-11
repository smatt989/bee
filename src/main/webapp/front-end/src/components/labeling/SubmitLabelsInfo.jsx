import React from 'react';
import { ONTOLOGY_TYPE_BINARY, ONTOLOGY_TYPE_FLOAT_RANGE, ONTOLOGY_TYPE_INTEGER_RANGE, isNullLabel } from './../../utilities.js';

const SubmitLabelsInfo = ({ currentOntology, labels, hasSavedLabels, viewInfo }) => {

  const ontologyType = currentOntology.getIn(['ontology', 'ontologyType'], ONTOLOGY_TYPE_BINARY);
  const isAreaLabel = currentOntology.getIn(['ontology', 'isAreaLabel'], false);
  const isLengthLabel = currentOntology.getIn(['ontology', 'isLengthLabel'], false);

  var labelText = ""

  if(labels.size == 0 || (labels.size == 1 && isNullLabel(labels.toJS()[0]))){
    if(!isAreaLabel && !isLengthLabel) {
        labelText = "Submit \"Negative\" label"
    } else {
        labelText = "Submit no label"
    }
    if(labels.size == 0 && viewInfo && !hasSavedLabels){
        labelText += " (previously skipped)"
    }
  } else {
    var labelCardinality = "label"
    if(labels.size > 1){
        labelCardinality = "labels"
    }

    if(isAreaLabel){
        labelText = "Submit "+labels.size+" "+labelCardinality
    } else if(isLengthLabel) {
        labelText = "Submit "+labels.size+" "+labelCardinality
    } else {
        labelText = "Submit \"Positive\" label"
    }
  }

  return <span>{labelText}</span>;
};

export default SubmitLabelsInfo;
