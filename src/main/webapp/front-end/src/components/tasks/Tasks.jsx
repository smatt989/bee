import React from 'react';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {TasksCreatedTableContainer, TasksParticipatingTableContainer} from './TasksTable.jsx';
import text from '../../constants/text';

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
    <TasksCreatedTableContainer
      {...props}
      tableHeader={text.tasks_table_header_created} />
    <TasksParticipatingTableContainer {...props}
      tableHeader={text.tasks_table_header_participating} />
  </Grid>;
};

export default Tasks;
