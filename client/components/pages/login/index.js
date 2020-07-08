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
  Dimensions
} from 'react-native';
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText } from 'native-base';
import axios from "axios";
import { authenticated } from "../../../actions/auth/auth.js";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get("window");

class LoginPage extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  	phoneNumber: "",
  	email: "",
  	password: "",
  	showEmail: false
  };
}
	handleSubmission = () => {
		console.log("handle submission...");
		
		if (this.state.email.length > 0 && this.state.password.length > 0 && this.state.phoneNumber.length === 0) {
			
			const { email, password } = this.state;

			console.log("email RAN.");

			axios.post("http://recovery-social-media.ngrok.io/login", {
	          email,
	          password
	        }).then((res) => {
	          console.log(res.data);
	          if (res.data.message === "User could NOT be found...") {
	          	alert("Please enter valid credentials...")
	          }
	          if (res.data.message === "User FOUND!") {
				this.props.authenticated(res.data.user);
				this.props.navigation.navigate("dashboard");
	          } else if (res.data.message === "Password/email did match our records...") {
	          	alert(res.data.message);
	          }
	        }).catch((err) => {
	          console.log(err);
	        })
		} else if (this.state.password.length > 0 && this.state.phoneNumber.length > 0 && this.state.email.length === 0) {
			
			const { phoneNumber, password } = this.state;

			const output = phoneNumber.replace(/[^\d]/g, "");

			console.log("phoneNumber RAN.")
			axios.post("http://recovery-social-media.ngrok.io/login", {
	          phoneNumber: output,
	          password
	        }).then((res) => {
	          console.log(res.data);
	          if (res.data.message === "User FOUND!") {
	          	this.props.authenticated(res.data.user);
	          	this.props.navigation.navigate("dashboard");
	          } else if (res.data.message === "Password/email did match our records...") {
	          	alert(res.data.message);
	          }
	        }).catch((err) => {
	          console.log(err);
	        })
		} else {
			alert("Please fill out both fields.");
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
			 <View style={styles.overlay}>	
				{this.state.showEmail === true ? <Fragment><Text style={{ textAlign: "center", fontSize: 24, color: "white", fontWeight: "bold", paddingLeft: 5, paddingTop: 7, paddingBottom: 5 }}>Email Address</Text><View style={styles.inputContainer}>
		          <TouchableOpacity onPress={() => {
		          	this.setState({
		          		showEmail: !this.state.showEmail,
		          		email: ""
		          	})
		          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/mail.png")}/></TouchableOpacity>
		          <TextInput style={styles.inputs}
		              placeholder="Enter Your Email Address..."
		              underlineColorAndroid='transparent'
		              onChangeText={(email) => this.setState({
		                email
		              })}/>
		        </View><TouchableOpacity onPress={() => {
		          this.setState({
		            showEmail: false
		          })
		        }}><Text style={{ textAlign: "left", fontSize: 15, color: "white", fontWeight: "bold", textDecorationLine: "underline", paddingBottom: 5, paddingLeft: 5, marginTop: -7, paddingBottom: 5 }}><Image style={{ width: 20, height: 20, tintColor: "white" }} source={require("../../../assets/icons/select.png")}/>Use phone number instead</Text></TouchableOpacity></Fragment> : <Fragment><Text style={{ textAlign: "center", fontSize: 24, color: "white", fontWeight: "bold", paddingLeft: 5, paddingTop: 7, paddingBottom: 5}}>Phone Number</Text><View style={styles.inputContainer}>
		          <TouchableOpacity onPress={() => {
		          	this.setState({
		          		showEmail: !this.state.showEmail,
		          		phoneNumber: ""
		          	})
		          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/phone.png")}/></TouchableOpacity>
		          <TextInput style={styles.inputs}
		              placeholder="Enter Your Phone Number..."
		              underlineColorAndroid='transparent'
		              onChangeText={(phoneNumber) => this.setState({
		                phoneNumber
		              })}/>
		        </View></Fragment>}
		        {this.state.showEmail === false ? <TouchableOpacity onPress={() => {
		          this.setState({
		            showEmail: true
		          })
		        }}><Text style={{ textAlign: "left", fontSize: 15, color: "white", fontWeight: "bold", textDecorationLine: "underline", paddingBottom: 5, paddingLeft: 5, marginTop: -7, paddingBottom: 5 }}><Image style={{ width: 20, height: 20, tintColor: "white" }} source={require("../../../assets/icons/select.png")}/>Use email instead</Text></TouchableOpacity> : null}
		        <Text style={{ textAlign: "center", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10 }}>Password</Text>
		        <View style={styles.inputContainer}>

		          <Image style={styles.inputIcon} source={require("../../../assets/icons/login.png")}/>
		          <TextInput style={styles.inputs}
		              placeholder="Enter Your Password..." 
		              secureTextEntry={true}
		              underlineColorAndroid='transparent'
		              onChangeText={(password) => this.setState({
		                password
		              })}/>
		        </View>
			 
			 <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={() => {
	          this.handleSubmission();
	        }}>
	          <Text style={styles.signUpText}>Sign in</Text>
	        </TouchableHighlight>
	        </View>
		    </ImageBackground>
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
  	flex: 1, 
  	justifyContent: 'center', 
  	alignItems: 'center'
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