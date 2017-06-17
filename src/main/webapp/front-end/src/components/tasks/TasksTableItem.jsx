import React from 'react';
import { connect } from 'react-redux';
import { 
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const TasksTableItem = ({ data, match }) => {
  return <tr>
    <td>{data.id}</td>
    <td>{data.name}</td>
    <td>
      <ButtonGroup>
        <LinkContainer to={`${match.url}/${data.id}/view`}>
          <Button>Manage</Button>
        </LinkContainer>
        <Button>Label</Button>
        <Button>Leave</Button>
      </ButtonGroup>
    </td>
  </tr>
}

export default TasksTableItem;