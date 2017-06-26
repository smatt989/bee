import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  PageHeader
} from 'react-bootstrap';
import { viewImageSources, viewImageSourcesSuccess, viewImageSourcesError, viewImageSourcesDetails, viewImageSourcesDetailsSuccess, viewImageSourcesDetailsError } from '../../actions.js';
import ImageSourcesCount from './ImageSourcesCount.jsx';
import ImageSourcesImageCount from './ImageSourcesImageCount.jsx';

class ImageSourcesInfo extends React.Component {
  componentDidMount() {
    this.props.getImageSources(this.props.match.params.id);
    this.props.getImageSourcesDetails(this.props.match.params.id);
  }

/*  buildContent() {
    const { currentImageSources, currentImageSourcesDetails } = this.props;
    if (currentImageSources.get('error') || currentImageSourcesDetails.get('error')) {
      return <div>Error</div>
    } else if (currentImageSources.get('loading') || currentImageSourcesDetails.get('loading')) {
      return <div>Loading</div>
    }

    return
        <div>
            <ImageSourcesCount data={this.props.currentImageSources} {...this.props} />
            <ImageSourcesImageCount data={this.props.currentImageSourcesDetails} {...this.props} />
        </div>
  }*/

  render() {
    return <div>
                <ImageSourcesCount data={this.props.currentImageSources} {...this.props} />
                <ImageSourcesImageCount data={this.props.currentImageSourcesDetails} {...this.props} />
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
