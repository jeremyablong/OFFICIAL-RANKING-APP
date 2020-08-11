import React, { Component } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Spinner } from 'native-base';

class LoadingTwoLoading extends Component {
constructor () {
	super();

	this.state = {
		loading: true
	}
}
	render() {
		return (
			<View style={{ justifyContent: "center", alignItems: "center", alignContent: "center" }}>
			<Text style={{ color: "black", fontWeight: "bold", fontSize: 20, textAlign: "center" }}>Uploading...</Text>
				<Spinner style={{ width: 200, height: 200 }} color='teal' /> 
			</View> 
		);
	}
}
const styles = StyleSheet.create({
	text: {
		fontSize: 30
	}
});

export default LoadingTwoLoading;