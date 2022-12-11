import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {API, Auth, graphqlOperation} from 'aws-amplify';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import Header from '../components/Header';
import {getCommonChatRoom} from '../services/chatRoomService';

const ContactScreen = props => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    getAllUsers();
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setId(user.attributes.sub);
    } catch (error) {
      console.log('>> error', error);
    }
  };

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const users = await API.graphql(graphqlOperation(queries.listUsers));
      if (users?.data?.listUsers?.items?.length) {
        setData(users?.data?.listUsers?.items);
      } else {
        Alert.alert('No Departments Found!');
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

  const createChatRoom = async (clicked_user_id, name) => {
    const result = await getCommonChatRoom(clicked_user_id);

    if (result) {
      props.navigation.navigate('ChatRoom', {
        chat_room: result.chatRoom,
        name: name,
      });
    } else {
      // check if we have already chat room with clicked user
      // create a new chat room
      const newChatRoomData = await API.graphql(
        graphqlOperation(mutations.createChatRoom, {input: {}}),
      );

      let newChatRoom = newChatRoomData.data.createChatRoom;

      // add the clicked user in the chat room

      await API.graphql(
        graphqlOperation(mutations.createUserChatRoom, {
          input: {
            chatRoomId: newChatRoom.id,
            userId: clicked_user_id,
          },
        }),
      );
      // add the auth user in the chat room
      await API.graphql(
        graphqlOperation(mutations.createUserChatRoom, {
          input: {
            chatRoomId: newChatRoom.id,
            userId: id,
          },
        }),
      );
      // navigate to the created chat room
      props.navigation.navigate('ChatRoom', {
        chat_room: newChatRoom,
        name: name,
      });
    }
  };

  const renderItem = ({item}) => {
    if (item.id !== id) {
      return (
        <TouchableOpacity
          onPress={() => createChatRoom(item.id, item.name)}
          style={styles.item}>
          <View style={styles.avatar} />
          <View style={{flex: 1}}>
            <Text>{item.name}</Text>
            <Text numberOfLines={1}>{item.status}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screen}>
        <Header title="My Contacts" action={() => props.navigation.goBack()} />
        <FlatList
          ListHeaderComponent={() => (loading ? <ActivityIndicator /> : null)}
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
  item: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactScreen;
