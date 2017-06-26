import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const ParticipantTableItem = ({ data, match, activate, deactivate }) => {
  var deactivateButton = null
  var activateButton = null

  if(data.isActive){
    deactivateButton = <Button onClick={() => deactivate(data.participantId)}>Deactivate</Button>
  } else {
    activateButton = <Button onClick={() => activate(data.participantId)}>Activate</Button>
  }

  return (
    <tr>
      <td>{1}</td>
      <td>{data.email}</td>
      <td>
        <ButtonGroup>
          {activateButton}
          {deactivateButton}
        </ButtonGroup>
      </td>
    </tr>)
  ;
};

export default ParticipantTableItem;
