import React from 'react';
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
	          if (res.data.message === "User FOUND!") {
				this.props.authenticated(res.data.user);
				this.props.navigation.navigate("dashboard");
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
			<ImageBackground style={styles.container} source={require("../../../assets/images/abstract.jpg")}>
			 
				{this.state.showEmail === true ? <View style={styles.inputContainer}>
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
		        </View> : <View style={styles.inputContainer}>
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
		        </View>}
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