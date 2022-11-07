/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Text,
  TextInput,
  View,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const [packingId, setPackingId] = useState('');
  const [hasPermissionStore, setHasPermissionStorage] = useState(false);

  const navigation = useNavigation();

  const handleSearch = () => {
    if (packingId.length > 0) {
      navigation?.push('SearchPacking', {packingId});
      setPackingId('');
    } else {
      Alert.alert('Error', 'Ingrese un numero de packing');
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
    <View
      style={{
        padding: 10,
        width: '100%',
        height: '100%',
        flexGrow: 1,
        justifyContent: 'center',
      }}>
      <View>
        <Text style={{fontSize: 15, fontWeight: 'bold', marginVertical: 10}}>
          TMP Picking System
        </Text>
        <TextInput
          placeholder="Packing ID"
          keyboardType="numeric"
          style={{borderWidth: 1, borderColor: '#bdbdbd', marginVertical: 10}}
          value={packingId}
          onChangeText={text => setPackingId(text)}
          editable={hasPermissionStore}
        />
        <Button
          title="Buscar"
          onPress={handleSearch}
          disabled={!hasPermissionStore}
        />
      </View>
    </View>
  );
};

export default Home;
