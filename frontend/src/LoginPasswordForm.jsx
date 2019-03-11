import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';

import AuthContext from './context';
import { login } from './api';

const styles = () => ({
  input: {
    display: 'block',
  },
  container: {
    width: '250px',
    margin: 'auto',
  },
  button: {
    marginTop: '32px',
    backgroundColor: '#f5f5f5',
  },
});

const initialState = { login: '', password: '', showPassword: false, error: false };

class LoginPasswordForm extends React.Component {
  static contextType = AuthContext;
  state = initialState;

  handleChange = field => event => this.setState({ [field]: event.target.value, error: false });

  handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword });

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      const { error, login, password } = this.state;
      if (!error && login.length > 0 && password.length > 0) {
        this.handleLogin();
      }
    }
  };

  handleLogin = () => {
    login(this.state.login, this.state.password)
      .then(user => {
        this.context.setUser(user);
        this.props.history.push('/');
      })
      .catch(() => this.setState({ error: true }));
  };

  componentDidUpdate(prevProps) {
    if (prevProps.type !== this.props.type) {
      this.setState(initialState);
    }
  }

  render() {
    const { classes, type } = this.props;

    return (
      <form
        className={classes.container}
        onKeyDown={this.handleKeyDown}
        noValidate
        autoComplete="off"
      >
        <FormControl error={this.state.error} className={classes.input}>
          <InputLabel htmlFor="adornment-login">Login</InputLabel>
          <Input
            id="standard-multiline-flexible"
            label="Login"
            value={this.state.login}
            onChange={this.handleChange('login')}
            fullWidth
          />
        </FormControl>
        <FormControl error={this.state.error} className={classes.input}>
          <InputLabel htmlFor="adornment-password">Password</InputLabel>
          <Input
            id="adornment-password"
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            fullWidth
            onChange={this.handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                >
                  {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button variant="outlined" fullWidth className={classes.button} onClick={this.handleLogin}>
          {type === 'signIn' ? 'Login' : 'Create account'}
        </Button>
      </form>
    );
  }
}

export default compose(
  withStyles(styles),
  withRouter,
)(LoginPasswordForm);
