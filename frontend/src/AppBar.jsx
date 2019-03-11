import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBarMui from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';

import { logout } from './api';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  loginButton: {
    backgroundColor: '#e0e0e0',
  },
};

class AppBar extends React.Component {
  handleLogout = () => {
    logout();
    this.props.history.push('/login');
  };

  render() {
    const { classes, location } = this.props;
    return (
      <div className={classes.root}>
        <AppBarMui position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Chat
            </Typography>
            {location.pathname === '/' && (
              <Button className={classes.loginButton} onClick={this.handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBarMui>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(AppBar));
