import React, { Fragment, Component } from 'react';
import {  NodeCameraView } from 'react-native-nodemediaclient';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight, 
  TouchableOpacity, 
  Image,
  Alert, 
  ImageBackground, 
  Dimensions, 
  ScrollView, 
  FlatList, 
  SafeAreaView
} from 'react-native';
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, Footer, FooterTab } from 'native-base';

const { height, width } = Dimensions.get("window");

class LiveStreamPageDisplay extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isPublish: false,
  	publishBtnTitle: ""
  };
}
	requestCameraPermission = async () => {
	  try {
	    const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA,PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
	      {
	        title: "Cool Photo App Camera And Microphone Permission",
	        message:
	          "Cool Photo App needs access to your camera " +
	          "so you can take awesome pictures.",
	        buttonNeutral: "Ask Me Later",
	        buttonNegative: "Cancel",
	        buttonPositive: "OK"
	      }
	    );
	    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
	      console.log("You can use the camera");
	    } else {
	      console.log("Camera permission denied");
	    }
	  } catch (err) {
	    console.warn(err);
	  }
	};
	handleSwitch = () => {
		console.log("pressed...");
	}
	render() {
		return (
			<Fragment>
				<NodeCameraView 
				  style={{ height: height }}
				  ref={(vb) => { this.vb = vb }}
				  outputUrl = {"rtmp://192.168.0.10/live/stream"}
				  camera={{ cameraId: 1, cameraFrontMirror: true }}
				  audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
				  video={{ preset: 12, bitrate: 400000, profile: 1, fps: 15, videoFrontMirror: false }}
				  autopreview={true} 
				  video={{ preset: 12, bitrate: 400000, profile: 1, fps: 15, videoFrontMirror: false }}
				>
				<TouchableOpacity onPress={this.handleSwitch} style={{ position: "absolute", right: 10, top: 10, zIndex: 99 }}>
					<Image style={{ width: 40, height: 40, position: "absolute", right: 10, top: 20 }} source={require("../../../../assets/icons/reverse.png")} />
				</TouchableOpacity>
				<View style={styles.bottomBtnContainer}>
					<NativeButton style={styles.startStreamBtn}>
						<NativeText>Start Live Stream</NativeText>
					</NativeButton>
				</View>
				</NodeCameraView>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	startStreamBtn: {
		justifyContent: "center",
		alignItems: "center",
		alignContent: "center",
		backgroundColor: "#858AE3"
	},
	bottomBtnContainer: {
		position: "absolute",
		bottom: 0
	}
})

export default LiveStreamPageDisplay;