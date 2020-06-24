import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Spinner } from 'native-base';

const { width, height } = Dimensions.get("window");

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
				<Spinner style={{ width: 200, height: 200, right: 0, marginLeft: width / 4, position: "relative", justifyContent: "center", alignItems: "center" }} color='blue' />
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