import React, { Fragment } from 'react';
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
  ScrollView
} from 'react-native';
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText } from 'native-base';
import axios from "axios";
import { authenticated } from "../../../actions/auth/auth.js";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhotoUpload from 'react-native-photo-upload';
import RBSheet from "react-native-raw-bottom-sheet";
import LoadingLoading from "../../loader/loader.js";

const { width, height } = Dimensions.get("window");

class LoginPage extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  	phoneNumber: "",
  	email: "",
  	password: "",
  	showEmail: false,
  	base64MUGSHOT: "",
  	show: true
  };
}
	handleSubmission = () => {
		console.log("handle submission...");
		
		if (this.state.email.length > 0 && this.state.password.length > 0 && this.state.base64MUGSHOT.length > 0 && this.state.phoneNumber.length === 0) {
			
			const { email, password } = this.state;

			console.log("email RAN.");

			this.RBSheet.open();

			axios.post("http://recovery-social-media.ngrok.io/login", {
	          email,
	          password,
	          confirmationPhoto: this.state.base64MUGSHOT
	        }).then((res) => {
	          console.log("YYYYYYY :", res.data);
	          if (res.data.message === "User could NOT be found...") {
	          	this.RBSheet.close();
	          	setTimeout(() => {
	          		alert("Please enter valid credentials...")
	          	}, 1500)
	          }
	          if (res.data.message === "User FOUND!") {

	          	const picture = res.data.user.base64MUGSHOT;

	          	const config = {
          			headers: {
          				"Content-Type": "application/json",
          				"user_id": "5f09ef175b54a106df315f75"
          			}
          		}

          		// api key - 5f09ef175b54a106df315f75

	          	const conversion = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

	          	const currentPhoto = `https://s3.us-west-1.wasabisys.com/rating-people/${res.data.image}`;
	          	
				axios.post("http://facexapi.com/compare_faces", {
					img_1: conversion,
					img_2: currentPhoto
				}, config).then((resolution) => {
	          		console.log("majestical :", resolution.data);
	          		if (Number(resolution.data.data.confidence) >= 0.55) {
	          			this.RBSheet.close();
						this.props.authenticated(res.data.user);
	          			this.props.navigation.navigate("dashboard");
	          		} else {
	          			this.RBSheet.close();
	          			setTimeout(() => {
	          				alert("We could not identify your account because your photo does not match the verfication photo in our records.")
	          			}, 1750);
	          		}
	          	}).catch((err) => {
	          		console.log(err);
	          	})

	          	// this.props.authenticated(res.data.user);
	          	// this.props.navigation.navigate("dashboard");
	          
	          } else if (res.data.message === "Password/email did match our records...") {
	          	this.RBSheet.close();
	          	setTimeout(() => {
					alert(res.data.message);
	          	}, 1500)
	          }
	        }).catch((err) => {
	          console.log(err);
	        })
		} else if (this.state.password.length > 0 && this.state.phoneNumber.length > 0 && this.state.base64MUGSHOT.length > 0 && this.state.email.length === 0) {
			
			const { phoneNumber, password } = this.state;

			const output = phoneNumber.replace(/[^\d]/g, "");

			this.RBSheet.open();

			console.log("phoneNumber RAN.")
			axios.post("http://recovery-social-media.ngrok.io/login", {
	          phoneNumber: output,
	          password,
	          confirmationPhoto: this.state.base64MUGSHOT
	        }).then((res) => {
	          console.log("YYYYY :", res.data);
			  if (res.data.message === "User could NOT be found...") {
			  	this.RBSheet.close();
	          	setTimeout(() => {
	          		this.RBSheet.close();
	          		alert("Please enter valid credentials...")
	          	}, 1500)
			  }
	          if (res.data.message === "User FOUND!") {

	          	const config = {
          			headers: {
          				"Content-Type": "application/json",
          				"user_id": "5f09ef175b54a106df315f75"
          			}
          		};

          		const picture = res.data.user.base64MUGSHOT;

	          	const conversion = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

	          	const currentPhoto = `https://s3.us-west-1.wasabisys.com/rating-people/${res.data.image}`;

				axios.post("http://facexapi.com/compare_faces", {
					img_1: conversion, 
					img_2: currentPhoto
				}, config).then((resolution) => {
	          		console.log("majestical :", resolution.data);
	          		if (Number(resolution.data.data.confidence) >= 0.55) {
	          			this.RBSheet.close();
						this.props.authenticated(res.data.user);
	          			this.props.navigation.navigate("dashboard");
	          		} else {
	          			this.RBSheet.close();
	          			setTimeout(() => {
	          				alert("We could not identify your account because your photo does not match the verfication photo in our records.")
	          			}, 1750);
	          		}
	          	}).catch((err) => {
	          		console.log(err);
	          	})

	          	// this.props.authenticated(res.data.user);
	          	// this.props.navigation.navigate("dashboard");
	          	
	          } else if (res.data.message === "Password/email did match our records...") {
	          	this.RBSheet.close();
	          	setTimeout(() => {
	          		this.RBSheet.close();
					alert(res.data.message);
	          	}, 1500)
	          }
	        }).catch((err) => {
	          console.log(err);
	        })
		} else {
			alert("Please fill out all three fields.");
		}
	}
	render() {
		return (
		<React.Fragment>
		<Header>
          <Left>
            <NativeButton onPress={() => {
              this.props.navigation.navigate("homepage");
            }} hasText transparent>
              <NativeText>Back</NativeText>
            </NativeButton>
          </Left>
          <Body>
            <Title>Login Page</Title>
          </Body>
          <Right>
            <NativeButton hasText transparent>
              <NativeText>help?</NativeText>
            </NativeButton>
          </Right>
        </Header>
			<ImageBackground style={styles.container} source={require("../../../assets/images/bloom.jpg")}>
			 <ScrollView contentContainerStyle={{ justifyContent: "center", alignItems: "center", paddingTop: 100, paddingBottom: 100 }} style={styles.overlay}>	
				{this.state.showEmail === true ? <Fragment><Text style={{ textAlign: "center", fontSize: 24, color: "white", fontWeight: "bold", paddingLeft: 5, paddingTop: 7, paddingBottom: 5 }}>Email Address</Text><View style={styles.inputContainer}>
		          <TouchableOpacity onPress={() => {
		          	this.setState({
		          		showEmail: !this.state.showEmail,
		          		email: "",
		          		password: ""
		          	})
		          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/mail.png")}/></TouchableOpacity>
		          <TextInput style={styles.inputs} 
		          	  value={this.state.email}
		          	  placeholderTextColor="black"
		              placeholder="Enter Your Email Address..."
		              underlineColorAndroid='transparent'
		              onChangeText={(email) => this.setState({
		                email
		          })}/>
		        </View><TouchableOpacity onPress={() => {
		          this.setState({
		            showEmail: false,
		            email: "",
		          	password: ""
		          })
		        }}><Text style={{ textAlign: "left", fontSize: 15, color: "white", fontWeight: "bold", textDecorationLine: "underline", paddingBottom: 5, paddingLeft: 5, marginTop: -7, paddingBottom: 5 }}><Image style={{ width: 20, height: 20, tintColor: "white" }} source={require("../../../assets/icons/select.png")}/>Use phone number instead</Text></TouchableOpacity></Fragment> : <Fragment><Text style={{ textAlign: "center", fontSize: 24, color: "white", fontWeight: "bold", paddingLeft: 5, paddingTop: 7, paddingBottom: 5}}>Phone Number</Text><View style={styles.inputContainer}>
		          <TouchableOpacity onPress={() => {
		          	this.setState({
		          		showEmail: !this.state.showEmail,
		          		phoneNumber: "",
		          		password: ""
		          	})
		          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/phone.png")}/></TouchableOpacity>
		          <TextInput style={styles.inputs} 
		          	  value={this.state.phoneNumber}
		          	  placeholderTextColor="black"
		              placeholder="Enter Your Phone Number..."
		              underlineColorAndroid='transparent'
		              onChangeText={(phoneNumber) => this.setState({
		                phoneNumber
		              })}/>
		        </View></Fragment>}
		        {this.state.showEmail === false ? <TouchableOpacity onPress={() => {
		          this.setState({
		            showEmail: true,
		            phoneNumber: "",
		          	password: ""
		          })
		        }}><Text style={{ textAlign: "left", fontSize: 15, color: "white", fontWeight: "bold", textDecorationLine: "underline", paddingBottom: 5, paddingLeft: 5, marginTop: -7, paddingBottom: 5 }}><Image style={{ width: 20, height: 20, tintColor: "white" }} source={require("../../../assets/icons/select.png")}/>Use email instead</Text></TouchableOpacity> : null}
		        <Text style={{ textAlign: "center", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10 }}>Password</Text>
		        <View style={styles.inputContainer}>

		          <TouchableOpacity onPress={() => {
		          	this.setState({
		          		show: !this.state.show
		          	})
		          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/login.png")}/></TouchableOpacity>
		          <TextInput style={styles.inputs}  
		          	  value={this.state.password}
		          	  placeholderTextColor="black"
		              placeholder="Enter Your Password..." 
		              secureTextEntry={this.state.show}
		              underlineColorAndroid='transparent'
		              onChangeText={(password) => this.setState({
		                password 
		              })}/>
		        </View>
			 	<PhotoUpload
				   onPhotoSelect={avatar => {
				     if (avatar) {
				       console.log('Image base64 string: ', avatar);
				       this.setState({
				        base64MUGSHOT: avatar
				       })
				     }
				   }}
				   imagePickerProps={{
				   	// turn to null for production - chooseFromLibraryButtonTitle: null
				    //  chooseFromLibraryButtonTitle: null 
				  }}
				 >
				   <Image
				     style={{
				       paddingVertical: 30,
				       width: 150,
				       height: 150,
				       borderRadius: 75
				     }}
				     resizeMode='cover'
				     source={require("../../../assets/images/headshot.jpg")}
				   />
				</PhotoUpload>
			 <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={() => {
	          this.handleSubmission();
	        }}>
	          <Text style={styles.signUpText}>Sign in</Text>
	        </TouchableHighlight>
	        </ScrollView>
		    </ImageBackground>
		    <RBSheet
	          ref={ref => {
	            this.RBSheet = ref;
	          }}
	          height={height}
	          openDuration={250}
	          customStyles={{
	            container: {
	              justifyContent: "center",
	              alignItems: "center",
	              backgroundColor: "white"
	            }
	          }}
	        >
	          <LoadingLoading />
	        </RBSheet>
		</React.Fragment>
		)
	}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00b5ec',
    width: width, 
    height: height
  },
  overlay: {
  	backgroundColor: 'rgba(0, 0, 0, 0.6)', 
  	width: width * 0.90, 
  	height: height * 0.80, 
  	flex: 1
  },
  inputContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center',
      borderRadius:10,
      borderWidth: 2,
      borderColor: 'black'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
      color: "black"
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    marginTop: 30
  },
  signupButton: {
    backgroundColor: "white",
    borderRadius:10,
      borderWidth: 2,
      borderColor: 'black'
  },
  signUpText: {
    color: 'black',
    fontWeight: "bold"
  }
});
export default connect(null, { authenticated })(LoginPage);