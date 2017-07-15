import '../styles/app.scss';
import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import NavBarContainer from './NavBar.jsx';
import Home from './Home.jsx';
import LoginContainer from './account_forms/Login.jsx';
import RegisterContainer from './account_forms/Register.jsx';
import PrivateRouteContainer from './PrivateRoute.jsx';
import ImageSources from './image_sources/ImageSources.jsx';
import NewImageSource from './image_sources/NewImageSource.jsx';
import Tasks from './tasks/Tasks.jsx';
import NewTask from './tasks/NewTask.jsx';
import ViewTask from './tasks/ViewTask.jsx';
import NewOntology from './tasks/NewOntology.jsx';
import ShareTask from './tasks/ShareTask.jsx';
import AcceptTaskInvitation from './tasks/AcceptTaskInvitation.jsx';
import LabelImage from './labeling/LabelImage.jsx';
import Err from './Error.jsx';

export default class App extends React.Component {
  render() {
    return <Router>
      <Grid>
        <Row>
          <Col>
            <NavBarContainer />
          </Col>
        </Row>
        <Row className="show-grid">
          <Col>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/login" component={LoginContainer}/>
              <Route exact path="/register" component={RegisterContainer}/>
              <Route exact path="/recover" component={LoginContainer}/>
              <PrivateRouteContainer exact path="/image-sources" component={ImageSources}/>
              <PrivateRouteContainer exact path="/tasks" component={Tasks}/>
              <PrivateRouteContainer exact path="/tasks/new" component={NewTask}/>
              <PrivateRouteContainer path="/tasks/:id/view" component={ViewTask}/>
              <PrivateRouteContainer path="/tasks/:id/edit" component={NewTask}/>
              <PrivateRouteContainer path="/invitation/:invitation" component={AcceptTaskInvitation}/>
              <PrivateRouteContainer path="/tasks/:id/participant-link/new" component={ShareTask} />
              <PrivateRouteContainer path="/tasks/:id/labels/new" component={NewOntology} />
              <PrivateRouteContainer path="/tasks/:id/image-sources/new" component={NewImageSource} />
              <PrivateRouteContainer path="/tasks/:id/image-sources/:isid" component={NewImageSource} />
              <PrivateRouteContainer path="/tasks/:id/image-sources" component={ImageSources} />
              <PrivateRouteContainer path="/tasks/:id/labeling" component={LabelImage} />

              <Route component={Err}/>
            </Switch>
          </Col>
        </Row>
      </Grid>
    </Router>;
  }
}
