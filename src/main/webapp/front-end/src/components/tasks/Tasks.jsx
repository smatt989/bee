import React from 'react';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import TasksTableContainer from './TasksTable.jsx';

const Tasks = (props) => {
  return <Grid>
    <PageHeader>
      Tasks
      <LinkContainer className="pull-right" to={`${props.match.url}/new`}>
        <Button
          className="new-tbl-item-btn"
          bsStyle="primary"
          type="button">
          New Task
        </Button>
      </LinkContainer>
    </PageHeader>
    <TasksTableContainer {...props} />
  </Grid>;
};

export default Tasks;
