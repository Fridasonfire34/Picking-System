/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {Button, ScrollView} from 'native-base';
import {ActivityIndicator, Text, TextInput, View,Image,StyleSheet,ImageBackground} from 'react-native';
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
  const itop = require ("./assets/loginicon.png");

  const handleSignIn = () => {
    if (userSession.id === '' || userSession.password === '') {
      setError('El número de empleado y código de acceso son requeridos');
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
    <ScrollView>
      <View style={{alignItems:'center'}}><Image source={itop} style={styles.topimage}></Image></View>
    <View style={{flex: 1, 
    justifyContent: 'center', 
    margin: 15}}>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 18,
        fontFamily:'Gayathri-Bold', 
        marginLeft:15,
        color:'black',}}>Número de empleado</Text>
        <TextInput
          autoFocus={true}
          style={{marginLeft:15,
            marginRight:30,
            fontSize:14, 
            borderColor: '#dcdcdc',
            backgroundColor:'#dcdcdc', 
            marginVertical: 10, 
            paddingBottom:15,
            paddingLeft:15}}
          keyboardType="number-pad"
          value={userSession.id}
          onChangeText={id => setUserSession({...userSession, id})}
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current.focus()}
        />
        <Text style={{fontSize: 18, 
        color:'black',
        fontFamily:'Gayathri-Bold',
        marginLeft:15}}>Código de autorización</Text>
        <TextInput
          ref={passwordRef}
          style={{marginLeft:15,
            color:'black',
            marginRight:30,
            fontSize:15,
            borderColor: '#dcdcdc',
            backgroundColor:'#dcdcdc', 
            marginVertical: 10, 
            paddingBottom:15,
            paddingLeft:20}}
          secureTextEntry
          value={userSession.password}
          onChangeText={password => setUserSession({...userSession, password})}
          onSubmitEditing={handleSignIn}
        />
        <Button
        background='darkBlue.600'
          style={{marginTop: 40}}
          disabled={loading}
          onPress={handleSignIn}>
          {loading ? <ActivityIndicator color="white" /> : 'Entrar'}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topimage:{
    //justifyContent:'center',
    //alignItems:'center',
    marginTop:15,
    width:120,
    height:120
  },
});

export default SignInScreen;
