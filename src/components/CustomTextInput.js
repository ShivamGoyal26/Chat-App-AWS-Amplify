import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';

import * as mutations from '../graphql/mutations';

const CustomTextInput = props => {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    const newMessage = {
      chatroomID: props.chat_room.id,
      text: message,
      userID: props.user_id,
    };
    const newCreatedMessage = await API.graphql(
      graphqlOperation(mutations.createMessage, {input: newMessage}),
    );
    setMessage('');

    // update the last message in the room
    await API.graphql(
      graphqlOperation(mutations.updateChatRoom, {
        input: {
          chatRoomLastMessageId: newCreatedMessage.data.createMessage.id,
          id: props.chat_room.id,
        },
      }),
    );
  };

  return (
    <View style={styles.screen}>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
      />
      <TouchableOpacity onPress={sendMessage}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CustomTextInput;
