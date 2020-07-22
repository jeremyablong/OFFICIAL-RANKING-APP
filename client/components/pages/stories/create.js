import React, { Fragment, Component } from 'react';
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
  Keyboard, 
  Animated
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import { RNCamera } from 'react-native-camera';
import { Shaders, Node, GLSL } from "gl-react";

const { width, height } = Dimensions.get("window");

const shaders = Shaders.create({
  helloBlue: {
 // uniforms are variables from JS. We pipe blue uniform into blue output color
    frag: GLSL`
		precision highp float;
		varying vec2 uv;
		uniform float blue;
		void main() {
		  gl_FragColor = vec4(uv.x, uv.y, blue, 1.0);
		}
		` 
	}
});

export class HelloBlue extends Component {
  render() {
    const { blue } = this.props;
    return <Node shader={shaders.helloBlue} uniforms={{ blue }} />;
  }
}

class CreateStoryFeedPage extends Component {
constructor(props) {
  super(props);

	this.state = {
		blue: 0.5
	}
}
	render() {
		return (
			<Fragment>
{/*				<Header>
					  <Left>
					    <NativeButton onPress={() => {
					      console.log("clicked.");
					      this.props.navigation.navigate("dashboard");
					    }} hasText transparent>
					      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/construction.png")}/>
					    </NativeButton>
					  </Left>
					  <Body>
					    <Title>Create-Story</Title>
					  </Body>
					  <Right>
					    <NativeButton onPress={() => {
					    	console.log("clicked user interface...");
					    	this.setState({
					    		isOpen: true
					    	})
					    }} hasText transparent>
					      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/user-interface.png")}/>
					    </NativeButton>
					  </Right>
					</Header>
				*/}
				<View style={{ height, width, flex: 1 }}>
					<RNCamera
					  ref={(ref) => {
					    this.camera = ref;
					  }}
					  style={styles.preview}
					  type={RNCamera.Constants.Type.back}
					  flashMode={RNCamera.Constants.FlashMode.on}
					  androidCameraPermissionOptions={{
					    title: 'Permission to use camera',
					    message: 'We need your permission to use your camera',
					    buttonPositive: 'Ok',
					    buttonNegative: 'Cancel',
					  }}
					  androidRecordAudioPermissionOptions={{
					    title: 'Permission to use audio recording',
					    message: 'We need your permission to use your audio',
					    buttonPositive: 'Ok',
					    buttonNegative: 'Cancel',
					  }}
					  onGoogleVisionBarcodesDetected={({ barcodes }) => {
					    {/*console.log(barcodes);*/}
					  }}
					>
					
					<TouchableOpacity onPress={() => {
							console.log("pressed SETTINGS...")
						}} style={{ flex: 1, zIndex: 999, width: 25, height: 25, position: "absolute" }}>
						<View style={{ position: "absolute", left: 15, top: 30, flex: 1 }}>
							<Image source={require("../../../assets/icons/gear.png")} style={{ width: 25, height: 25, tintColor: "white" }} />
						</View>

					</TouchableOpacity>

					<TouchableOpacity onPress={() => {
							console.log("pressed CLOSE...");
							this.props.navigation.navigate("dashboard");
						}} style={{ position: "absolute", right: 15, top: 30, flex: 1, width: 25, height: 25, zIndex: 999 }}>
							<Image source={require("../../../assets/icons/close.png")} style={{ width: 25, height: 25, tintColor: "white" }} />
					</TouchableOpacity>
					
					<View style={{ position: "relative", bottom: 15, justifyContent: "center", alignItems: "center", alignContent: "center", flex: 1, flexDirection: 'row' }}>
						<TouchableOpacity onPress={() => {
							console.log("pressed TAKE PICTURE...")
						}} style={{ position: "absolute", bottom: 0 }}>
							<Image source={require("../../../assets/icons/take-photo.png")} style={{ width: 75, height: 75, tintColor: "white" }} />
						</TouchableOpacity>
					</View>
					</RNCamera>
				</View>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	preview: {
		width,
		height
	}
})
export default CreateStoryFeedPage;