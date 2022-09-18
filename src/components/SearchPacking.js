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
  StyleSheet,
} from 'react-native';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {LOCAL_IP} from '../utils/server';

const SearchPacking = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [partNumber, setPartNumber] = useState('');

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const route = useRoute();
  const {packingId} = route.params;

  useEffect(() => {
    setLoading(true);
    fetch(`${LOCAL_IP}/api/consult-packing?id=${packingId}`)
      .then(res => res.json())
      .then(res => {
        if (res.length) {
          const filtered = res.filter(value => Number(value.qty) > 0);
          setData(filtered);
        } else {
          setData([]);
        }
      })
      .catch(err => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [packingId, isFocused]);

  const handleSearch = () => {
    if (partNumber.length > 0) {
      navigation?.push('SearchPart', {packingId, partNumber});
      setPartNumber('');
    } else {
      Alert.alert('Error', 'Ingrese un numero de packing');
    }
  };

  const handlePress = itemNumber => {
    if (itemNumber.length > 0) {
      navigation?.push('SearchPart', {packingId, partNumber: itemNumber});
    } else {
      Alert.alert('Error', 'Part number incorrecto');
    }
  };

  const handleCreateReport = () => {
    Alert.alert('Mensaje', 'Esta operación generara un reporte', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'Continuar', onPress: () => handleParseReport()},
    ]);
  };

  const handleParseReport = () => {
    navigation?.push('ReadPDF', {packingId, data});
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
              <Button title="Escanear" />
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
              <ScrollView contentContainerStyle={{paddingBottom: '80%'}}>
                {data.map((item, index) => {
                  return (
                    <View key={index} style={{padding: 10}}>
                      <TouchableOpacity
                        onPress={() => handlePress(item.partnumber)}>
                        <Text style={{fontWeight: 'bold'}}>
                          ID: {index + 1}
                        </Text>
                        <Text style={styles.text}>
                          Part Number: {item.partnumber}
                        </Text>
                        <Text style={styles.text}>
                          Build Sequence: {item.buildsequence}
                        </Text>
                        <Text style={styles.text}>
                          Balloon Number: {item.balloonnumber ?? '-'}
                        </Text>
                        <Text style={styles.text}>QTY: {item.qty}</Text>
                        <Text style={styles.text}>PONo: {item.pono}</Text>
                        <Text style={styles.text}>
                          Vender No: {item.vendorno}
                        </Text>
                        <Text style={styles.text}>
                          Packing ID: {item.packingdiskno}
                        </Text>
                        <Text style={styles.text}>Linea: {item.linea}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <View style={{marginVertical: 5}}>
                  <Button title="Finalizar" onPress={handleCreateReport} />
                </View>
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

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
});
export default SearchPacking;
