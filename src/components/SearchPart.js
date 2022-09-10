/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {LOCAL_IP} from '../utils/server';
import {duplicateElements} from '../utils/elements';

const SearchPart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const route = useRoute();
  const {packingId, partNumber} = route.params;

  useEffect(() => {
    setLoading(true);
    fetch(`${LOCAL_IP}/api/consult-part?id=${packingId}&part=${partNumber}`)
      .then(res => res.json())
      .then(res => {
        if (res.length) {
          const [count] = res.map(item => {
            return item.qty;
          });
          const duplicate = duplicateElements(res, Number(count));
          setData(duplicate);
        } else {
          setData([]);
        }
      })
      .catch(err => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [packingId, partNumber]);

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

export default SearchPart;
