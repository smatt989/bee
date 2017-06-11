import React from 'react';
import { 
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';

const TaskTableItem = (props) => {
  return <tr>
    <td>{props.id}</td>
    <td>{props.name}</td>
    <td>
      <ButtonGroup>
        <Button>Left</Button>
        <Button>Middle</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </td>
  </tr>
}

export default class TaskTable extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = () => console.log("clicked");
  }

  render() {
    return <Table id="task-tbl" responsive striped hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <TaskTableItem id="1" name="Task 1" />
        <TaskTableItem id="2" name="Task 2" />
      </tbody>
    </Table>
  }
}