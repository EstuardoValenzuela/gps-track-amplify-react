/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGpsdb = /* GraphQL */ `
  mutation CreateGpsdb(
    $input: CreateGpsdbInput!
    $condition: ModelGpsdbConditionInput
  ) {
    createGpsdb(input: $input, condition: $condition) {
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
export const updateGpsdb = /* GraphQL */ `
  mutation UpdateGpsdb(
    $input: UpdateGpsdbInput!
    $condition: ModelGpsdbConditionInput
  ) {
    updateGpsdb(input: $input, condition: $condition) {
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
export const deleteGpsdb = /* GraphQL */ `
  mutation DeleteGpsdb(
    $input: DeleteGpsdbInput!
    $condition: ModelGpsdbConditionInput
  ) {
    deleteGpsdb(input: $input, condition: $condition) {
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
