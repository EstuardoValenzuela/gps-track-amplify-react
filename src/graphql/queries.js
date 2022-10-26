/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGpsdb = /* GraphQL */ `
  query GetGpsdb($id: ID!) {
    getGpsdb(id: $id) {
      id
      updatedAt
      deviceID
      lat
      long
      travelID
      createdAt
    }
  }
`;
export const listGpsdbs = /* GraphQL */ `
  query ListGpsdbs(
    $filter: ModelGpsdbFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGpsdbs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        updatedAt
        deviceID
        lat
        long
        travelID
        createdAt
      }
      nextToken
    }
  }
`;
