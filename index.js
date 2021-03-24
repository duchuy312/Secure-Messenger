/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BeginNavigation from './Navigation/BeginNavigation';
import CoverScreen from './src/CoverScreen';

AppRegistry.registerComponent(appName, () => BeginNavigation);
