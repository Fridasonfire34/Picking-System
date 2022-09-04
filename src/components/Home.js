/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Alert, Button, Text, TextInput, View} from 'react-native';

const Home = () => {
  const [packingId, setPackingId] = useState('');

  const handleSearch = () => {
    if (packingId.length > 0) {
    } else {
      Alert.alert('Error', 'Ingrese un numero de packing');
    }
  };

  const handleSearchBarcode = () => {};

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
          style={{borderWidth: 1, borderColor: '#bdbdbd', marginVertical: 10}}
          onChangeText={text => setPackingId(text)}
        />
        <Button title="Buscar" onPress={handleSearch} />
        <Text style={{textAlign: 'center', marginVertical: 10, fontSize: 15}}>
          o
        </Text>
        <Button title="Escanear código" onPress={handleSearchBarcode} />
      </View>
    </View>
  );
};

export default Home;
