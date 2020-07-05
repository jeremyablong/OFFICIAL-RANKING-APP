import React, { Component, Fragment } from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

class IndividualStory extends React.Component {
constructor(props) {
  super(props);

  this.state = {};
}
    // takePicture = async () => {
    //     if (this.camera) {
    //       const options = { quality: 0.5, base64: true };
    //       const data = await this.camera.takePictureAsync(options);
    //       console.log(data.uri);
    //     }
    // };
  uploadCameraRoll = () => {
    console.log("upload from camera roll...");
  }
	render() {
		return (
			<Fragment>
				<View style={styles.container}>
          <TouchableOpacity onPress={() => {
            this.uploadCameraRoll();
          }} style={styles.cameraRoll}>
            <Image style={styles.cameraRollImage} source={require("../../../assets/icons/film.png")} />
          </TouchableOpacity>
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
                        console.log(barcodes);
                      }}
                    />
                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                      <TouchableOpacity onPress={() => {
                        
                      }} style={styles.capture}>
                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  cameraRoll: {  
    top: 10, 
    left: 5,
    zIndex: 999
  },
  cameraRollImage: {
    position: "absolute", 
    left: 5, 
    top: 10,
    width: 65, 
    height: 65,
    zIndex:  9999,
    tintColor: "white"
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});


export default IndividualStory;