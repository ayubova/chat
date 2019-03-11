import { formatMessages } from './utils';

// apiEndpoints
export const GET_ALL_MESSAGES = '/messages';
export const PUBLISH_MESSAGE = '/publish';
export const LOGIN = '/login';
export const LOGOUT = '/logout';
export const GET_USER = '/user';

// requests
export const publishMessage = message => fetch(PUBLISH_MESSAGE, { method: 'POST', body: message });

export const getAllMessages = () =>
  fetch('/messages')
    .then(res => res.json())
    .then(messages => formatMessages(messages));

export const login = (login, password) =>
  fetch(LOGIN, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  }).then(res => res.json());

export const logout = () => fetch(LOGOUT);

export const getUser = () => fetch(GET_USER).then(res => res.json());
