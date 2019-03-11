import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import AppBar from './AppBar';
import Login from './Login';
import Chat from './Chat';
import AuthContext from './context';
import { getUser } from './api';

class App extends Component {
  state = {
    isAuth: undefined,
    user: {},
  };

  setUser = user => this.setState({ user, isAuth: true });

  componentDidMount() {
    getUser()
      .then(user => this.setState({ isAuth: true, user }))
      .catch(() => this.setState({ isAuth: false }));
  }

  renderChat = () => (this.state.isAuth ? <Chat /> : <Redirect to="/login" />);

  render() {
    return (
      <BrowserRouter>
        {this.state.isAuth !== undefined && (
          <AuthContext.Provider
            value={{ isAuth: this.state.isAuth, user: this.state.user, setUser: this.setUser }}
          >
            <Fragment>
              <AppBar />
              <Route path="/" exact render={this.renderChat} />
              <Route path="/login" component={Login} />
            </Fragment>
          </AuthContext.Provider>
        )}
      </BrowserRouter>
    );
  }
}

export default App;
