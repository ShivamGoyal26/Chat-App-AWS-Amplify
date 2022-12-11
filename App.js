import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {Amplify, Auth} from 'aws-amplify';
import config from './src/aws-exports';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {Hub} from 'aws-amplify';
import {API, graphqlOperation} from 'aws-amplify';
import * as mutations from './src/graphql/mutations';
import * as queries from './src/graphql/queries';

import MainStack from './src/routers/MainStack';

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const App = props => {
  useEffect(() => {
    const syncUser = async () => {
      // get auth user
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      // query the database using the user id (sub)
      const user = await API.graphql(
        graphqlOperation(queries.getUser, {id: authUser.attributes.sub}),
      );
      // if there is no user create one
      if (!user.data.getUser) {
        const newUSER = {
          id: authUser.attributes.sub,
          name: authUser.attributes.email,
          status: 'Hey, i am using chat bud',
        };
        const newUser = await API.graphql(
          graphqlOperation(mutations.createUser, {
            input: newUSER,
          }),
        );
      }
    };
    syncUser();
  }, []);

  useEffect(() => {
    Hub.listen('auth', data => {
      switch (data.payload.event) {
        case 'signIn':
          console.log('user signed in');
          break;
        case 'signUp':
          console.log('user signed up');
          break;
        case 'signOut':
          console.log('user signed out');
          break;
        case 'signIn_failure':
          console.log('user sign in failed');
          break;
        case 'configured':
          console.log('the Auth module is configured');
      }
    });
  }, []);

  const resendConfirmationCode = async () => {
    try {
      const res = await Auth.resendSignUp('skgvlogs126');
      console.log('code resent successfully', res);
    } catch (err) {
      console.log('error resending code: ', err);
    }
  };
  const confirmEmail = async () => {
    try {
      const res = await Auth.confirmSignUp('rahul@yopmail.com', '581398');
      console.log(res);
    } catch (error) {
      console.log('Error', error);
    }
  };
  const signUpManager = async () => {
    console.log('sign up calling');
    try {
      const res = await Auth.signUp({
        username: 'rahul@yopmail.com',
        password: 'MYlosangeles1!',
        attributes: {
          // address: '105 Main St. New York, NY 10001',
          // family_name: 'Goyal',
          phone_number: '+918727842918',
          // name: 'shivam',
        },
      });
      console.log('>>>RED', res);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user.signInUserSession.accessToken.jwtToken);
      // console.log('attributes:', user.attributes);
    } catch (error) {
      console.log('>> error', error);
    }
  };

  const signIn = async () => {
    try {
      const res = await Auth.signIn('rahul@yopmail.com', 'MYlosangeles1!');
      console.log(res);
      // console.log('>>>>>', res);
    } catch (error) {
      console.log('>>Error', error);
    }
  };

  const changePassword = async () => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(user, 'mycoolpassword', 'MYlosangeles1!');
      })
      .then(data => console.log('Success', data))
      .catch(err => console.log('Error', err));
  };

  const updateUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const res = await Auth.updateUserAttributes(user, {
        phone_number: '+911234567890',
      });
      console.log(res);
    } catch (error) {
      console.log('>>>', error);
    }
  };

  const forgotPassword = async () => {
    Auth.forgotPassword('someuser@yopmail.com')
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  const verifyForgotPassword = async () => {
    // Collect confirmation code and new password, then
    Auth.forgotPasswordSubmit('someuser@yopmail.com', '147471', 'shivamgoyal')
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  const retrieveCurrentSession = () => {
    Auth.currentSession()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  const signout = async () => {
    try {
      const res = await Auth.signOut();
      // console.log('>>>', res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      // signUpManager();
      // resendConfirmationCode();
      // confirmEmail();
      // getUserInfo();
      // signIn();
      // updateUser();
      // changePassword();
      // forgotPassword();
      // verifyForgotPassword();
      // retrieveCurrentSession();
      // signout();
    }, 0);
  }, []);

  return (
    <NavigationContainer theme={DarkTheme}>
      <MainStack />
    </NavigationContainer>
  );
};

export default App;
