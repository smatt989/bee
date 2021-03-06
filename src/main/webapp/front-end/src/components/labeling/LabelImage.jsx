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
  ControlLabel,
  ButtonGroup
} from 'react-bootstrap';
import NavBar from '../NavBar.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import { addLabel, removeLabel, viewTaskOntology, viewTaskOntologySuccess, viewTaskOntologyError, updateLabelValue, viewParticipantImageLabels, viewParticipantImageLabelsSuccess, viewParticipantImageLabelsError, nextImage, nextImageSuccess, nextImageError, saveLabels, saveLabelsSuccess, saveLabelsError, markImageSeen, markImageSeenSuccess, markImageSeenError, previousImage, previousImageSuccess, previousImageError, viewParticipationDetails, viewParticipationDetailsSuccess, viewParticipationDetailsError } from '../../actions.js';
import FormGroupBase from '../shared/FormGroupBase.jsx';
import RectangleLabel from './RectangleLabel.jsx';
import LineLabel from './LineLabel.jsx';
import LabelValueInput from './LabelValueInput.jsx';
import RemoveLabelButton from './RemoveLabelButton.jsx';
import { ONTOLOGY_TYPE_BINARY, ONTOLOGY_TYPE_FLOAT_RANGE, ONTOLOGY_TYPE_INTEGER_RANGE, isNullLabel, valueInRange } from './../../utilities.js';
import LabelingHint from './LabelingHint.jsx';
import SubmitLabelsInfo from './SubmitLabelsInfo.jsx';
import SkipLabelsInfo from './SkipLabelsInfo.jsx';
import OntologySentenceContainer from '../tasks/OntologySentence.jsx';
import DoneLabeling from './DoneLabeling.jsx';
import ParticipationContainers from './Participation.jsx';

const uuidv1 = require('uuid/v1');

class LabelImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      rect: {startX: 0, startY: 0, h: 0, w: 0},
      drag: false,
      hasSavedLabels: false,
      doneForNow: false,
      imageHeight: 1,
      imageWidth: 1,
      imageNaturalHeight: 1,
      imageNaturalWidth: 1,
      addingLabelValue: false,
      autofocus: true
    };

    this.imageHandleMouseMove = (limit) => (e) => {
        if (this.state.drag) {
            //TODO: COULD HAVE MORE DYNAMIC LIMITS VS JUST 1 OR INFINITE
            if(limit == 1) {
              this.removeAllPreexistingLabels()
            }
            var rect = this.state.rect
            rect.w = this.rectLeftCorner(e) - rect.startX;
            rect.h = this.rectTopCorner(e) - rect.startY;
            this.setState({rect: rect})
        }
        e.preventDefault()
    }

    this.imageHandleMouseUp = (createLabelFunction) => () => {
         var rect = this.state.rect
         if(rect.h != 0 || rect.w != 0){
             var value = this.props.currentOntology.getIn(['ontology', 'ontologyType']) == ONTOLOGY_TYPE_BINARY ? 1 : null;
             this.removeNullLabels()
             this.turnOnAutofocus();
             this.props.addLabel(this.transposeRectToLabelJSProportions(createLabelFunction(rect, value)));
         }
         this.setState({rect: {startX: 0, startY: 0, h: 0, w: 0}, drag: false});
    }

    this.imageHandleMouseDown = this.imageHandleMouseDown.bind(this);
    this.imageHandleClick = this.imageHandleClick.bind(this);
    this.removeAllPreexistingLabels = this.removeAllPreexistingLabels.bind(this);
    this.isPositiveImageLabel = this.isPositiveImageLabel.bind(this);
    this.loadNewImage = this.loadNewImage.bind(this);
    this.handleSaveLabels = this.handleSaveLabels.bind(this);
    this.handleSkipLabeling = this.handleSkipLabeling.bind(this);
    this.seenImage = this.seenImage.bind(this);
    this.removeNullLabels = this.removeNullLabels.bind(this);
    this.handleDoneForNow = this.handleDoneForNow.bind(this);
    this.validLabels = this.validLabels.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.transposeLabelJSToRectProportions = this.transposeLabelJSToRectProportions.bind(this);
    this.transposeRectToLabelJSProportions = this.transposeRectToLabelJSProportions.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleGlobalKeyPress = this.handleGlobalKeyPress.bind(this);
    this.turnOffAutofocus = this.turnOffAutofocus.bind(this);
    this.turnOnAutofocus = this.turnOnAutofocus.bind(this);
  }

  removeAllPreexistingLabels() {
    this.props.currentLabels.get('labels').map(label => this.props.removeLabel(label))
  }

  removeNullLabels() {
    this.props.currentLabels.get('labels').map(label => {
        if(isNullLabel(label.toJS())){
            this.props.removeLabel(label)
        }
    })
  }

  rectTopCorner(e) {
    const currentStyle = window.getComputedStyle(e.currentTarget)
    const parentStyle = window.getComputedStyle(e.currentTarget.parentElement)

    return e.pageY - e.currentTarget.parentElement.offsetTop - e.currentTarget.offsetTop - parseFloat(parentStyle.marginTop) + 6 //IDK WHY
  }

  rectLeftCorner(e) {
    const currentStyle = window.getComputedStyle(e.currentTarget)
    const parentStyle = window.getComputedStyle(e.currentTarget.parentElement)


    return e.pageX - e.currentTarget.parentElement.offsetLeft - e.currentTarget.offsetLeft - parseFloat(parentStyle.marginLeft)
  }

  imageHandleMouseDown(e) {
    var rect = this.state.rect
    rect.startX = this.rectLeftCorner(e);
    rect.startY = this.rectTopCorner(e);
    rect.h = 0
    rect.w = 0
    this.setState({drag: true, rect: rect});
    e.preventDefault()
  }

  imageHandleClick() {
    this.turnOnAutofocus()
    if(this.isPositiveImageLabel()) {
        this.removeAllPreexistingLabels()
        //TODO: CRAP... COLLISION BETWEEN LABELING "NO LABEL" AND "0" VALUE FOR INTEGER RANGE... COULD USE SPECIAL VALUE... UGH
        //TODO: THIS IS ACTUALLY A BIGGER PROBLEM THAN I REALIZED.... FOR EXAMPLE NOT A GOOD WAY TO "LABEL" NO AREAS, ETC.
        //TODO: NEED TO CHANGE BACKEND TO INCLUDE A "DID SUBMIT LABEL" TABLE, IN ADDITION TO ALREADY EXISTING "DID SEE" TABLE
        this.props.addLabel(this.makeImageLabel(0))
    } else {
        this.removeAllPreexistingLabels()
        this.props.addLabel(this.makeImageLabel(1))
    }
  }

  makeAreaLabel(rect, value) {
    var left = rect.w > 0 ? rect.startX : rect.startX + rect.w
    var top = rect.h > 0 ? rect.startY : rect.startY + rect.h
    var height = Math.abs(rect.h)
    var width = Math.abs(rect.w)

    return {
        labelValue: value,
        xCoordinate: left,
        yCoordinate: top,
        width: width,
        height: height,
        uuid: uuidv1()
    }
  }

  makeLengthLabel(rect, value) {
    return {
        labelValue: value,
        point1x: rect.startX,
        point1y: rect.startY,
        point2x: rect.startX + rect.w,
        point2y: rect.startY + rect.h,
        uuid: uuidv1()
    }
  }

  makeImageLabel(value) {
    return {
        labelValue: value,
        uuid: uuidv1()
    }
  }

  makeNullLabel() {
    return {
        labelValue: 0
    }
  }

  isPositiveImageLabel() {
    const firstLabel = this.props.currentLabels.getIn(['labels', 0], null)
    return firstLabel != null && firstLabel.get('labelValue', 0) != 0
  }

  handleSaveLabels(labels) {
    const taskId = Number(this.props.match.params.id)
    const imageId = this.props.currentImage.getIn(['image', 'id'])
    if(this.validLabels()){
        this.props.saveLabels(taskId, imageId, labels, this.seenImage)
    }
    return false;
  }

  handleImageLoad() {
    const img = document.getElementById("tagging_image")

    this.setState({imageHeight: img.height, imageWidth: img.width, imageNaturalHeight: img.naturalHeight, imageNaturalWidth: img.naturalWidth})
  }

  transposeLabelJSToRectProportions(label) {
    const xRatio = this.state.imageWidth / this.state.imageNaturalWidth
    const yRatio = this.state.imageHeight / this.state.imageNaturalHeight
    if(label.xCoordinate){
        label.xCoordinate = label.xCoordinate * xRatio
        label.yCoordinate = label.yCoordinate * yRatio
        label.width = label.width * xRatio
        label.height = label.height * yRatio
    }

    if(label.point1x){
        label.point1x = label.point1x * xRatio
        label.point2x = label.point2x * xRatio
        label.point1y = label.point1y * yRatio
        label.point2y = label.point2y * yRatio
    }

    return label
  }

  transposeRectToLabelJSProportions(rect){
      const xRatio = this.state.imageNaturalWidth / this.state.imageWidth
      const yRatio = this.state.imageNaturalHeight / this.state.imageHeight
      if(rect.xCoordinate){
          rect.xCoordinate = rect.xCoordinate * xRatio
          rect.yCoordinate = rect.yCoordinate * yRatio
          rect.width = rect.width * xRatio
          rect.height = rect.height * yRatio
      }

      if(rect.point1x){
          rect.point1x = rect.point1x * xRatio
          rect.point2x = rect.point2x * xRatio
          rect.point1y = rect.point1y * yRatio
          rect.point2y = rect.point2y * yRatio
      }

      return rect
  }

  validLabels() {
    const min = this.props.currentOntology.getIn(['ontology', 'minValue'], null);
    const max = this.props.currentOntology.getIn(['ontology', 'maxValue'], null);

    if(this.props.currentOntology.getIn(['ontology', 'ontologyType'], '') != ONTOLOGY_TYPE_BINARY){
        var allValid = true
        this.props.currentLabels.get('labels', List.of()).map(label => {
            if(!valueInRange(label.get('labelValue', null), min, max) && !isNullLabel(label.toJS())){
                allValid = false
            }
        })
        if(!allValid){
            return false;
        }
    }
    return true
  }

  getLabelsWithNullLabels() {
    const labels = this.props.currentLabels.get('labels', List.of()).toJS()
    return labels.length > 0 ? labels: [this.makeNullLabel()]
  }

  handleSkipLabeling() {
    this.handleSaveLabels([])
  }

  handleDoneForNow() {
    this.setState({doneForNow: true});
  }

  seenImage() {
    if(!this.props.currentImage.get('viewInfo')){
        const taskId = Number(this.props.match.params.id)
        const imageId = this.props.currentImage.getIn(['image', 'id'])
        this.props.markImageSeen(taskId, imageId, () => this.loadNewImage(true))
    } else {
        this.loadNewImage(true)
    }
  }

  loadNewImage(next) {
    const taskId = Number(this.props.match.params.id)
    const imageViewId = this.props.currentImage.getIn(['viewInfo', 'imageViewId'], null)
    const callback = (data) => this.props.getLabels(taskId, data.image.id, (d) => this.setState({hasSavedLabels: d.length > 0}))
    this.turnOffAutofocus()
    if(next){
        this.props.nextImage(taskId, imageViewId, callback)
    }else {
        this.props.previousImage(taskId, imageViewId, callback)
    }
    this.props.getParticipation(taskId)
  }

  componentDidMount() {
    this.loadNewImage(true)
    if(!this.props.currentOntology.get('ontology') && !this.props.currentOntology.get('loading')){
        this.props.getOntology(this.props.match.params.id)
    }

  }

  componentWillMount(){
    document.addEventListener("keydown", this.handleGlobalKeyPress.bind(this))
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleGlobalKeyPress.bind(this))
  }

  handleGlobalKeyPress(e){
    const isAreaLabel = this.props.currentOntology.getIn(['ontology', 'isAreaLabel'], false);
    const isLengthLabel = this.props.currentOntology.getIn(['ontology', 'isLengthLabel'], false);

    if(!this.state.addingLabelValue){
        switch(e.keyCode) {
            case 39 /*right*/:
                this.handleSaveLabels(this.getLabelsWithNullLabels())
                e.preventDefault()
                break;
            case 37 /*left*/:
                this.loadNewImage(false);
                e.preventDefault()
                break;
            case 32 /*space*/:
                if(!isAreaLabel && !isLengthLabel){
                    this.imageHandleClick()
                }
                break;
            case 13 /*enter*/:
                break;
            case 40 /*down*/:
                this.handleSkipLabeling()
                e.preventDefault()
                break;
            default:
                break;
        }
    }
  }

  handleInputFocus() {
    this.setState({addingLabelValue: true})
  }

  handleInputBlur() {
    this.setState({addingLabelValue: false})
  }

  turnOnAutofocus() {
    this.setState({autofocus: true})
  }

  turnOffAutofocus() {
    this.setState({autofocus: false})
  }

  render() {
    if (this.state.doneForNow) {
      return <Redirect to={"/tasks"} push />;
    }

    const ontology = this.props.currentOntology.get('ontology', Map({}))

    const labelLimit = this.props.currentOntology.getIn(['ontology', 'labelLimit'], 1);
    const ontologyType = this.props.currentOntology.getIn(['ontology', 'ontologyType'], ONTOLOGY_TYPE_BINARY);
    const isAreaLabel = this.props.currentOntology.getIn(['ontology', 'isAreaLabel'], false);
    const isLengthLabel = this.props.currentOntology.getIn(['ontology', 'isLengthLabel'], false);

    const min = this.props.currentOntology.getIn(['ontology', 'minValue'], null);
    const max = this.props.currentOntology.getIn(['ontology', 'maxValue'], null);

    const labels = this.props.currentLabels.get('labels')

    const isLoading = this.props.currentImage.get('loading');

    const containerStyles = {
        position: 'relative'
    }

    const removeLabel = (label) => () => {
        this.props.removeLabel(label)
    }

    var mouseDownFunction = () => {}
    var mouseUpFunction = () => {}
    var mouseMoveFunction = () => {}
    var imageClickFunction = () => {}


    var areaLabelDiv = null
    var lengthLabelDiv = null

    var imageLabelStyle = labels.size == 0 || (labels.size == 1 && isNullLabel(labels.toJS()[0])) ? "negative-label" : "no-label";

    var imageLabelValueInput = null

    const handleFocus = this.handleInputFocus
    const handleBlur = this.handleInputBlur

    const autofocusState = this.state.autofocus

    if(isAreaLabel) {
        mouseDownFunction = this.imageHandleMouseDown
        mouseUpFunction = this.imageHandleMouseUp(this.makeAreaLabel)
        mouseMoveFunction = this.imageHandleMouseMove(labelLimit)

        areaLabelDiv = <div>

                {labels.map((label, index) => {
                    return <RectangleLabel key={index} rect={this.transposeLabelJSToRectProportions(label.toJS())} remove={removeLabel(label.get('uuid'))} update={this.props.updateLabelValue} ontologyType={ontologyType} min={min} max={max} handleFocus={handleFocus} handleBlur={handleBlur} autofocusState={autofocusState} />
                })}
                <RectangleLabel rect={this.makeAreaLabel(this.state.rect, 1)} />
            </div>
    } else if(isLengthLabel) {
        mouseDownFunction = this.imageHandleMouseDown
        mouseUpFunction = this.imageHandleMouseUp(this.makeLengthLabel)
        mouseMoveFunction = this.imageHandleMouseMove(labelLimit)

        lengthLabelDiv = <div>

                {labels.map((label, index) => {
                    return <LineLabel key={index} rect={this.transposeLabelJSToRectProportions(label.toJS())} remove={removeLabel(label.get('uuid'))} update={this.props.updateLabelValue} ontologyType={ontologyType} min={min} max={max} handleFocus={handleFocus} handleBlur={handleBlur} autofocusState={autofocusState} />
                })}
                <LineLabel rect={this.makeLengthLabel(this.state.rect, 1)} />
            </div>
    } else {
        imageClickFunction = this.imageHandleClick

        const imageLabel = labels.get(0) ? labels.get(0) : null

        if(this.isPositiveImageLabel()){
            imageLabelStyle = "positive-label"
        }

        if(this.isPositiveImageLabel() && (ontologyType == ONTOLOGY_TYPE_FLOAT_RANGE || ontologyType == ONTOLOGY_TYPE_INTEGER_RANGE)){
            imageLabelValueInput = <LabelValueInput top={5} left={5} update={this.props.updateLabelValue} label={imageLabel.toJS()} ontologyType={ontologyType} min={min} max={max} handleFocus={handleFocus} handleBlur={handleBlur} autofocusState={autofocusState}/>
        }
    }

    const imger = this.props.currentImage
    if(!imger.get('image') && !imger.get('error') && !imger.get('loading')){
        return <DoneLabeling {...this.props} />
    }


    return <div>
        <NavBar inverse={false}/>
        <div className="col-md-2 m-t-5">
            <div onClick={() => this.loadNewImage(false)} className="label-previous"></div>
        </div>
        <div className="col-md-5 m-t-5">
            <OntologySentenceContainer {...this.props} />
            <div id="canvas_container" style={containerStyles} onMouseDown={mouseDownFunction} onMouseUp={mouseUpFunction} onMouseMove={mouseMoveFunction} >

                {lengthLabelDiv}

                {areaLabelDiv}

                <img onLoad={this.handleImageLoad} className={imageLabelStyle} unselectable="on" id="tagging_image" src={this.props.currentImage.getIn(['image', 'location'], '')} onClick={imageClickFunction} />


                {imageLabelValueInput}
            </div>
        </div>
        <div className="col-md-4 m-t-5 pull-right">
            <div>
                <ParticipationContainers />
                <Button className="m-t-3" onClick={this.handleDoneForNow}>Done for now</Button>
            </div>
            <div className="m-t-5">
                <LabelingHint currentOntology={this.props.currentOntology} />
            </div>
            <div className="label-submit" onClick={() => this.handleSaveLabels(this.getLabelsWithNullLabels())}> <SubmitLabelsInfo currentOntology={this.props.currentOntology} labels={labels} hasSavedLabels={this.state.hasSavedLabels} viewInfo={this.props.currentImage.get('viewInfo', null)} /></div>
            <br />
            <div className="m-t-5">
                <Button disabled={isLoading} onClick={this.handleSkipLabeling}><SkipLabelsInfo labels={labels} hasSavedLabels={this.state.hasSavedLabels} viewInfo={this.props.currentImage.get('viewInfo', null)} /></Button>
            </div>
        </div>
    </div>
  }
}

