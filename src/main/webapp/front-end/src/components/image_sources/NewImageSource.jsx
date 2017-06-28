import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Map, List } from 'immutable';
import {
  Grid,
  PageHeader,
  Button,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import { saveImageSource, saveImageSourceSuccess, saveImageSourceError } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';

class NewImageSource extends React.Component {

  taskId() {
    return Number(this.props.match.params.id);
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      type: null,
      typeFields: [],
      redirectToReferrer: false
    };

    this.onNameChange = (e) => this.setState({ name: e.target.value });
    this.onTypeChange = (e) => this.setState({ type: e.target.value, typeFields:  this.fieldsByType(e.target.value)});

    this.changeState = (field) => (e) => {
        var obj = {}
        obj[field] = e.target.value
        this.setState(obj)
    }

    this.onSubmit = (e) => {
      e.preventDefault();
      const taskId = this.taskId();
      //TODO: DEAL WITH SAVING OVER OLD IMAGE SOURCE
      const imageSource = Map({name: this.state.name, taskId: taskId, imageSourceType: this.state.type})
      var configs = {}
      this.state.typeFields.map(f =>
        configs[f] = this.state[f]
      )
      this.props.onSubmit(imageSource, configs)
        .then(isSuccess => this.setState({ redirectToReferrer: isSuccess }));
    };
  }

  fieldsByType(type) {
    return this.props.imageSourceTypes.get('types').find(function(a){return a.get('name') == type}).get('fields').toJS()
  }

  render() {

    const { from } = this.props.location.state || { from: { pathname: '/tasks' } };
    if (this.state.redirectToReferrer) {
      return <Redirect to={"/tasks/"+this.taskId()+"/participant-link/new"} />;
    }

    const nameFormProps = {
      type: 'name',
      label: 'Name:',
      placeholder: 'Image Source Name',
      onChange: this.onNameChange,
      value: this.state.name
    };

    const imageSourceTypes = this.props.imageSourceTypes.get('types', null);

    return <Grid>
      <PageHeader>
        Add Image Source
      </PageHeader>
      <form role="form" onSubmit={this.onSubmit}>
        <FormGroupBase baseProps={nameFormProps}/>

        <FormGroup>
          <ControlLabel>Label Type</ControlLabel>
          <FormControl onChange={this.onTypeChange} componentClass="select" placeholder="select">
            <option key="yo" value="ek">select...</option>
            { imageSourceTypes ? imageSourceTypes.map(o =>
                      <option key={o.get('name')} value={o.get('name')}>{o.get('name')}</option>)
                      : null }
          </FormControl>
        </FormGroup>

        {this.state.typeFields.map(f =>
            <FormGroup>
                <ControlLabel>{f}</ControlLabel>
                <FormControl onChange={ this.changeState(f) } placeholder={f} />
            </FormGroup>
        )}

        <Button
          bsStyle="primary"
          type="submit">
          Save Image Source
        </Button>
      </form>
    </Grid>;
  }
}

const mapStateToProps = state => {
  return {
    imageSourceTypes: state.get('imageSourceTypes')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (imageSource, configs) => {
      return dispatch(saveImageSource(imageSource, configs))
        .then(response => {
          if (response.error) {
            dispatch(saveImageSourceError(response.error));
            return false;
          }

           //TODO: NEED TO GET CONFIGS OUT OF HEADERS


          dispatch(saveImageSourceSuccess(response.payload.data, response.payload.headers));
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
