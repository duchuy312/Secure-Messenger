import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import CoverScreen from '../src/CoverScreen';
import LoginScreen from '../src/LoginSceen';
import MainStack from './MainScreenNavigation';
import ChatingScreen from '../src/screen/ChatingScreen';
import RegisterScreen from '../src/RegisterScreen';
import {Provider} from 'react-redux';
import store from '../redux/store';
const Stack = createStackNavigator();

function BeginNavigation() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="CoverScreen" component={CoverScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="MainStack" component={MainStack} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default BeginNavigation;
