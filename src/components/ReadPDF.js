import {useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Pdf from 'react-native-pdf';
import {LOCAL_IP} from '../utils/server';

const ReadPDF = () => {
  const route = useRoute();
  const {packingId, data} = route.params;

  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${LOCAL_IP}/api/export-report?id=${packingId}`)
      .then(res => {
        console.log(res);
        setUri(res.url);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [data, packingId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Pdf
          trustAllCerts={false}
          source={{
            uri: uri,
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            //console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            //console.log(`Current page: ${page}`);
          }}
          onError={error => {
            //console.log(error);
          }}
          onPressLink={uri => {
            //console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
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
