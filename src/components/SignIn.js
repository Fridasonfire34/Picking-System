/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Button} from 'native-base';
import {ActivityIndicator, Text, TextInput, View} from 'react-native';
import axios from 'axios';
import {server} from '../utils/server';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTENCE_KEY = 'USER_STATE';

const SignInScreen = ({navigation}) => {
  const [userSession, setUserSession] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = () => {
    setLoading(true);

    const params = {
      user: userSession.email,
      password: userSession.password,
    };

    axios(`${server()}/api/auth/session`, {params})
      .then(res => {
        const user = res.data;
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(user));
        setError('');
        navigation.push('Home');
      })
      .catch(err => setError(err.response?.data?.message))
      .finally(() => setLoading(false));
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', margin: 20}}>
      <Text style={{fontSize: 20}}>Sign In</Text>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>User</Text>
        <TextInput
          style={{borderBottomWidth: 0.5, marginBottom: 25}}
          placeholder="user@mail.com"
          keyboardType="email-address"
          value={userSession.email}
          onChangeText={email => setUserSession({...userSession, email})}
        />
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Password</Text>
        <TextInput
          style={{borderBottomWidth: 0.5}}
          placeholder="******"
          secureTextEntry
          value={userSession.password}
          onChangeText={password => setUserSession({...userSession, password})}
        />
        <Button
          style={{marginTop: 40}}
          disabled={loading}
          onPress={handleSignIn}>
          {loading ? <ActivityIndicator color="white" /> : ' Sign In'}
        </Button>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 20,
            color: 'red',
          }}>
          {error}
        </Text>
      </View>
    </View>
  );
};

export default SignInScreen;
