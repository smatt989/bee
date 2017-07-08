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
import { LinkContainer } from 'react-router-bootstrap';
import { addLabel, removeLabel, viewTaskOntology, viewTaskOntologySuccess, viewTaskOntologyError } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';
import RectangleLabel from './RectangleLabel.jsx';
import LineLabel from './LineLabel.jsx';
import { ONTOLOGY_TYPE_BINARY, ONTOLOGY_TYPE_FLOAT_RANGE, ONTOLOGY_TYPE_INTEGER_RANGE } from './../../utilities.js';

class LabelImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      rects: [],
      rect: {startX: 0, startY: 0, h: 0, w: 0},
      drag: false
    };

    this.addRect = (rect) => {
            this.state.rects.push(Object.assign({}, rect));
    }

    this.updateCurrentRect = () => {
        this.forceUpdate()
    }

    this.imageHandleMouseDown = this.imageHandleMouseDown.bind(this);
    this.imageHandleMouseUp = this.imageHandleMouseUp.bind(this);
    this.imageHandleMouseMove = this.imageHandleMouseMove.bind(this);
  }

  imageHandleMouseDown(e) {
    var rect = this.state.rect
    rect.startX = e.pageX - e.currentTarget.offsetLeft;
    rect.startY = e.pageY - e.currentTarget.offsetTop;
    rect.h = 0
    rect.w = 0
    this.updateCurrentRect()
    this.state.drag = true;
    e.preventDefault()
  }

  imageHandleMouseUp() {
      this.state.drag = false;
      var rect = this.state.rect
      if(rect.h != 0 || rect.w != 0){
          this.addRect(rect);
          this.props.addLabel(rect);
      }
      this.updateCurrentRect()
  }

  imageHandleMouseMove(e) {
      if (this.state.drag) {
          var rect = this.state.rect
          rect.w = (e.pageX - e.currentTarget.offsetLeft) - rect.startX;
          rect.h = (e.pageY - e.currentTarget.offsetTop) - rect.startY;

          this.updateCurrentRect()
      }
      e.preventDefault()
  }

  componentDidMount() {
    if(!this.props.currentOntology.get('ontology') && !this.props.currentOntology.get('loading')){
        this.props.getOntology(this.props.match.params.id)
    }
  }

  render() {

    //console.log(this.props.currentOntology.get('ontology'))

    const ontology = this.props.currentOntology.get('ontology', Map({}))

    const labelLimit = this.props.currentOntology.getIn(['ontology', 'labelLimit'], 1);
    const ontologyType = this.props.currentOntology.getIn(['ontology', 'ontologyType'], ONTOLOGY_TYPE_BINARY);
    const isAreaLabel = this.props.currentOntology.getIn(['ontology', 'isAreaLabel'], false);
    const isLengthLabel = this.props.currentOntology.getIn(['ontology', 'isLengthLabel'], false);

    const labels = this.props.currentLabels.get('labels')

    const containerStyles = {
        position: 'relative'
    }

    const newDivStyle = {
        backgroundColor: 'clear',
        position: 'absolute',
        border: '5px solid green',
        left: 0,
        top: 0,
        height: 0,
        width: 0,
        display: "none"
    }

    const newSVGStyle = {
        position: 'absolute'
    }

    const newLineStyle = {
        display: 'none'
    }

    const removeLabel = (label) => () => {
        this.props.removeLabel(label)
    }

    return <div>
        <Button>Previous</Button>
        <div width="500" height="500" id="canvas_container" style={containerStyles} onMouseDown={this.imageHandleMouseDown} onMouseUp={this.imageHandleMouseUp} onMouseMove={this.imageHandleMouseMove}>
            <svg style={newSVGStyle} width="100%" height="100%">
                <LineLabel rect={this.state.rect} />
                {
                    labels.map(label => {
                        return <LineLabel rect={label.toJS()} remove={removeLabel(label)} />
                    })
                }
            </svg>

            {
                labels.map(label => {
                    return <RectangleLabel rect={label.toJS()} remove={removeLabel(label)} />
                })
            }

            <RectangleLabel rect={this.state.rect} />
            <img unselectable="on" id="tagging_image" src='http://www.chestx-ray.com/images/igallery/resized/1-100/1-10-500-500-100.jpg'/>
        </div>
        <LinkContainer to="/tasks">
            <Button>Done for now</Button>
        </LinkContainer>
        <Button>Submit labels</Button>
        <Button>Skip</Button>
    </div>
  }
}

const mapStateToProps = state => {
  return {
    currentLabels: state.get('currentLabels'),
    currentOntology: state.get('currentTaskOntology')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addLabel: (label) => {
        dispatch(addLabel(label))
    },
    removeLabel: (label) => {
        dispatch(removeLabel(label))
    },
    getOntology: (taskId) => {
        return dispatch(viewTaskOntology(taskId))
            .then(response => {
                if (response.error) {
                    dispatch(viewTaskOntologyError(response.error));
                    return false;
                }

                dispatch(viewTaskOntologySuccess(response.payload.data));
                return true;
            })
    }
  };
};

const LabelImageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelImage);

export default LabelImageContainer;
