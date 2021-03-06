import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthenticated, path }) => {
  return <Route path={path} render={props => (
    isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>;
};

const HomeRoute = ({component: Component, isAuthenticated, path}) => {
    return <Route path={path} render={props => (
        !isAuthenticated ? (
            <Component {...props} />
        ) : (
            <Redirect to={{
                pathname: '/tasks',
                state: { from: props.location }
            }}/>
        )
    )}/>;
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.getIn(['login', 'session']) != null
  };
};

export const PrivateRouteContainer = connect(
  mapStateToProps
)(PrivateRoute);

export const HomeRouteContainer = connect(
    mapStateToProps
)(HomeRoute);
