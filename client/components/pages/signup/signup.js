import React, { Component } from 'react';
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
  ScrollView
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText } from 'native-base';
import PhotoUpload from 'react-native-photo-upload';
import RNLocation from 'react-native-location';
import { connect } from "react-redux";
import { latLngLocation } from "../../../actions/location/getLocation.js";
import { authenticated } from "../../../actions/auth/auth.js";
import axios from "axios";

class SignupPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: "",
      phoneNumber: "",
      phoneNumberReEnter: "",
      password: "",
      emailReEnter: "",
      email: "",
      birthdate: "2020-05-15",
      base64: "",
      hometown: "",
      username: "",
      showEmail: false
    }
  }

  handleSubmission = () => {

    const { fullName, emailReEnter, phoneNumberReEnter, password, birthdate, base64, hometown, username, phoneNumber, email } = this.state;

    if (fullName.length > 0 && (phoneNumber.length > 0 || email.length > 0) && password.length > 0 && birthdate.length > 0 && base64.length > 0 && hometown.length > 0 && username.length > 0) {
      if ((email === emailReEnter) && (email.length > 0 && emailReEnter.length > 0)) {
        console.log("emails MATCH.");
        axios.post("http://recovery-social-media.ngrok.io/register/user", {
          fullName,
          email,
          password,
          birthdate, 
          base64, 
          hometown, 
          username
        }).then((res) => {
          console.log(res.data);
           if (res.data.message === "Successfully registered!") {
            this.props.authenticated(res.data.data);
            this.props.navigation.navigate("dashboard");
           }
        }).catch((err) => {
          console.log(err);
        })
      } else if ((phoneNumber === phoneNumberReEnter) && (phoneNumber.length > 0 && phoneNumberReEnter.length > 0)) {

        console.log("phone numbers MATCH.");

        // const output = this.state.phoneNumber.replace(regex, "");
        const output = this.state.phoneNumber.replace(/[^\d]/g, "");

        console.log("output :", output);

        axios.post("http://recovery-social-media.ngrok.io/register/user", {
          fullName,
          password,
          birthdate, 
          base64, 
          hometown, 
          username, 
          phoneNumber: output
        }).then((res) => {
          console.log(res.data);
          if (res.data.message === "Successfully registered!") {
            this.props.authenticated(res.data.data);
            this.props.navigation.navigate("dashboard");
          }
        }).catch((err) => {
          console.log(err);
        })
      } else if ((email !== emailReEnter) && (email.length > 0 && emailReEnter.length > 0)) {
        alert("Email and re-enter email do NOT match. Please enter matching emails...");
      } else if ((phoneNumber !== phoneNumberReEnter) && (phoneNumber.length > 0 && phoneNumberReEnter.length > 0)) {
        alert("Phone Number and re-enter Phone Number do NOT match. Please enter matching phone numbers...")
      }
    } else {
      alert("Please complete each and every field...");
    }
  }
  componentDidMount() {
    RNLocation.configure({
      distanceFilter: 5.0
    })
    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "coarse"
      }
    }).then(granted => {
        if (granted) {
          this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
            console.log(locations);
            this.props.latLngLocation(locations[0]);
            /* Example location returned
            {
              speed: -1,
              longitude: -0.1337,
              latitude: 51.50998,
              accuracy: 5,
              heading: -1,
              altitude: 0,
              altitudeAccuracy: -1
              floor: 0
              timestamp: 1446007304457.029,
              fromMockProvider: false
            }
            */
          })
        }
    })
  }
  render() {
    console.log(this.state);
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
            <Title>Homepage</Title>
          </Body>
          <Right>
            <NativeButton hasText transparent>
              <NativeText>help?</NativeText>
            </NativeButton>
          </Right>
        </Header>
      <ImageBackground source={require("../../../assets/images/abstract.jpg")} style={styles.container}>
      <ScrollView style={{ flex: 1, marginTop: 40, marginBottom: 40 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../../../assets/icons/name.png")}/>
          <TextInput style={styles.inputs}
              placeholder="Full Name"
              underlineColorAndroid='transparent'
              onChangeText={(fullName) => this.setState({
                fullName
              })}/>
        </View>
        
        {this.state.showEmail === true ? <React.Fragment><View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => {
            this.setState({
              showEmail: !this.state.showEmail,
              phoneNumber: "",
              phoneNumberReEnter: ""
            })
          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/phone.png")}/></TouchableOpacity>
          <TextInput style={styles.inputs}
              placeholder="Enter Your Phone Number..."
              underlineColorAndroid='transparent' 
              value={this.state.phoneNumber}
              onChangeText={(phoneNumber) => this.setState({
                phoneNumber
              })}/>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => {
            this.setState({
              showEmail: !this.state.showEmail,
              phoneNumber: "",
              phoneNumberReEnter: ""
            })
          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/phone.png")}/></TouchableOpacity>
          <TextInput style={styles.inputs}
              placeholder="Re-Enter Phone Number..."
              underlineColorAndroid='transparent' 
              value={this.state.phoneNumberReEnter}
              onChangeText={(phoneNumberReEnter) => this.setState({
                phoneNumberReEnter
              })}/>
        </View></React.Fragment> : <React.Fragment><View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => {
            this.setState({
              showEmail: !this.state.showEmail,
              email: "",
              emailReEnter: ""
            })
          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/mail-two.png")}/></TouchableOpacity>
          <TextInput style={styles.inputs}
              placeholder="Enter Your Email..." 
              value={this.state.email}
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({
                email
              })}/>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => {
            this.setState({
              showEmail: !this.state.showEmail,
              email: "",
              emailReEnter: ""
            })
          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/mail-two.png")}/></TouchableOpacity>
          <TextInput style={styles.inputs} 
              value={this.state.emailReEnter}
              placeholder="Re-Enter Your Email..."
              underlineColorAndroid='transparent'
              onChangeText={(emailReEnter) => this.setState({
                emailReEnter
              })}/>
        </View></React.Fragment>}
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../../../assets/icons/login.png")}/>
          <TextInput style={styles.inputs}
              placeholder="Enter a password" 
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({
                password
              })}/>
        </View>
        <View style={styles.inputContainer}>
          <DatePicker
          style={{width: 250}}
          date={this.state.birthdate}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate="1940-05-01"
          maxDate="2020-06-17"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 10
            },
            dateInput: {
              marginLeft: 50
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={(date) => {
            this.setState({
              birthdate: date
            })}}
        />
        </View>
        
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../../../assets/icons/user.png")}/>
          <TextInput style={styles.inputs}
              placeholder="Enter Your Username..."
              underlineColorAndroid='transparent'
              onChangeText={(username) => this.setState({
                username
              })}/>
        </View>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../../../assets/icons/real.png")}/>
          <TextInput style={styles.inputs}
              placeholder="Enter Your Hometown..."
              underlineColorAndroid='transparent'
              onChangeText={(hometown) => 
                this.setState({
                  hometown
                })}/>
        </View>
        
       
        <View style={{ marginBottom: 30 }}>
        <Text style={{ textAlign: "center", fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Select a profile picture</Text>
          <PhotoUpload
           onPhotoSelect={avatar => {
             if (avatar) {
               console.log('Image base64 string: ', avatar);
               this.setState({
                base64: avatar
               })
             }
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
             source={require("../../../assets/icons/user.png")}
           />
         </PhotoUpload>
        </View>
        <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={() => {
          this.handleSubmission();
        }}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableHighlight>
        </ScrollView>
      </ImageBackground>
    </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00b5ec',
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
    backgroundColor: "#42e9f5",
    borderRadius:10,
      borderWidth: 2,
      borderColor: 'black'
  },
  signUpText: {
    color: 'black',
    fontWeight: "bold"
  }
});
export default connect(null, { latLngLocation, authenticated })(SignupPage);
 