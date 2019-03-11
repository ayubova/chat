import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import LoginPasswordForm from './LoginPasswordForm';

const styles = () => ({
  container: {
    width: '250px',
    margin: 'auto',
    height: '48px',
    marginTop: '48px',
  },
  tab: {
    width: '125px',
    minWidth: '125px',
  },
});

class Login extends React.Component {
  state = { tabIndex: 0 };

  handleChange = (event, tabIndex) => this.setState({ tabIndex });

  render() {
    const { classes } = this.props;
    const { tabIndex } = this.state;
    return (
      <Fragment>
        <div position="static" className={classes.container}>
          <Tabs
            value={this.state.tabIndex}
            onChange={this.handleChange}
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab className={classes.tab} label="Sign in" />
            <Tab className={classes.tab} label="Sign up" />
          </Tabs>
        </div>
        {tabIndex === 0 ? <LoginPasswordForm type="signIn" /> : <LoginPasswordForm type="signUp" />}
      </Fragment>
    );
  }
}

export default withStyles(styles)(Login);