const mapStateToProps = state => {
  return {
    currentLabels: state.get('currentLabels'),
    currentOntology: state.get('currentTaskOntology'),
    currentImage: state.get('currentImage')
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
    updateLabelValue: (label, value) => {
        dispatch(updateLabelValue(label, value))
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
    },
    nextImage: (taskId, imageViewId, callback) => {
        return dispatch(nextImage(taskId, imageViewId))
            .then(response => {
                if(response.error) {
                    dispatch(nextImageError(response.error));
                    return false;
                }

                dispatch(nextImageSuccess(response.payload.data, response.payload.headers));
                callback(response.payload.data)

                return true;
            })
    },
    previousImage: (taskId, imageViewId, callback) => {
       return dispatch(previousImage(taskId, imageViewId))
           .then(response => {
               if(response.error) {
                   dispatch(previousImageError(response.error));
                   return false;
               }

               dispatch(previousImageSuccess(response.payload.data, response.payload.headers));
               callback(response.payload.data)

               return true;
           })
    },
    getParticipation: (taskId) => {
        return dispatch(viewParticipationDetails(taskId))
            .then(response => {
                if(response.error) {
                    dispatch(viewParticipationDetailsError(response.error));
                    return false;
                }

                dispatch(viewParticipationDetailsSuccess(response.payload.data));
                return true;
            })
    },
    getLabels: (taskId, imageId, callback) => {
        return dispatch(viewParticipantImageLabels(taskId, imageId))
                    .then(response => {
                        if(response.error) {
                            dispatch(viewParticipantImageLabelsError(response.error));
                            return false;
                        }

                        dispatch(viewParticipantImageLabelsSuccess(response.payload.data));
                        callback(response.payload.data)
                        return true;
                    })
    },
    saveLabels: (taskId, imageId, labels, callback) => {
        return dispatch(saveLabels(taskId, imageId, labels))
            .then(response => {
                if(response.error) {
                    dispatch(saveLabelsError(response.error));
                    return false;
                }

                dispatch(saveLabelsSuccess(response.payload.data))
                callback(response.payload.data)
                return true;
            })
    },
    markImageSeen: (taskId, imageId, callback) => {
        return dispatch(markImageSeen(taskId, imageId))
            .then(response => {
                if(response.error) {
                    dispatch(markImageSeenError(response.error));
                    return false;
                }

                dispatch(markImageSeenSuccess(response.payload.data));
                callback()
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
