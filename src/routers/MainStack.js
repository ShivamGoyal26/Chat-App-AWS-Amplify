import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import ContactScreen from '../screens/ContactScreen';
import ChatRoom from '../screens/ChatRoom';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Pets"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ContactScreen" component={ContactScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
      </Stack.Navigator>
    </>
  );
};

export default MainStack;
