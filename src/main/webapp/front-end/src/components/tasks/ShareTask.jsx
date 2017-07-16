import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import {
  Grid,
  PageHeader,
  Button
} from 'react-bootstrap';
import { participantLink, participantLinkSuccess, participantLinkError } from '../../actions.js';

class ShareTask extends React.Component {
    componentDidMount() {
        this.props.getLink(this.props.match.params.id)
    }

    invitationLink() {
        if(this.props.participantLink.get('link')) {
            const currentUrl = window.location.href
            const urlLeftSide = currentUrl.split("#")[0] + "#"
            return (urlLeftSide + "/invitation/"+this.props.participantLink.get('link'))
        }
        return 'error'
    }

  render() {

    const redirectTo = "/tasks/"+this.props.match.params.id+"/view"

    return <div className="col-md-push-4 col-md-4 m-t-5">
      <h1>Share Task</h1>
      <h3>Share this link to invite people to participate in this task!</h3>
      <p className="m-t-3"><a href={"mailto:?subject=Image Annotation Invitation&body=Please join my image annotation task by clicking on the following link: " +this.invitationLink()}>
        {this.invitationLink()}
      </a></p>
      <p className="text-sm">This link will remain valid for 1 week. You can always generate a new link.</p>
      <div className="text-xs-center">
        <Link to={redirectTo}>
          <Button bsStyle="primary">Done</Button>
        </Link>
      </div>

    </div>;
  }
}

const mapStateToProps = state => {
  return {
    participantLink: state.get('participantLink')
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getLink: (taskId) => {
        return dispatch(participantLink(taskId))
            .then(response => {
                if(response.error) {
                    dispatch(participantLinkError(response.error));
                    return false
                }

                dispatch(participantLinkSuccess(response.payload.data));
                return true;
            })
    }
  };
};

const ShareTaskContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareTask);

export default ShareTaskContainer;
