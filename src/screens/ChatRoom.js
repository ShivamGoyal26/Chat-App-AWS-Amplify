import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {API, Auth, graphqlOperation} from 'aws-amplify';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as queries from '../graphql/queries';
import Header from '../components/Header';
import CustomTextInput from '../components/CustomTextInput';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

const ChatRoom = props => {
  const name = props.route.params.name;
  const chat_room = props.route.params.chat_room;
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const user = await Auth.currentAuthenticatedUser();
    setUser(user.attributes);
  };

  useEffect(() => {
    if (chat_room) {
      getAllMessages();
    }
  }, [chat_room]);

  const getAllMessages = async () => {
    const allMessages = await API.graphql(
      graphqlOperation(queries.getChatRoom, {id: chat_room.id}),
    );
    setMessages(allMessages?.data?.getChatRoom?.Messages?.items || []);
  };

  const renderItem = ({item}) => {
    console.log(item, user.sub);
    return (
      <View
        style={{
          alignSelf: item.userID === user.sub ? 'flex-end' : 'flex-start',
          padding: 10,
          maxWidth: '70%',
        }}>
        <Text>{item.text}</Text>
        <Text style={{fontSize: 10}}>
          {dayjs(item.createdAt).fromNow(true)}
        </Text>
      </View>
    );
  };

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screen}>
        <Header title={name} action={() => props.navigation.goBack()} />

        <FlatList
          data={messages}
          ListEmptyComponent={() => <Text>No Messages Found!</Text>}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
        <CustomTextInput user_id={user?.sub} chat_room={chat_room} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ChatRoom;
