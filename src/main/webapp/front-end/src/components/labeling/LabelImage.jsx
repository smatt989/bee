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
  }

  drawLabels(ctx) {
    const labels = this.props.currentLabels.get('labels')
    labels.map(label => {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(label.get('startX'), label.get('startY'), label.get('w'), label.get('h'))
/*        var div = document.createElement('div');
        div.innerHTML = '<div background-color="green" background="yellow" border-color="blue" top="100" left="100" width="100" height="100" border-width="2px"></div>'
        document.getElementById("canvas_container").prependChild(div)*/
    })
  }

  componentDidMount() {

    console.log("did mount")
    const pushToState = this.addRect
    const pushToGlobalState = this.props.addLabel

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var rect = {};
    var drag = false;
    var imageObj = null;

    const drawLabels = () => this.drawLabels(ctx)

    function mouseDown(e) {
        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        drag = true;
        e.preventDefault()
    }

    function mouseUp() {
        drag = false;
        pushToState(rect);
        pushToGlobalState(rect);

        var elem = document.getElementById("new_box");
        elem.style.display = "none"
    }

    function mouseMove(e) {
        if (drag) {

            var elem = document.getElementById("new_box");
            elem.style.display = "inline-block"

            var line_container = document.getElementById("line_container");


            ctx.clearRect(0, 0, 500, 500);
            ctx.drawImage(imageObj, 0, 0);
            rect.w = (e.pageX - this.offsetLeft) - rect.startX;
            rect.h = (e.pageY - this.offsetTop) - rect.startY;

            elem.style.left = rect.w > 0 ? rect.startX : rect.startX + rect.w
            elem.style.top = rect.h > 0 ? rect.startY : rect.startY + rect.h
            elem.style.height = Math.abs(rect.h)
            elem.style.width = Math.abs(rect.w)

            line_container.innerHTML = '<line id="new_line" x1=' + rect.startX + ' y1=' + rect.startY + ' x2=' + (rect.startX + rect.w) + ' y2=' + (rect.startY + rect.h) + ' strokeWidth="5" stroke="green"/>'

            ctx.strokeStyle = 'red';
            ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);

            ctx.beginPath();
            ctx.moveTo(rect.startX,rect.startY);
            ctx.lineTo(rect.startX + rect.w, rect.startY + rect.h);
            ctx.stroke();
            drawLabels();
        }
        e.preventDefault()
    }


    var imageObj = new Image();
    imageObj.onload = function () { ctx.drawImage(imageObj, 0, 0); };
    imageObj.src = 'http://www.chestx-ray.com/images/igallery/resized/1-100/1-10-500-500-100.jpg';
    //canvas.addEventListener('mousedown', mouseDown, false);
    //canvas.addEventListener('mouseup', mouseUp, false);
    //canvas.addEventListener('mousemove', mouseMove, false);

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

    return <div id="canvas_container" style={containerStyles}>
        <div id="new_box" style={newDivStyle}></div>
        <svg id="line_container" style={newSVGStyle} width="500" height="500" viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg">
          <line id="new_line" style={newLineStyle} x1="20" y1="100" x2="100" y2="20"
              strokeWidth="5" stroke="green"/>
        </svg>
        <canvas id="canvas" width="500" height="500"></canvas>
    </div>
  }
}

/*        {labels.map(label => {
          const divStyle = {
            color: 'white',
            backgroundColor: 'clear',
            position: 'absolute',
            border: '5px solid green',
            left: label.get('startX'),
            top: label.get('startY'),
            height: label.get('h'),
            width: label.get('w')
          }

          return <div onClick={function(){alert("ouch")}} style={divStyle}><p>hi</p></div>
        })}*/

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
