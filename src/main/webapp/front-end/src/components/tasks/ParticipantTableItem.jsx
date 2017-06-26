import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const ParticipantTableItem = ({ data, match }) => {
  return (
    <tr>
      <td>{data.id}</td>
      <td>{data.email}</td>
      <td>
        <ButtonGroup>
          <Button>Deactivate</Button>
        </ButtonGroup>
      </td>
    </tr>)
  ;
};

export default ParticipantTableItem;
