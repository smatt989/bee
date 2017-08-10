import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { Map, List} from 'immutable';
import { viewImageSourcesDetails, viewImageSourcesDetailsSuccess, viewImageSourcesDetailsError } from '../../actions.js';
import {sum} from '../../utilities.js'

class TaskNumbers extends React.Component {
  componentDidMount() {
    this.props.getImageSourcesDetails(this.props.match.params.id);
  }

  imageSourceInfo(detail) {
    return sum(this.props.currentImageSourcesDetails.get('details').map(a => a.get(detail)))
  }

  render() {
    return <div>
        <h2><b>{(this.imageSourceInfo('labeled') / this.imageSourceInfo('imageCount') * 100).toFixed(0)}%</b> labeled</h2>
        <p><b>{(this.imageSourceInfo('seen') / this.imageSourceInfo('imageCount') * 100).toFixed(0)}%</b> seen</p>
    </div>
  }
}

const mapStateToProps = state => {
  return {
    currentImageSourcesDetails: state.get('currentImageSourcesDetails')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getImageSourcesDetails: (taskId) => {
        return dispatch(viewImageSourcesDetails(taskId))
            .then(response => {
                if(response.error) {
                    dispatch(viewImageSourcesDetailsError(response.error));
                    return false;
                }

                dispatch(viewImageSourcesDetailsSuccess(response.payload.data));
                return true;
            })
    }
  };
};

const TaskNumbersContainers = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskNumbers);

export default TaskNumbersContainers;
