import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FaceIcon from '@material-ui/icons/Face';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import InputAdornment from '@material-ui/core/InputAdornment';

import AuthContext from './context';

import { publishMessage, getAllMessages } from './api';
import { formatDateTime } from './utils';

const styles = theme => ({
  container: {
    margin: 'auto',
    display: 'flex',
    alignItems: 'baseline',
    width: 600,
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 600,
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 4,
  },
  messages: {
    margin: 'auto',
    width: 600,
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
    wordBreak: 'break-word',
  },
  messageTitle: {
    display: 'block',
    marginRight: 16,
    fontSize: 12,
  },
});

class Chat extends React.Component {
  static contextType = AuthContext;
  state = { newMessage: '', messages: [] };

  componentDidMount() {
    getAllMessages().then(messages => this.setState({ messages }));
    const subscribe = () => {
      fetch('/subscribe')
        .then(response => response.json())
        .then(({ message, user, time }) => {
          const newMessage = {
            message,
            user,
            time: formatDateTime(time),
          };
          this.setState({
            messages: [newMessage, ...this.state.messages],
          });
          subscribe();
        })
        .catch(() => setTimeout(subscribe, 500));
    };
    subscribe();
  }

  handleChange = event => this.setState({ newMessage: event.target.value });

  handlePublish = () => {
    publishMessage(this.state.newMessage);
    this.setState({ newMessage: '' });
  };

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.state.newMessage.length > 0) {
        this.handlePublish();
      }
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <form
          onKeyDown={this.handleKeyDown}
          className={classes.container}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="standard-multiline-flexible"
            multiline
            rowsMax="4"
            value={this.state.newMessage}
            onChange={this.handleChange}
            className={classes.textField}
            margin="normal"
            placeholder="Write a message ..."
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disabled={this.state.newMessage.length === 0}
                    onClick={this.handlePublish}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        <div className={classes.messages}>
          <List className={classes.root}>
            {this.state.messages.map(({ message, user, time }, i) => (
              <ListItem key={i} alignItems="flex-start">
                <ListItemIcon>
                  <FaceIcon />
                </ListItemIcon>
                <ListItemText
                  secondary={
                    <Fragment>
                      <Typography
                        component="span"
                        className={classes.messageTitle}
                        color="textPrimary"
                      >
                        {`${user}, ${time}`}
                      </Typography>
                      {message}
                    </Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withWidth()(Chat));
