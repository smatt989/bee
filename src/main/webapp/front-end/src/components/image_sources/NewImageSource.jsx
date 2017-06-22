import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Grid, PageHeader, Button } from 'react-bootstrap';
import { saveImageSource, saveImageSourceError, saveImageSourceSuccess } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';

class NewImageSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      redirectToReferror: false
    };

    this.onNameChange = (e) => this.setState({ name: e.target.value });
    this.onSubmit = (e) => {
      e.preventDefault();
      this.props.onSubmit(this.state.name)
        .then(isSuccess => this.setState({ redirectToReferrer: isSuccess }));
    };
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/image-sources' } };
    if (this.state.redirectToReferrer) {
      return <Redirect to={from} />;
    }

    const nameFormProps = {
      type: 'name',
      label: 'Name:',
      placeholder: 'Image Source Name',
      onChange: this.onNameChange,
      value: this.state.name
    };

    return <Grid>
      <PageHeader>
        New Image Source
      </PageHeader>

      <form role="form" onSubmit={this.onSubmit}>
        <FormGroupBase baseProps={nameFormProps}/>
        <Button
          bsStyle="primary"
          type="submit">
          Add Image Source
        </Button>
      </form>
    </Grid>;
  }
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (name) => {
      return dispatch(saveImageSource(name))
        .then(response => {
          if (response.error) {
            dispatch(saveImageSourceError(response.error));
            return false;
          }

          dispatch(saveImageSourceSuccess(response.payload));
          return true;
        });
    }
  };
};

const NewImageSourceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewImageSource);

export default NewImageSourceContainer;
