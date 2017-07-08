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
import { addLabel, removeLabel } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';
import RectangleLabel from './RectangleLabel.jsx';
import LineLabel from './LineLabel.jsx';

class LabelImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rects: [],
      currentRect: null
    };

    this.addRect = (rect) => {
            this.state.rects.push(Object.assign({}, rect));
    }

    this.updateCurrentRect = (rect) => {
        this.state.currentRect = rect
        this.forceUpdate()
    }
  }

  componentDidMount() {
    const pushToState = this.addRect
    const pushToGlobalState = this.props.addLabel
    const updateCurrentRect = this.updateCurrentRect

    var rect = {};
    var drag = false;

    function mouseDown(e) {
        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        rect.h = 0
        rect.w = 0
        updateCurrentRect(rect)
        drag = true;
        e.preventDefault()
    }

    function mouseUp() {
        drag = false;
        if(rect.h != 0 || rect.w != 0){
            pushToState(rect);
            pushToGlobalState(rect);
        }
        updateCurrentRect(null)
    }

    function mouseMove(e) {
        if (drag) {

            rect.w = (e.pageX - this.offsetLeft) - rect.startX;
            rect.h = (e.pageY - this.offsetTop) - rect.startY;

            updateCurrentRect(rect)
        }
        e.preventDefault()
    }

    var container = document.getElementById("canvas_container")
    container.addEventListener('mousedown', mouseDown, false);
    container.addEventListener('mouseup', mouseUp, false);
    container.addEventListener('mousemove', mouseMove, false);

  }

  render() {

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
        <div width="500" height="500" id="canvas_container" style={containerStyles}>
            <svg style={newSVGStyle} width="100%" height="100%">
                <LineLabel rect={this.state.currentRect} />
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

            <RectangleLabel rect={this.state.currentRect} />
            <img unselectable="on" id="tagging_image" src='http://www.chestx-ray.com/images/igallery/resized/1-100/1-10-500-500-100.jpg'/>
        </div>
        <Button>Done for now</Button>
        <Button>Submit labels</Button>
        <Button>Skip</Button>
    </div>
  }
}

const mapStateToProps = state => {
  return {
    currentLabels: state.get('currentLabels')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addLabel: (label) => {
        dispatch(addLabel(label))
    },
    removeLabel: (label) => {
        dispatch(removeLabel(label))
    }
  };
};

const LabelImageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelImage);

export default LabelImageContainer;
