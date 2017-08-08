import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import { viewImageSources, viewImageSourcesSuccess, viewImageSourcesError, viewImageSourcesDetails, viewImageSourcesDetailsSuccess, viewImageSourcesDetailsError } from '../../actions.js';
import ImageSourcesCount from './ImageSourcesCount.jsx';
import ImageSourcesImageCount from './ImageSourcesImageCount.jsx';

class ImageSourcesInfo extends React.Component {
  componentDidMount() {
    this.props.getImageSources(this.props.match.params.id);
    this.props.getImageSourcesDetails(this.props.match.params.id);
  }

  render() {
    return <div className="inline">
      <p>
        <b>{this.props.currentImageSourcesDetails.getIn(['details', 'imageCount'])}&nbsp;</b>
         images in
         <b>&nbsp;{this.props.currentImageSources.get('imageSources').size}&nbsp;</b>
          image sources
      </p>
      <Link to={'/tasks/'+this.props.match.params.id+'/image-sources'}>Edit</Link>
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
