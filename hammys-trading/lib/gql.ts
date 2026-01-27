// Minimal GraphQL strings so you don't need amplify codegen for MVP.

export const listInventoryItems = /* GraphQL */ `
  query ListInventoryItems($filter: ModelInventoryItemFilterInput, $limit: Int) {
    listInventoryItems(filter: $filter, limit: $limit) {
      items {
        id
        name
        set
        year
        condition
        gradeCompany
        grade
        priceCents
        quantity
        status
        tags
        imageKeys
        createdAt
      }
    }
  }
`;

export const getInventoryItem = /* GraphQL */ `
  query GetInventoryItem($id: ID!) {
    getInventoryItem(id: $id) {
      id
      name
      set
      year
      condition
      gradeCompany
      grade
      priceCents
      quantity
      status
      tags
      imageKeys
      createdAt
    }
  }
`;

export const createOrder = /* GraphQL */ `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      stripeSessionId
      status
      amountTotalCents
      createdAt
    }
  }
`;

export const updateInventoryItem = /* GraphQL */ `
  mutation UpdateInventoryItem($input: UpdateInventoryItemInput!) {
    updateInventoryItem(input: $input) {
      id
      quantity
      status
    }
  }
`;

