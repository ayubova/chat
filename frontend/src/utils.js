import moment from 'moment';

export const formatDateTime = dateTime => moment(dateTime).format('MMMM Do YYYY, h:mm:ss a');

export const formatMessages = messages =>
  messages
    .map(message => ({
      ...message,
      time: formatDateTime(message.time),
    }))
    .reverse();
