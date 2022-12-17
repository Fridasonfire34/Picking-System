import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {server} from '../utils/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

const PERSISTENCE_KEY = 'USER_STATE';
const SearchPacking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalParts, setTotalParts] = useState(0);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const {packingId} = route.params;

  useEffect(() => {
    if (packingId?.length > 0) {
      fetchData();
    }
  }, [fetchData, packingId]);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(`${server()}/api/packings/find-merge?id=${packingId}`)
      .then(res => res.json())
      .then(res => {
        if (res.length > 0) {
          const parts = res.map(item => {
            const qty = Number(item.qty);
            return qty;
          });
          const sumParts = parts.reduce((partialSum, a) => partialSum + a, 0);
          setTotalParts(sumParts);
          setFilteredDataSource(res);
          setMasterDataSource(res);
        }
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [packingId]);

  const updateItem = useCallback(
    async id => {
      setLoading(true);
      const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
      const parsedState = JSON.parse(savedStateString);
      const userId = parsedState?.user?.user_id;
      fetch(`${server()}/api/packings/update?id=${id}&user=${userId}`)
        .then(res => res.json())
        .then(() => {
          fetchData();
        })
        .catch(err => {
          setError(err);
        })
        .finally(() => setLoading(false));
    },
    [fetchData],
  );

  const createReport = () => {
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
    setLoading(true);
    fetch(`${server()}/api/packings/export?id=${packingId}`)
      .then(res => res.json())
      .then(res => {
        let base64Str = res.blob;
        let pdfLocation =
          RNFetchBlob.fs.dirs.DocumentDir +
          '/' +
          'report-' +
          packingId +
          '.pdf';
        RNFetchBlob.fs
          .writeFile(pdfLocation, base64Str, 'base64')
          .then(async resFile => {
            await AsyncStorage.removeItem(PERSISTENCE_KEY);
            RNFetchBlob.android.actionViewIntent(
              pdfLocation,
              'application/pdf',
            );
            navigation.navigate('SignIn');
          })
          .catch(err => {
            console.log(err);
            Alert.alert('Mensaje', 'Existe un error al generar el reporte');
          });
      })
      .catch(err => {
        setLoading(false);
        setError(true);
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const searchFilterFunction = text => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.partnumber
          ? item.partnumber.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const removeItemFilter = () => {
    const firstId = filteredDataSource[0]?.id;
    updateItem(firstId);
    setSearch('');
  };

  if (loading) {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.title}>Cargando información...</Text>
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{marginVertical: 15}}
        />
      </View>
    );
  }

  if (!loading && error) {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.title}>Existe un error</Text>
        <TouchableOpacity onPress={fetchData}>
          <Text style={styles.textLink}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({item}) => {
    const {parts} = item;
    if (parts?.length > 0) {
      return (
        <View style={styles.content}>
          {parts.map((part, index) => {
            return (
              <View key={index + 1}>
                <View style={styles.horizontal}>
                  <View style={styles.area}>
                    <View style={styles.contentHorizontal}>
                      <Text style={styles.textId}>ID</Text>
                      <Text style={styles.textId}>{part.id}</Text>
                    </View>
                    <View style={styles.contentHorizontal}>
                      <Text style={styles.subtitle}>Packing Disk No.</Text>
                      <Text style={styles.item}>{part.packingdiskno}</Text>
                    </View>
                    <View style={styles.contentHorizontal}>
                      <Text style={styles.subtitle}>Part Number</Text>
                      <Text style={styles.item}>{part.partnumber}</Text>
                    </View>
                    <View style={styles.contentHorizontal}>
                      <Text style={styles.subtitle}>Quantity</Text>
                      <Text style={styles.item}>{part.qty}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => updateItem(item.id)}
                    style={styles.center}>
                    <View style={styles.clear}>
                      <Text style={styles.textClear}>X</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.separator} />
              </View>
            );
          })}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Resultados de la búsqueda</Text>
          <Text style={styles.subtitle}>
            Packing ID: <Text style={styles.textBold}>{packingId}</Text>
          </Text>
          <Text style={styles.subtitle}>
            Partes restantes: <Text style={styles.textBold}>{totalParts}</Text>
          </Text>
        </View>
        <View style={styles.contentFilter}>
          <TextInput
            placeholder="Part Number"
            style={styles.inputFilter}
            value={search}
            onChangeText={text => searchFilterFunction(text)}
          />
          {search.length > 0 && filteredDataSource.length > 0 && (
            <TouchableOpacity
              style={styles.buttonDelete}
              onPress={removeItemFilter}>
              <Text style={styles.textButtonDelete}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={filteredDataSource}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchData} />
          }
          ListFooterComponent={
            <Button title="Generar reporte" onPress={createReport} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  subtitle: {
    fontSize: 16,
    color: '#212121',
  },
  item: {
    fontSize: 14,
    color: '#212121',
  },
  textLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 15,
  },
  textBold: {
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    marginVertical: 10,
  },
  content: {
    marginVertical: 10,
  },
  contentHorizontal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#607D8B',
    opacity: 0.5,
    marginVertical: 10,
  },
  textId: {
    fontSize: 12,
  },
  horizontal: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clear: {
    marginHorizontal: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textClear: {
    fontSize: 15,
    color: '#ef5350',
    fontWeight: 'bold',
  },
  contentFilter: {
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFilter: {
    marginBottom: 20,
  },
  inputFilter: {
    borderWidth: 1,
    borderColor: '#2196F3',
    marginBottom: 10,
    flex: 1,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  buttonDelete: {
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: '#2196F3',
    height: 50,
    marginBottom: 10,
    width: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  textButtonDelete: {
    fontSize: 15,
    color: 'white',
    fontWeight: '500',
  },
});

export default SearchPacking;
