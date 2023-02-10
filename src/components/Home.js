/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Text,
  TextInput,
  ImageBackground,
  Image,
  View,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Layout from './System/Layout';

const Home = () => {
  const [packingId, setPackingId] = useState('');
  const [hasPermissionStore, setHasPermissionStorage] = useState(false);
  const itop = require("./assets/tmplogo.png");
  const bckimg = require("./assets/fondosrch.jpg");

  const navigation = useNavigation();

  const handleSearch = () => {
    if (packingId.length > 0) {
      navigation?.push('SearchPacking', {packingId});
      setPackingId('');
    } else {
      Alert.alert('Error', 'Ingrese un número válido');
    }
  };

  useEffect(() => {
    (async () => {
      const resultStorage = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      const isGrantedStore =
        resultStorage[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
          'granted' &&
        resultStorage[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
          'granted';

      setHasPermissionStorage(isGrantedStore);
    })();
  }, []);

  return (
    <Layout>
      <ImageBackground source={bckimg} resizeMode="stretch">
      <View style={{alignItems:'center'}}><Image source={itop} style={styles.topimage}></Image>
    <View
      style={{
        padding: 10,
        width: '100%',
        height: '100%',
        flexGrow: 1,
        //justifyContent: 'center',
      }}>
      <View>
        <Text style={{fontSize: 37,
        fontFamily:'Gayathri-Regular',
        color:'black',
        marginTop:10,
          textAlign:'center'}}>
          Picking System
        </Text>
        </View>
        <View style={{paddingLeft:20, paddingRight:20, marginTop:10}}>
        <TextInput
        autoFocus={true}
          placeholder="Packing ID"
          keyboardType="numeric"
          style={{borderWidth: 1,
            color:'black',
            fontSize:15, 
            borderColor: '#dcdcdc',
            backgroundColor:'#dcdcdc', 
            marginVertical: 15, 
            paddingBottom:15,
            paddingLeft:10}}
          value={packingId}
          onSubmitEditing={handleSearch}
          onChangeText={text => setPackingId(text)}
          editable={hasPermissionStore}
        />
        <Button
        color="blue"
          title="Buscar"
          onPress={handleSearch}
          disabled={!hasPermissionStore}
        />
        </View>
      </View>
    </View>
    </ImageBackground>
    </Layout>
  );
};

const styles = StyleSheet.create({
  topimage:{
    width:200,
    height:80
  },
});

export default Home;
