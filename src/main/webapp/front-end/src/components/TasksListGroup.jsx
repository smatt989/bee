import React from 'react';
import { 
  ListGroup, 
  ListGroupItem,
  Button,
  ButtonGroup
} from 'react-bootstrap';

const TaskListGroupItem = (props) => {
  return <ListGroupItem className="clearfix">
      <span className="lgi-name">{props.name}</span>
      <ButtonGroup className="pull-right">
        <Button>Left</Button>
        <Button>Middle</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </ListGroupItem>
}

export default class TaskListGroup extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = () => console.log("clicked");
  }

  render() {
    return <ListGroup>
      <TaskListGroupItem name="Task 1" />
      <TaskListGroupItem name="Task 2" />
    </ListGroup>
  }
}