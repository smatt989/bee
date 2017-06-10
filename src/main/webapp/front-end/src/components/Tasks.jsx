import React from 'react';
import { 
  Grid, 
  PageHeader,
  Button,
} from 'react-bootstrap';
import TaskListGroup from './TasksListGroup.jsx';

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
          className="pull-right new-lgi-btn"
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