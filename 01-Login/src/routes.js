import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import App from './App';
import Home from './Home/Home';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import history from './history';

export default class Routes extends Component {
  constructor(){
    super();

    this.auth = new Auth();

    this.state = {
      user_id: null
    };
  }

  handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
      const { auth0 } = this.auth;
      auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.auth.setSession(authResult);
          // persist logged-in user_id (and/or other variables) in state to pass to child components
          this.setState({user_id: authResult.idTokenPayload.sub})
          history.replace('/home');
        } else if (err) {
          history.replace('/home');
          console.log(err);
          alert(`Error: ${err.error}. Check the console for further details.`);
        }
      });
    }
  }
  
  render() {
    return (
        <Router history={history} component={App}>
          <div>
            <Route path="/" render={(props) => <App auth={this.auth} {...props} {...this.state} />} />
            <Route path="/home" render={(props) => <Home auth={this.auth} {...props} {...this.state}/>} />
            <Route path="/callback" render={(props) => {
              this.handleAuthentication(props);
              return <Callback {...props} /> 
            }}/>
          </div>
        </Router>
    );
  }
}
