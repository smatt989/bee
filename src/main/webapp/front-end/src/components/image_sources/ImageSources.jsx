import React from 'react';
import { Grid, PageHeader, Button, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {ImagesSourcesTableContainer} from './ImageSourcesTable.jsx';

export default class ImageSources extends React.Component {

  render() {
    const taskId = this.props.match.params.id
    return <Grid>
        <LinkContainer to={'/tasks/'+taskId+'/view'}>
          <Button
            className="new-tbl-item-btn"
            bsStyle="primary"
            type="button">
            Back to Task
          </Button>
        </LinkContainer>
      <PageHeader>
        Image Sources
        <LinkContainer className="pull-right" to={'/tasks/'+taskId+'/image-sources/new'}>
          <Button
            className="new-tbl-item-btn"
            bsStyle="primary"
            type="button">
            Add Image Source
          </Button>
        </LinkContainer>
      </PageHeader>
      <ImagesSourcesTableContainer {...this.props} />
    </Grid>;
  }
}