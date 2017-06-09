import React from 'react';
import { Grid, ListGroup, ListGroupItem } from 'react-bootstrap';

class TaskListGroup extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = () => console.log("clicked");
  }

  render() {
    return <ListGroup>
      <ListGroupItem onClick={this.onClick}>
        Task 1
      </ListGroupItem>
      <ListGroupItem onClick={this.onClick}>
        Task 2
      </ListGroupItem>
    </ListGroup>
  }
}

export default class Tasks extends React.Component {
  render() {
    return <Grid>
      <h1>Tasks</h1>
      <TaskListGroup />
    </Grid>;
  }
}