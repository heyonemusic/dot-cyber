import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import AppRouter from './router';

import './style/main.css';
import './image/favicon.ico';

const root = document.getElementById('root');

const getHeaders = token => {
  const headers = {
    'content-type': 'application/json',
    'x-hasura-admin-secret': 'token',
    authorization: token ? `Bearer ${token}` : '',
  };
  return headers;
};

const httpLink = new HttpLink({
  uri: 'https://titan.cybernode.ai/graphql/v1/graphql',
  headers: {
    'content-type': 'application/json',
    authorization: '',
  },
});

const wsLink = new WebSocketLink({
  uri: `wss://titan.cybernode.ai/graphql/v1/graphql`,
  options: {
    reconnect: true,
  },
  headers: {
    'content-type': 'application/json',
    authorization: '',
  },
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const link = ApolloLink.from([terminatingLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

// const client = new ApolloClient({
//   uri: 'https://titan.cybernode.ai/graphql/v1/graphql', //URL of the GraphQL server
//   request: operation => {
//     const token = localStorage.getItem('token');
//     operation.setContext({
//       headers: getHeaders(token),
//     });
//   },
// });

const render = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <AppContainer>
        <AppRouter />
      </AppContainer>
    </ApolloProvider>,
    root
  );
};

render(AppRouter);

if (module.hot) {
  module.hot.accept('./router', () => {
    render(AppRouter);
  });
}
