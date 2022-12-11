import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const Header = props => {
  return (
    <View style={styles.screen}>
      {props.action ? (
        <TouchableOpacity onPress={props.action}>
          <Image
            source={require('../assets/back.png')}
            style={styles.icon}
            resizeMethod="auto"
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <Text style={styles.title}>{props.title}</Text>
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFBF00',
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    height: 20,
    width: 20,
  },
  title: {
    fontSize: 15,
    color: 'black',
  },
});

export default Header;
