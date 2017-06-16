import React from 'react';
import { connect } from 'react-redux';
import { 
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class TasksTableItem extends React.Component {
  render() {
    const { data } = this.props;
    return <tr>
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td>
        <ButtonGroup>
          <Button>Left</Button>
          <Button>Middle</Button>
          <LinkContainer to={'/tasks/' + data.id + '/view'}>
            <Button>View</Button>
          </LinkContainer>
        </ButtonGroup>
      </td>
    </tr>
  }
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