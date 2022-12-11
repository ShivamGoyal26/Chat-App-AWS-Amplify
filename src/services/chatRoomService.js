import {API, graphqlOperation, Auth} from 'aws-amplify';

export const getCommonChatRoom = async userID => {
  // get current user
  const authUser = await Auth.currentAuthenticatedUser();
  // get all chatrooms of current user
  const myChatRooms = await API.graphql(
    graphqlOperation(listChatRooms, {
      id: authUser.attributes.sub,
    }),
  );

  let myChats = myChatRooms?.data?.getUser?.ChatRooms?.items || [];
  const chatRoom = myChats.find(item => {
    return item.chatRoom.users.items.some(user => user.user.id === userID);
  });
  if (chatRoom) {
    return chatRoom;
  }
  return false;
};

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
