/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useState} from 'react';
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
  Modal,
  Vibration,
} from 'react-native';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {LOCAL_IP} from '../utils/server';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {BarcodeFormat, scanBarcodes} from 'vision-camera-code-scanner';
import * as REA from 'react-native-reanimated';

const SearchPacking = () => {
  global.__reanimatedWorkletInit = () => {};
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [partNumber, setPartNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [readyToScan, setReadyToScan] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const {packingId} = route.params;

  const devices = useCameraDevices();
  const device = useMemo(() => {
    return devices.back;
  }, [devices]);

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

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  useEffect(() => {
    if (barcode.length > 0) {
      Vibration.vibrate();
      setReadyToScan(false);
      Alert.alert('Código encontrado', barcode, [
        {
          text: 'Cancelar',
          onPress: () => setBarcode(''),
          style: 'cancel',
        },
        {
          text: 'Mostrar Coincidencias',
          onPress: () =>
            navigation?.push('SearchPart', {packingId, partNumber: barcode}),
        },
      ]);
    }
  }, [barcode, navigation, packingId]);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const barcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS], {
      checkInverted: true,
    });
    if (barcodes[0]?.content?.data) {
      const findCode = barcodes[0]?.content?.data;
      REA.runOnJS(setBarcode)(findCode);
    }
  }, []);

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

  const handleSearchBarcode = () => {
    setReadyToScan(true);
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
              <Button title="Escanear" onPress={handleSearchBarcode} />
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
              </ScrollView>
            </View>
          ) : (
            <View>
              <Text>No hay datos que coincidan con el ID</Text>
            </View>
          )}
        </>
      )}
      <View style={{marginVertical: 5}}>
        <Button title="Finalizar" onPress={handleCreateReport} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={readyToScan}
        onRequestClose={() => setReadyToScan(!readyToScan)}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={hasPermission && readyToScan}
          frameProcessor={frameProcessor}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
});
export default SearchPacking;
