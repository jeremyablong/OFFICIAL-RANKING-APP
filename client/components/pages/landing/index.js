import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert, 
  ImageBackground, 
  Dimensions, 
  TouchableOpacity
} from 'react-native';
import axios from "axios";
import { connect } from "react-redux";
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText } from 'native-base';
import SurfaceDisplay from "../../gl-react-native/surface.js";

const { width, height } = Dimensions.get("window");


class LandingPage extends Component {
constructor(props) {
    super(props);
    this.state = {
      interestedIn: ""
    }
 }

  handleSubmission = (route) => {
   console.log("handle submission...");
   this.props.navigation.navigate(route);
  }
  render() {
    return (
    <>
      <Fragment>
      <SurfaceDisplay height={height - 250} />
      
          <View style={{ justifyContent: "center", alignItems: "center", alignContent: "center", backgroundColor: "black", height: 250 }}>
            <View ref={ref => this.viewReference = ref} style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: 10, marginBottom: 30 }}>
              <Text style={{ marginBottom: 14, fontWeight: "bold", fontSize: 24, color: "white", textAlign: "center" }}>What would you like to do?</Text>
              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate("login");
              }}><Text style={{ color: "white", textAlign: "center" }}>Already have an account?</Text></TouchableOpacity>
            </View>
            <View style={styles.inputContainerCustom}>

                <TouchableHighlight style={[styles.buttonContainerTwo, styles.loginButtonTwo]} onPress={() => {
                  this.setState({
                    route: "login"
                  }, () => {
                    this.handleSubmission(this.state.route);
                  })
                }}>
                  <Text style={styles.loginText}>SIGN-IN</Text>
                </TouchableHighlight>
                   <TouchableHighlight style={[styles.buttonContainerTwo, styles.loginButtonTwo]} onPress={() => {
                    this.setState({
                      route: "sign-up"
                    }, () => {
                      this.handleSubmission(this.state.route);
                    })
                   }}>
                  <Text style={styles.loginText}>SIGN-UP</Text>
                </TouchableHighlight>
            </View>
          </View>
 
         
      </Fragment>
    </>
    );
  }
}

const styles = StyleSheet.create({
  background: {
  	width: width,
  	height: height,
  	flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
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
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  buttonContainerTwo: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButtonTwo: {
    backgroundColor: "#613DC1",
	  shadowColor: "white",
	  shadowOffset: {
		width: 3,
		height: 12,
	},
	shadowOpacity: 0.58,
	shadowRadius: 16.00,

	elevation: 24,
	borderRadius:10,
    borderWidth: 2,
    borderColor: '#97DFFC'
  },
  loginText: {
    color: 'white',
  }
});

export default connect(null, { })(LandingPage);