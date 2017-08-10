import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { viewImageSources, viewImageSourcesSuccess, viewImageSourcesError, deleteImageSource, deleteImageSourceSuccess, deleteImageSourceError, viewImageSourcesDetails, viewImageSourcesDetailsSuccess, viewImageSourcesDetailsError } from '../../actions.js';


class ImagesSourcesTable extends React.Component {

  constructor(props) {
    super(props);

    this.imageSourceInfo = this.imageSourceInfo.bind(this);

  }

  imageSourceInfo(imageSourceId, detail) {
    const imageSourceDetail = this.props.currentImageSourcesDetails.get('details').find(function(a){ return a.get('imageSourceId') == imageSourceId}, null, Map({}))

    return imageSourceDetail.get(detail, 0)
  }

    componentDidMount() {
        this.props.getImageSources(this.props.match.params.id)
        this.props.getImageSourcesDetails(this.props.match.params.id)
    }

    render() {

      const deleteImageSource = this.props.deleteImageSource

      return (
        <Table id="imgsrc-tbl" responsive striped hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Type</th>
              <th>Images</th>
              <th>% Seen</th>
              <th>% Labeled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { this.props.imagesSources.get('imageSources') ? this.props.imagesSources.get('imageSources').map(o =>
                        <tr>
                          <td>{o.get('id')}</td>
                          <td>{o.get('name')}</td>
                          <td>{o.get('imageSourceType')}</td>
                          <td>{this.imageSourceInfo(o.get('id'), 'imageCount')}</td>
                          <td>{(this.imageSourceInfo(o.get('id'), 'seen') / this.imageSourceInfo(o.get('id'), 'imageCount') * 100).toFixed(1)}%</td>
                          <td>{(this.imageSourceInfo(o.get('id'), 'labeled') / this.imageSourceInfo(o.get('id'), 'imageCount') * 100).toFixed(1)}%</td>
                          <td>        <ButtonGroup>
                                        <Button onClick={() => deleteImageSource(o.get('id'))}>Remove</Button>
                                        <LinkContainer to={'/tasks/'+o.get('taskId')+'/image-sources/'+o.get('id')}>
                                            <Button className="new-tbl-item-btn" bsStyle="primary" type="button">Edit</Button>
                                        </LinkContainer>
                                      </ButtonGroup></td>
                        </tr>)
                        : null }

          </tbody>
        </Table>
      ) }
};

const mapStateToProps = state => {
  return {
    imagesSources: state.get('currentImageSources'),
    currentImageSourcesDetails: state.get('currentImageSourcesDetails')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getImageSources: (taskId) => {
        return dispatch(viewImageSources(taskId))
            .then(response => {
                if(response.error) {
                    dispatch(viewImageSourcesError(response.error));
                    return false;
                }

                dispatch(viewImageSourcesSuccess(response.payload.data));
                return true;
            })
    },
    deleteImageSource: (imageSourceId) => {
        return dispatch(deleteImageSource(imageSourceId))
            .then(response => {
                if(response.error) {
                    dispatch(deleteImageSourceError(response.error));
                    return false;
                }

                dispatch(deleteImageSourceSuccess(imageSourceId));
                return true
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
  }
}

export const ImagesSourcesTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagesSourcesTable)