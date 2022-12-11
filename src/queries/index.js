export const listChatRooms = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      ChatRooms {
        items {
          chatRoom {
            createdAt
            id
            users {
              items {
                user {
                  id
                  image
                  name
                }
              }
            }
            LastMessage {
              text
              id
              createdAt
            }
          }
        }
      }
    }
  }
`;
