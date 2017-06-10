import React from 'react';
import { 
  Grid, 
  PageHeader,
  Button,
  ListGroup, 
  ListGroupItem
} from 'react-bootstrap';

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
  constructor(props) {
    super(props);
    this.onClick = () => {
      // TODO 
    }
  }

  render() {
    return <Grid>
      <PageHeader>
        Tasks
        <Button
          id="new-task-btn"
          className="pull-right"
          bsStyle="primary"
          type="button"
          onClick={this.onClick}>
          New Task
        </Button>
      </PageHeader>
      <TaskListGroup />
    </Grid>;
  }
}