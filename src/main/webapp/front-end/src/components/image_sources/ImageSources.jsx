import React from 'react';
import { Grid, PageHeader, Button, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const ImagesTable = () => {
  return <Table id="imgsrc-tbl" responsive striped hover>
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
        <tr>
          <td>1</td>
          <td>Some Great Photos</td>
          <td>S3 Bucket</td>
          <td>23000 images</td>
          <td><Button>Remove</Button></td>
        </tr>
      </tbody>
    </Table>;
}

export default class ImageSources extends React.Component {
  render() {
    return <Grid>
      <PageHeader>
        Image Sources
        <LinkContainer className="pull-right" to={`${this.props.match.url}/new`}>
          <Button
            className="new-tbl-item-btn"
            bsStyle="primary"
            type="button">
            Add Image Source
          </Button>
        </LinkContainer>
      </PageHeader>
      <ImagesTable />
    </Grid>;
  }
}