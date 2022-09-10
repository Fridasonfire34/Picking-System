/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Fab, Icon, SearchIcon} from 'native-base';
import {LOCAL_IP} from '../utils/server';

const SearchPacking = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [partNumber, setPartNumber] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const {packingId} = route.params;

  useEffect(() => {
    setLoading(true);
    fetch(`${LOCAL_IP}/api/consult-packing?id=${packingId}`)
      .then(res => res.json())
      .then(res => {
        if (res.length) {
          setData(res);
        } else {
          setData([]);
        }
      })
      .catch(err => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [packingId]);

  const handleSearch = () => {
    if (partNumber.length > 0) {
      navigation.push('SearchPart', {packingId, partNumber});
      setPartNumber('');
    } else {
      Alert.alert('Error', 'Ingrese un numero de packing');
    }
  };

  const handlePress = itemNumber => {
    if (itemNumber.length > 0) {
      navigation.push('SearchPart', {packingId, partNumber: itemNumber});
    } else {
      Alert.alert('Error', 'Part number incorrecto');
    }
  };

  if (error) {
    return (
      <View>
        <Text>Existe un error</Text>
      </View>
    );
  }

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {data.length > 0 ? (
            <View style={{margin: 10}}>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginVertical: 10,
                }}>
                <TextInput
                  placeholder="Part Number"
                  style={{flex: 1, borderWidth: 0.5}}
                  value={partNumber}
                  onChangeText={text => setPartNumber(text)}
                />
                <Button title="Buscar" onPress={handleSearch} />
              </View>
              <Text style={{fontWeight: 'bold'}}>
                Resultados encontrados: {data.length}
              </Text>
              <ScrollView contentContainerStyle={{paddingBottom: '45%'}}>
                {data.map((item, index) => {
                  return (
                    <View key={index} style={{padding: 10}}>
                      <TouchableOpacity
                        onPress={() => handlePress(item.partnumber)}>
                        <Text style={{fontWeight: 'bold'}}>
                          ID: {index + 1}
                        </Text>
                        <Text>Part Number: {item.partnumber}</Text>
                        <Text>Build Sequence: {item.buildsequence}</Text>
                        <Text>Balloon Number: {item.balloonnumber ?? '-'}</Text>
                        <Text>QTY: {item.qty}</Text>
                        <Text>PONo: {item.pono}</Text>
                        <Text>Vender No: {item.vendorno}</Text>
                        <Text>Packing ID: {item.packingdiskno}</Text>
                        <Text>Linea: {item.linea}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ) : (
            <View>
              <Text>No hay datos que coincidan con el ID</Text>
            </View>
          )}
        </>
      )}
      <Fab position="absolute" size="sm" icon={<SearchIcon />} />
    </View>
  );
};

export default SearchPacking;
