import React from 'react';
import {
  Button,
  ButtonGroup,
  Glyphicon
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const RemoveLabelButton = ({ remove }) => {

  return (<div className="remove-label-button" onClick={remove}><Glyphicon glyph="remove" /></div>)
};

export default RemoveLabelButton;
