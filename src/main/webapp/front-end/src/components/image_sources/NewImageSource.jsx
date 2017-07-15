import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Map, List } from 'immutable';
import {
  Grid,
  PageHeader,
  Button,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import { saveImageSource, saveImageSourceSuccess, saveImageSourceError, viewImageSource, viewImageSourceSuccess, viewImageSourceError } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';

class NewImageSource extends React.Component {

  componentDidMount() {
    if(this.imageSourceId()){
        this.props.getImageSource(this.imageSourceId(), () => {this.state = this.imageSourceObjectToState(); this.forceUpdate()})
    }
  }

  taskId() {
    return Number(this.props.match.params.id);
  }

  imageSourceId() {
    return this.props.match.params.isid ? Number(this.props.match.params.isid) : null;
  }

  imageSourceObjectToState(){

    var details = this.props.currentImageSource.getIn(['imageSource', 'details'], Map({}))

    var obj =  {
        name: details.get('name', ''),
        type: details.get('imageSourceType', ''),
        typeFields: details.get('imageSourceType') ? this.fieldsByType(details.get('imageSourceType')) : [],
        redirectToReferrer: false
    }

    obj.typeFields.map(f => {
        obj[f] = this.props.currentImageSource.getIn(['imageSource', 'configs', f.toLowerCase()])
    })

    return obj
  }

  constructor(props) {
    super(props);
    this.state = this.imageSourceObjectToState();

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
      const imageSource = Map({name: this.state.name, taskId: taskId, imageSourceType: this.state.type, id: this.imageSourceId()})
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

    var redirectTo = "/tasks/"+this.taskId()+"/participant-link/new"
    var cancelText = "Skip for now"

    if(this.props.editingTask){
        redirectTo = "/tasks/"+this.taskId()+"/image-sources"
        cancelText = "Cancel"
    }

    const { from } = this.props.location.state || { from: { pathname: '/tasks' } };
    if (this.state.redirectToReferrer) {
      return <Redirect to={redirectTo} />;
    }

    const nameFormProps = {
      type: 'name',
      label: 'Name:',
      placeholder: 'Image Source Name',
      onChange: this.onNameChange,
      value: this.state.name
    };

    const imageSourceTypes = this.props.imageSourceTypes.get('types', null);

    return <div className="center-form center box-border">
                           <h1>Add Image Source</h1>
      <form role="form" onSubmit={this.onSubmit}>
        <FormGroupBase baseProps={nameFormProps}/>

        <FormGroup>
          <ControlLabel>Label Type</ControlLabel>
          <FormControl value={this.state.type} onChange={this.onTypeChange} componentClass="select" placeholder="select">
            <option key="yo" value="ek">select...</option>
            { imageSourceTypes ? imageSourceTypes.map(o =>
                      <option key={o.get('name')} value={o.get('name')}>{o.get('name')}</option>)
                      : null }
          </FormControl>
        </FormGroup>

        {this.state.typeFields.map(f =>
            <FormGroup>
                <ControlLabel>{f}</ControlLabel>
                <FormControl value={this.state[f] ? this.state[f] : ''} onChange={ this.changeState(f) } placeholder={f} />
            </FormGroup>
        )}
        <div className="form-submit-box">
            <Button
              bsStyle="primary"
              type="submit">
              Save Image Source
            </Button>
            <p><Link to={{ pathname: redirectTo }}>{cancelText}</Link></p>
        </div>
      </form>
    </div>;
  }
}

const mapStateToProps = state => {
  return {
    imageSourceTypes: state.get('imageSourceTypes'),
    currentImageSource: state.get('currentImageSource'),
    editingTask: state.get('editingTask')
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
    },
    getImageSource: (imageSourceId, callback) => {

        return dispatch(viewImageSource(imageSourceId))
            .then(response => {
                if(response.error) {
                    dispatch(viewImageSourceError(response.error));
                    return false
                }

                dispatch(viewImageSourceSuccess(response.payload.data, response.payload.headers));
                callback()
                return true
            })
    }
  };
};

const NewImageSourceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewImageSource);

export default NewImageSourceContainer;
