import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import TableLink from './tableLink';

// const GET_CHARACTERS = gql`
//   query MyQuery($agent: String) {
//     link_aggregate(where: { agent: { _eq: $agent } }) {
//       nodes {
//         transaction
//         timestamp
//         height
//         cid_to
//         cid_from
//         agent
//       }
//     }
//   }
// `;

export default function GetLink({ accountUser }) {
  const GET_CHARACTERS = gql`
  query MyQuery {
    link_aggregate(where: { agent: { _eq: "${accountUser}" } }) {
      nodes {
        transaction
        timestamp
        height
        cid_to
        cid_from
        agent
      }
    }
  }
`;
  const { loading, error, data: dataLink } = useQuery(GET_CHARACTERS);
  if (loading) {
    return 'Loading...';
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  return <TableLink data={dataLink.link_aggregate.nodes} />;
}