import React from 'react';
import { connect } from 'react-redux';
import { 
  Grid,
  PageHeader
} from 'react-bootstrap';

const ViewTask = (props) => {
  return <Grid>
    <PageHeader>
      Manage Task
    </PageHeader>
  </Grid>;
}

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

const ViewTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewTask)

export default ViewTaskContainer;