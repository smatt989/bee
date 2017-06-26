import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const TasksTableItem = ({ data, match }) => {

  var manageButton = null;
  var leaveButton = null;
  if(!data.isCreator) {
    leaveButton = <Button>Leave</Button>
  } else {
    manageButton =   <LinkContainer to={`${match.url}/${data.id}/view`}>
                       <Button>Manage</Button>
                     </LinkContainer>
  }

  return (
    <tr>
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td>
        <ButtonGroup>
          {manageButton}
          <Button>Label</Button>
          {leaveButton}
        </ButtonGroup>
      </td>
    </tr>)
  ;
};

export default TasksTableItem;
