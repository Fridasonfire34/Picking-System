import {useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Pdf from 'react-native-pdf';
import {server} from '../utils/server';
import RNFetchBlob from 'rn-fetch-blob';

const ReadPDF = () => {
  const route = useRoute();
  const {packingId, data} = route.params;

  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${server()}/api/export-report?id=${packingId}`)
      .then(res => res.json())
      .then(res => {
        setUri(`data:application/pdf;base64,${res.blob}`);
      })
      .catch(err => {
        setError(true);
        console.error('fetch pdf', err);
      })
      .finally(() => setLoading(false));
  }, [data, packingId]);

  const handleSharePdf = () => {
    fetch(`${server()}/api/export-report?id=${packingId}`)
      .then(res => res.json())
      .then(res => {
        let base64Str = res.blob;
        let pdfLocation = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'test.pdf';
        RNFetchBlob.fs
          .writeFile(pdfLocation, base64Str, 'base64')
          .then(resFile => {
            console.log('success', {resFile, pdfLocation});
            RNFetchBlob.android.actionViewIntent(
              pdfLocation,
              'application/pdf',
            );
          })
          .catch(err => {
            console.log('error', err);
            Alert.alert('Error', 'Something went wrong');
          });
      })
      .catch(err => {
        setError(true);
        console.error('fetch pdf', err);
      })
      .finally(() => setLoading(false));
  };

  if (error) {
    return (
      <View>
        <Text>Existe un error</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={{
          uri,
        }}
        style={styles.pdf}
        activityIndicator={<ActivityIndicator animating={true} />}
      />
      {!loading && !error && (
        <Button title="Compartir PDF" onPress={handleSharePdf} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 10,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
export default ReadPDF;
