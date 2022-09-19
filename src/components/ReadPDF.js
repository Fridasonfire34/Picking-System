import {useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Share,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Pdf from 'react-native-pdf';
import {LOCAL_IP} from '../utils/server';

const ReadPDF = () => {
  const route = useRoute();
  const {packingId, data} = route.params;

  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${LOCAL_IP}/api/export-report?id=${packingId}`)
      .then(res => res.json())
      .then(res => setUri(`data:application/pdf;base64,${res.blob}`))
      .catch(err => {
        setError(true);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [data, packingId]);

  const handleSharePdf = () => {
    Share.share({url: uri})
      .then(res => console.log(res))
      .catch(err => {
        Alert.alert('Error', 'Existe un error al compartir');
        console.log(err);
      });
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
        onError={err => {
          console.log(error);
          setError(err);
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
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
export default ReadPDF;
