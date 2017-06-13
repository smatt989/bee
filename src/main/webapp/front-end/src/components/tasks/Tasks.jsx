import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid, 
  PageHeader,
  Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import TaskTable from './TasksTable.jsx';

export default class Tasks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Grid>
      <PageHeader>
        Tasks
        <LinkContainer className="pull-right" to='/tasks/new'>
          <Button
            className="new-tbl-item-btn"
            bsStyle="primary"
            type="button">
            New Task
          </Button>
        </LinkContainer>
      </PageHeader>
      <TaskTable />
    </Grid>;
  }
}