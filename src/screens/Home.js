import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {API, Auth, graphqlOperation} from 'aws-amplify';
import {useFocusEffect} from '@react-navigation/native';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

import Header from '../components/Header';
import {listChatRooms} from '../queries';

const Home = props => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      getAllChats();
    }, []),
  );

  const getAllChats = async () => {
    try {
      setLoading(true);
      const user = await Auth.currentAuthenticatedUser();
      setUser(user.attributes);
      const chatRooms = await API.graphql(
        graphqlOperation(listChatRooms, {id: user.attributes.sub}),
      );
      if (chatRooms?.data?.getUser?.ChatRooms?.items?.length) {
        setData(chatRooms.data.getUser.ChatRooms.items);
      } else {
        Alert.alert('No Chats Found!');
        setData([]);
      }
    } catch (error) {
      console.log('Erro', error);
      setData([]);
      if (error?.errors) {
        Alert.alert(error.errors[0].message);
      } else {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    let mainUser = item.chatRoom.users.items.filter(
      item => item.user.id !== user.sub,
    )[0];
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('ChatRoom', {
            chat_room: item.chatRoom,
            name: mainUser.user.name,
          });
        }}
        style={{padding: 20, flexDirection: 'row'}}>
        {mainUser.user.image ? (
          <View />
        ) : (
          <View style={styles.avatar}>
            <Text>{mainUser.user.name[0]}</Text>
          </View>
        )}
        <View>
          <Text>{mainUser.user.name}</Text>
          {item.chatRoom.LastMessage ? (
            <Text>{item.chatRoom.LastMessage.text}</Text>
          ) : null}
          <Text>
            {dayjs(
              item.chatRoom.LastMessage
                ? item?.chatRoom?.LastMessage.createdAt
                : item.chatRoom.createdAt,
            ).fromNow(true)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screen}>
        <Header title="My Chats" />
        {user ? <Text>{user.email}</Text> : null}
        <TouchableOpacity
          onPress={() => props.navigation.navigate('ContactScreen')}>
          <Text>Contacts</Text>
        </TouchableOpacity>
        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
