import React, { Component } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Spinner } from 'native-base';

class Loading extends Component {
constructor () {
	super();

	this.state = {
		loading: true
	}
}
	render() {
		return (
			<View>
				<Spinner style={{ width: 200, height: 200, marginLeft: 100, marginTop: 300, justifyContent: "center", alignItems: "center" }} color='blue' />
			</View>
		);
	}
}
const styles = StyleSheet.create({
	text: {
		fontSize: 30
	}
});

export default Loading;