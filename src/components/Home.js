/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {BarcodeFormat, scanBarcodes} from 'vision-camera-code-scanner';
import * as REA from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  global.__reanimatedWorkletInit = () => {};
  const [packingId, setPackingId] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [readyToScan, setReadyToScan] = useState(false);

  const navigation = useNavigation();

  const devices = useCameraDevices();
  const device = useMemo(() => {
    return devices.back;
  }, [devices]);

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
    if (packingId.length > 0) {
      navigation?.push('SearchPacking', {packingId});
      setPackingId('');
    } else {
      Alert.alert('Error', 'Ingrese un numero de packing');
    }
  };

  const handleSearchBarcode = async () => {
    setReadyToScan(true);
  };

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
          onPress: () => navigation?.push('Search', {packingId}),
        },
      ]);
    }
  }, [barcode, navigation, packingId]);

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
          value={packingId}
          onChangeText={text => setPackingId(text)}
        />
        <Button title="Buscar" onPress={handleSearch} />
        {device == null ? (
          <ActivityIndicator size={20} color={'red'} />
        ) : (
          <>
            {hasPermission && (
              <>
                <Text
                  style={{
                    textAlign: 'center',
                    marginVertical: 10,
                    fontSize: 15,
                  }}>
                  o
                </Text>
                <Button title="Escanear código" onPress={handleSearchBarcode} />
              </>
            )}
          </>
        )}
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

export default Home;
