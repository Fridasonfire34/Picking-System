/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

const LOCAL_IP = 'http://192.168.1.76:3000';

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [packingId, setPackingId] = useState('');

  const route = useRoute();
  const {packingId: id} = route.params;

  useEffect(() => {
    setLoading(true);
    fetch(`${LOCAL_IP}/api/consult-report?id=${id}`)
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
  }, [id]);

  const handleSearch = () => {
    if (packingId.length > 0) {
      if (data.length > 0) {
        const filter = data.filter(d => d.packingdiskno.includes(packingId));
        setData(filter);
      } else {
        Alert.alert('No hay datos');
      }
    } else {
      Alert.alert('Error', 'Ingrese un numero de packing');
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
                  placeholder="Packing ID"
                  style={{flex: 1, borderWidth: 0.5}}
                  onChangeText={text => setPackingId(text)}
                />
                <Button title="Buscar" onPress={handleSearch} />
              </View>
              <Text style={{fontWeight: 'bold'}}>
                Resultados encontrados: {data.length}
              </Text>
              <ScrollView contentContainerStyle={{paddingBottom: 200}}>
                {data.map((item, index) => {
                  return (
                    <View key={index} style={{padding: 10}}>
                      <Text>Part Number: {item.partnumber}</Text>
                      <Text>Build Sequence: {item.buildsequence}</Text>
                      <Text>Balloon Number: {item.balloonnumber ?? '-'}</Text>
                      <Text>QTY: {item.qty}</Text>
                      <Text>PONo: {item.pono}</Text>
                      <Text>Vender No: {item.vendorno}</Text>
                      <Text>Packing ID: {item.packingdiskno}</Text>
                      <Text>Linea: {item.linea}</Text>
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
    </View>
  );
};

export default Home;
