import React from 'react';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const TasksTableItem = ({ data, match, leave }) => {

  var manageButton = null;
  var leaveButton = null;
  if(!data.isCreator) {
    leaveButton = <Button onClick={() => leave(data.id)}>Leave</Button>
  } else {
    manageButton =   <LinkContainer to={`${match.url}/${data.id}/view`}>
                       <Button bsStyle="primary">Manage</Button>
                     </LinkContainer>
  }

  const labelButton = <LinkContainer to={"/tasks/"+data.id+"/labeling"}>
    <Button bsStyle="success" >Label</Button>
  </LinkContainer>

  return (
    <tr>
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td>
        <ButtonGroup>
          {manageButton}
          {labelButton}
          {leaveButton}
        </ButtonGroup>
      </td>
    </tr>)
  ;
};

export default TasksTableItem;
