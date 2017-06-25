import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid, 
  PageHeader,
  Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {TasksCreatedTableContainer, TasksParticipatingTableContainer} from './TasksTable.jsx';

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
    <TasksCreatedTableContainer {...props} />
    <TasksParticipatingTableContainer {...props} />
  </Grid>;
}

export default Tasks;