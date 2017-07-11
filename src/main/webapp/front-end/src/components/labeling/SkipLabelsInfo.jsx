import React from 'react';
import { ONTOLOGY_TYPE_BINARY, ONTOLOGY_TYPE_FLOAT_RANGE, ONTOLOGY_TYPE_INTEGER_RANGE, isNullLabel } from './../../utilities.js';

const SkipLabelsInfo = ({ labels, hasSavedLabels, viewInfo }) => {

  var labelText = "Skip"

  if(labels.size == 0 && viewInfo && hasSavedLabels) {
    labelText += " (previously labeled)"
  }

  return <span>{labelText}</span>;
};

export default SkipLabelsInfo;
