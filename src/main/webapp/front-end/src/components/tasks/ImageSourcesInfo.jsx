import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { viewImageSources, viewImageSourcesSuccess, viewImageSourcesError, viewImageSourcesDetails, viewImageSourcesDetailsSuccess, viewImageSourcesDetailsError } from '../../actions.js';
import ImageSourcesCount from './ImageSourcesCount.jsx';
import ImageSourcesImageCount from './ImageSourcesImageCount.jsx';

class ImageSourcesInfo extends React.Component {
  componentDidMount() {
    this.props.getImageSources(this.props.match.params.id);
    this.props.getImageSourcesDetails(this.props.match.params.id);
  }

  render() {
    return <div>
      <ImageSourcesCount data={this.props.currentImageSources} {...this.props} />
      <ImageSourcesImageCount data={this.props.currentImageSourcesDetails} {...this.props} />
      <LinkContainer to={'/tasks/'+this.props.match.params.id+'/image-sources'}>
          <Button className="new-tbl-item-btn" bsStyle="primary" type="button">Edit</Button>
      </LinkContainer>
    </div>
  }
}

const mapStateToProps = state => {
  return {
    currentImageSources: state.get('currentImageSources'),
    currentImageSourcesDetails: state.get('currentImageSourcesDetails')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getImageSources: (taskId) => {
        return dispatch(viewImageSources(taskId))
            .then(response => {
                if (response.error) {
                    dispatch(viewImageSourcesError(response.error));
                    return false;
                }

                dispatch(viewImageSourcesSuccess(response.payload.data));
                return true;
            })
    },
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

const ImageSourcesInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageSourcesInfo);

export default ImageSourcesInfoContainer;
