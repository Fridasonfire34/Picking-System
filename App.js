/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import HomeScreen from './src/components/Home';
import SearchScreen from './src/components/SearchPacking';
import SearchPart from './src/components/SearchPart';
import ReadPDF from './src/components/ReadPDF';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SearchPacking"
            component={SearchScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SearchPart"
            component={SearchPart}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ReadPDF"
            component={ReadPDF}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
