import React from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { viewImageSources, viewImageSourcesSuccess, viewImageSourcesError, deleteImageSource, deleteImageSourceSuccess, deleteImageSourceError } from '../../actions.js';

class ImagesSourcesTable extends React.Component {
    componentDidMount() {
        this.props.getImageSources(this.props.match.params.id)
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
              <th>Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { this.props.imagesSources.get('imageSources') ? this.props.imagesSources.get('imageSources').map(o =>
                        <tr>
                          <td>{o.get('id')}</td>
                          <td>{o.get('name')}</td>
                          <td>{o.get('imageSourceType')}</td>
                          <td>55 images</td>
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
    imagesSources: state.get('currentImageSources')
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
    }
  }
}

export const ImagesSourcesTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagesSourcesTable)