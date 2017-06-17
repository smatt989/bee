import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid, 
  PageHeader,
  Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import TasksTableContainer from './TasksTable.jsx';

export default class Tasks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { match } = this.props;
    return <Grid>
      <PageHeader>
        Tasks
        <LinkContainer className="pull-right" to={`${match.url}tasks/new`}>
          <Button
            className="new-tbl-item-btn"
            bsStyle="primary"
            type="button">
            New Task
          </Button>
        </LinkContainer>
      </PageHeader>
      <TasksTableContainer {...this.props} />
    </Grid>;
  }
}