/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import MainComponent from "./mainComponent.js";

AppRegistry.registerComponent(appName, () => MainComponent);
TrackPlayer.registerPlaybackService(() => require('./service.js'));
