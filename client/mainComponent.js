import React, { Component } from 'react';
import App from "./App.js";
import { store, persistor } from "./store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/lib/integration/react';
import Loading from "./loading.js";
import { View, Text, Dimensions, StyleSheet, Button as Buttonnn, TouchableHighlight, ImageBackground, TouchableOpacity, LinearGradient } from "react-native";



const { width, height } = Dimensions.get('window')

class MainComponent extends Component {
	render() {
		return (
			<Provider store={store}>
				<PersistGate loading={<Loading />} persistor={persistor}>
						<App />
				</PersistGate>
			</Provider>
		);
	}
}
const styles = StyleSheet.create({

});
export default MainComponent;