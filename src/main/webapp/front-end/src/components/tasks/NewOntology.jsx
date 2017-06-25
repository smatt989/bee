import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
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
import { ontologyTypes, ontologyTypesSuccess, ontologyTypesError, createOntology, createOntologySuccess, createOntologyError } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';

class NewOntology extends React.Component {
    componentDidMount() {
        if (this.props.ontologyTypes.get('types').size == 0) {
            this.props.getOntologyTypes()
        }
    }

    defaultOntologyType() {
        return this.props.ontologyTypes.get('types').size == 0 ? '' : this.props.ontologyTypes.get('types')[0].get('name')
    }

    targetFromFlags(isAreaLabel, isLengthLabel) {
        return isAreaLabel ? AREA : isLengthLabel ? LENGTH : WHOLE_IMAGE
    }

    stateToOntologyObject() {
        return Map({
            name: this.state.label,
            ontologyType: this.state.type,
            minValue: this.state.min == '' ? null : this.state.min,
            maxValue: this.state.max == '' ? null : this.state.max,
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
    this.state = this.ontologyObjectToState();

    this.onLabelChange = (e) => this.setState({ label: e.target.value });

    this.onTypeChange = (e) => this.setState({type: e.target.value});

    this.onTargetChange = (e) => this.setState({target: e.target.value});

    this.onMinChange = (e) => this.setState({min: e.target.value });

    this.onMaxChange = (e) => this.setState({max: e.target.value});

    this.onLimitChange = (e) => this.setState({limit: e.target.value});

    this.onSubmit = (e) => {
      e.preventDefault();
      const taskId = this.props.currentTask.getIn(['task', 'id'], null);
      if(taskId) {
        this.props.saveOntology(taskId, this.stateToOntologyObject())
            .then(isSuccess => this.setState({ redirectToReferrer: isSuccess }));
      }
    };
  }

  render() {

    const labelFormProps = {
      type: 'label',
      label: 'Label:',
      placeholder: 'Task Label',
      onChange: this.onLabelChange,
      value: this.state.label
    };

    const minFormProps = {
        type: 'label',
        label: 'Min:',
        placeholder: 'Min',
        onChange: this.onMinChange,
        value: this.state.min
    };

    const maxFormProps = {
        type: 'label',
        label: 'Max:',
        placeholder: 'Max',
        onChange: this.onMaxChange,
        value: this.state.max
    };

    const ontologyTypes = this.props.ontologyTypes.get('types', null);

    return <Grid>
      <PageHeader>
        Add Label
      </PageHeader>
      <form role="form" onSubmit={this.onSubmit}>
        <FormGroupBase baseProps={labelFormProps}/>

        <FormGroup>
          <ControlLabel>Label Type</ControlLabel>
          <FormControl onChange={this.onTypeChange} componentClass="select" placeholder="select">
            { ontologyTypes ? ontologyTypes.map(o =>
                      <option key={o.get('name')} value={o.get('name')}>{o.get('name')}</option>)
                      : null }
          </FormControl>
        </FormGroup>

        <FormGroupBase baseProps={minFormProps}/>
        <FormGroupBase baseProps={maxFormProps}/>

        <FormGroup>
          <ControlLabel>Label Target</ControlLabel>
          <FormControl onChange={this.onTargetChange} componentClass="select" placeholder="select">
            <option value={WHOLE_IMAGE}>Whole Image</option>
            <option value={AREA}>Area</option>
            <option value={LENGTH}>Length</option>
          </FormControl>
        </FormGroup>

        <FormGroup onChange={this.onLimitChange}>
          <ControlLabel>Labels per Image</ControlLabel>
          <br />
          <Radio name="radioGroup" inline value="1" checked={this.state.limit == "1"}>
            Limit 1
          </Radio>
          {' '}
          <Radio name="radioGroup" inline value="99" checked={this.state.limit != "1"}>
            Unlimited
          </Radio>
        </FormGroup>

        <Button
          bsStyle="primary"
          type="submit">
          Save Label
        </Button>
      </form>
    </Grid>;
  }
}

const WHOLE_IMAGE = "image"
const AREA = "area"
const LENGTH = "length"

const mapStateToProps = state => {
  return {
    ontologyTypes: state.get('ontologyTypes'),
    currentOntology: state.get('currentTaskOntology'),
    currentTask: state.get('currentTask')
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
    }
  };
};

const NewOntologyContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewOntology);

export default NewOntologyContainer;
