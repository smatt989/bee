import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Map, List } from 'immutable';
import {
  Grid,
  PageHeader,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  Radio
} from 'react-bootstrap';
import { viewTaskOntology, viewTaskOntologySuccess, viewTaskOntologyError, ontologyTypes, ontologyTypesSuccess, ontologyTypesError, createOntology, createOntologySuccess, createOntologyError } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';
import { ONTOLOGY_TYPE_BINARY, validMinMax } from './../../utilities.js';

class NewOntology extends React.Component {
    componentDidMount() {
        if (this.props.ontologyTypes.get('types').size == 0) {
            this.props.getOntologyTypes()
        }
        if(this.props.editingTask && !this.props.currentOntology.get("ontology") && !this.props.currentOntology.get("loading")){
            //TODO: THIS CAN'T BE THE RIGHT WAY TO DO THIS...
            this.props.getOntology(this.taskId(), () => {this.state = this.ontologyObjectToState(); this.forceUpdate()})
        }
    }

    taskId() {
        return this.props.match.params.id;
    }

    defaultOntologyType() {
        return this.props.ontologyTypes.get('types').size == 0 ? ONTOLOGY_TYPE_BINARY : this.props.ontologyTypes.getIn(['types', 0]).get('name')
    }

    targetFromFlags(isAreaLabel, isLengthLabel) {
        return isAreaLabel ? AREA : isLengthLabel ? LENGTH : WHOLE_IMAGE
    }

    stateToOntologyObject() {
        return Map({
            name: this.state.label,
            ontologyType: this.state.type,
            minValue: this.state.min == '' ? null : this.state.type == ONTOLOGY_TYPE_BINARY ? null : Number(this.state.min),
            maxValue: this.state.max == '' ? null : this.state.type == ONTOLOGY_TYPE_BINARY ? null : Number(this.state.max),
            isAreaLabel: this.state.target == "area",
            isLengthLabel: this.state.target == "length",
            labelLimit: Number(this.state.limit)
        })
    }

    ontologyObjectToState() {
        const obj = this.props.currentOntology.get('ontology') ? this.props.currentOntology.get('ontology') : Map({})

        return {
            label: obj.get('name', ''),
            type: obj.get('ontologyType', this.defaultOntologyType()),
            target: this.targetFromFlags(obj.get('isAreaLabel', false), obj.get('isLengthLabel', false)),
            min: obj.get('minValue', ''),
            max: obj.get('maxValue', ''),
            limit: obj.get('labelLimit', '1'),
            redirectToReferrer: false
        }
    }

  constructor(props) {
    super(props);

    const taskId = this.taskId();

    this.state = this.ontologyObjectToState();

    this.onLabelChange = (e) => this.setState({ label: e.target.value });

    this.onTypeChange = (e) => this.setState({type: e.target.value});

    this.onTargetChange = (e) => this.setState({target: e.target.value});

    this.onMinChange = (e) => {
        console.log(e.target.value)
        this.setState({min: e.target.value });
    }

    this.onMaxChange = (e) => this.setState({max: e.target.value});

    this.onLimitChange = (e) => this.setState({limit: e.target.value});

    const validSubmission = () => {
        return taskId && this.state.label && this.state.type && (this.state.type != ONTOLOGY_TYPE_BINARY ? validMinMax(this.state.min, this.state.max) : true)
    }

    this.validateMin = (state) => {
      if (state.focused || !state.hasFocused || !this.state.max || !this.state.min) {
        return null;
      }

      const value = this.state.min;
      if (value.length > 0 && validMinMax(value, this.state.max)) {
        return 'success';
      }

      return 'error';
    }

    this.validateMax = (state) => {
      if (state.focused || !state.hasFocused || !this.state.max || !this.state.min) {
        return null;
      }

      const value = this.state.max;
      if (value.length > 0 && validMinMax(this.state.min, value)) {
        return 'success';
      }

      return 'error';
    }

    this.onSubmit = (e) => {
      e.preventDefault();
      if(validSubmission()) {
        this.props.saveOntology(taskId, this.stateToOntologyObject())
            .then(isSuccess => this.setState({ redirectToReferrer: isSuccess }));
      }
    };
  }

