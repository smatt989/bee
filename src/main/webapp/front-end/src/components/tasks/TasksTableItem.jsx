import React from 'react';
import { connect } from 'react-redux';
import { 
  Button,
  ButtonGroup
} from 'react-bootstrap';

const TasksTableItem = (props) => {
  const { data } = props;
  return <tr>
    <td>{data.id}</td>
    <td>{data.name}</td>
    <td>
      <ButtonGroup>
        <Button>Left</Button>
        <Button>Middle</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </td>
  </tr>
}

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

const TasksTableItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksTableItem)

export default TasksTableItemContainer;