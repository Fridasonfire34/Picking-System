/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {Button} from 'native-base';
import {ActivityIndicator, Text, TextInput, View} from 'react-native';
import axios from 'axios';
import {server} from '../utils/server';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTENCE_KEY = 'USER_STATE';

const SignInScreen = ({navigation}) => {
  const passwordRef = useRef();

  const [userSession, setUserSession] = useState({
    id: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = () => {
    if (userSession.id === '' || userSession.password === '') {
      setError('User and Password are required');
      return;
    } else {
      setLoading(true);
      const params = {
        user: userSession.id,
        password: userSession.password,
        from: 'mobile',
      };
      axios(`${server()}/api/auth/session`, {params})
        .then(res => {
          const user = res.data;
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(user));
          setError('');
          navigation.push('Home');
          setUserSession({id: '', password: ''});
        })
        .catch(err => setError(err.response?.data?.message))
        .finally(() => setLoading(false));
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', margin: 20}}>
      <Text style={{fontSize: 20}}>Sign In</Text>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>User</Text>
        <TextInput
          autoFocus
          style={{borderBottomWidth: 0.5, marginBottom: 25}}
          placeholder="000XXX"
          keyboardType="number-pad"
          value={userSession.id}
          onChangeText={id => setUserSession({...userSession, id})}
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current.focus()}
        />
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Password</Text>
        <TextInput
          ref={passwordRef}
          style={{borderBottomWidth: 0.5}}
          placeholder="******"
          secureTextEntry
          value={userSession.password}
          onChangeText={password => setUserSession({...userSession, password})}
          onSubmitEditing={handleSignIn}
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