  render() {

    const taskId = this.taskId();

    var redirectTo = "/tasks/"+taskId+"/image-sources/new"
    var cancelText = "Skip for now"

    if(this.props.editingTask) {
        redirectTo = "/tasks/"+taskId+"/view"
        cancelText = "Cancel"
    }

    if (this.state.redirectToReferrer) {
      return <Redirect to={redirectTo} />;
    }

    const labelFormProps = {
      type: 'label',
      label: 'Label:',
      placeholder: 'Apples, Very Small Rocks, ...',
      onChange: this.onLabelChange,
      value: this.state.label
    };

    const minFormProps = {
        type: 'label',
        label: 'Min:',
        placeholder: 'Min',
        onChange: this.onMinChange,
        validation: this.validateMin,
        value: this.state.min
    };

    const maxFormProps = {
        type: 'label',
        label: 'Max:',
        placeholder: 'Max',
        onChange: this.onMaxChange,
        validation: this.validateMax,
        value: this.state.max
    };

    const ontologyTypes = this.props.ontologyTypes.get('types', null);

    var limitSelector = null
    var minInput = null
    var maxInput = null

    if(this.state.target != WHOLE_IMAGE){
        limitSelector = <FormGroup onChange={this.onLimitChange}>
          <ControlLabel>Labels per Image</ControlLabel>
          <br />
          <Radio name="radioGroup" inline value="1" checked={this.state.limit == "1"}>
            Limit 1
          </Radio>
          {' '}
          <Radio name="radioGroup" inline value="99" checked={this.state.limit != "1"}>
            Unlimited
          </Radio>
        </FormGroup>;
    }

    if(this.state.type != ONTOLOGY_TYPE_BINARY) {
        minInput = <FormGroupBase baseProps={minFormProps}/>
        maxInput = <FormGroupBase baseProps={maxFormProps}/>
    }

    return <div className='col-md-push-4 col-md-4 m-t-5'>
      <h1>Add Label</h1>
        <form role="form" onSubmit={this.onSubmit}>
          <FormGroupBase baseProps={labelFormProps}/>
          <FormGroup>
            <ControlLabel>Label Type</ControlLabel>
            <FormControl value={this.state.type} onChange={this.onTypeChange} componentClass="select" placeholder="select">
              { ontologyTypes ? ontologyTypes.map(o =>
                        <option key={o.get('name')} value={o.get('name')}>{o.get('name')}</option>)
                        : null }
            </FormControl>
          </FormGroup>

          {minInput}
          {maxInput}

          <FormGroup>
            <ControlLabel>Label Target</ControlLabel>
            <FormControl value={this.state.target} onChange={this.onTargetChange} componentClass="select" placeholder="select">
              <option value={WHOLE_IMAGE}>Whole Image</option>
              <option value={AREA}>Area</option>
              <option value={LENGTH}>Length</option>
            </FormControl>
          </FormGroup>

          {limitSelector}
          <div className="text-xs-center">
              <Button
                bsStyle="primary"
                type="submit">
                Save Label
              </Button>
              <p className='m-t-1'><Link to={{ pathname: redirectTo }}>{cancelText}</Link></p>
          </div>
        </form>
      </div>;
  }
}

const WHOLE_IMAGE = "image"
const AREA = "area"
const LENGTH = "length"

const mapStateToProps = state => {
  return {
    ontologyTypes: state.get('ontologyTypes'),
    currentOntology: state.get('currentTaskOntology'),
    editingTask: state.get('editingTask')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getOntologyTypes: () => {
        return dispatch(ontologyTypes())
            .then(response => {
                if(response.error) {
                    dispatch(ontologyTypesError(response.error));
                    return false;
                }

                dispatch(ontologyTypesSuccess(response.payload.data));
                return true;
            });
    },
    saveOntology: (taskId, ontology) => {
        return dispatch(createOntology(taskId, ontology))
            .then(response => {
                if(response.error) {
                    dispatch(createOntologyError(response.error));
                    return false;
                }

                dispatch(createOntologySuccess(response.payload.data));
                return true;
            })
    },
    getOntology: (taskId, callback) => {
        return dispatch(viewTaskOntology(taskId))
            .then(response => {
                if (response.error) {
                    dispatch(viewTaskOntologyError(response.error));
                    return false;
                }

                dispatch(viewTaskOntologySuccess(response.payload.data));
                callback()
                return true;
            })
    }
  };
};

const NewOntologyContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewOntology);

export default NewOntologyContainer;
