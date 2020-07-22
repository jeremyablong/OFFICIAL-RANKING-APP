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
  ScrollView, 
  Dimensions
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText } from 'native-base';
import PhotoUpload from 'react-native-photo-upload';
import RNLocation from 'react-native-location';
import { connect } from "react-redux";
import { latLngLocation } from "../../../actions/location/getLocation.js";
import { authenticated } from "../../../actions/auth/auth.js";
import axios from "axios";
import base64ToArrayBuffer from 'base64-arraybuffer';

const { width, height } = Dimensions.get("window");


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
      showEmail: false,
      shown: true,
      base64MUGSHOT: ""
    }
  }

  handleSubmission = () => {

    const { fullName, emailReEnter, base64MUGSHOT, phoneNumberReEnter, password, birthdate, base64, hometown, username, phoneNumber, email } = this.state;

    if (fullName.length > 0 && (phoneNumber.length > 0 || email.length > 0) && password.length > 0 && birthdate.length > 0 && base64.length > 0 && hometown.length > 0 && username.length > 0 && base64MUGSHOT.length > 0) {
      if ((email === emailReEnter) && (email.length > 0 && emailReEnter.length > 0)) {
        console.log("emails MATCH.");
        axios.post("http://recovery-social-media.ngrok.io/register/user", {
          fullName,
          email: email.toLowerCase(),
          password,
          birthdate, 
          base64, 
          hometown, 
          username: username.toLowerCase(),
          base64MUGSHOT
        }).then((res) => {
          console.log(res.data);
           if (res.data.message === "Successfully registered!") {
            this.props.authenticated(res.data.data);
            this.props.navigation.navigate("dashboard");
           } else if (res.data.message === "User FOUND - User has already registered with this username or email.") {
            alert(res.data.message)
           }
        }).catch((err) => {
          console.log(err);
        })

        axios.post("http://recovery-social-media.ngrok.io/add-face", {

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
          phoneNumber: output, 
          base64MUGSHOT
        }).then((res) => {
          console.log(res.data);
          if (res.data.message === "Successfully registered!") {
            this.props.authenticated(res.data.data);
            this.props.navigation.navigate("dashboard");
          } else if (res.data.message === "User FOUND - User has already registered with this username or phone number.") {
            alert(res.data.message)
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
      <ImageBackground source={require("../../../assets/images/bloom.jpg")} style={styles.container}>
      <View style={styles.overlay}>
      <ScrollView style={{ flex: 1, marginTop: 40, marginBottom: 40 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
       
      <Text style={{ textAlign: "left", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10, paddingLeft: 5, paddingTop: 7, paddingBottom: 5 }}>First & Last Name</Text>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../../../assets/icons/name.png")}/>
          <TextInput style={styles.inputs} 
              value={this.state.fullName} 
              placeholderTextColor={"black"}
              placeholder="Full Name"
              underlineColorAndroid='transparent'
              onChangeText={(fullName) => this.setState({
                fullName
              })}/>
        </View>
        {this.state.showEmail === false ? <TouchableOpacity onPress={() => {
          this.setState({
            showEmail: true
          })
        }}><Text style={{ textAlign: "left", fontSize: 15, color: "white", fontWeight: "bold", textDecorationLine: "underline", paddingBottom: 5, paddingLeft: 5, marginTop: -7, paddingBottom: 5 }}><Image style={{ width: 20, height: 20, tintColor: "white" }} source={require("../../../assets/icons/select.png")}/>Use Phone Number instead</Text></TouchableOpacity> : null}
        {this.state.showEmail === true ? <TouchableOpacity onPress={() => {
          this.setState({
            showEmail: false
          })
        }}><Text style={{ textAlign: "left", fontSize: 15, color: "white", fontWeight: "bold", textDecorationLine: "underline", paddingBottom: 5, paddingLeft: 5, marginTop: -7, paddingBottom: 5 }}><Image style={{ width: 20, height: 20, tintColor: "white" }} source={require("../../../assets/icons/select.png")}/>Use Email instead</Text></TouchableOpacity> : null}
        {this.state.showEmail === true ? <React.Fragment><Text style={{ textAlign: "left", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10, paddingLeft: 5, paddingTop: 7, paddingBottom: 5 }}>Phone Number</Text><View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => {
            this.setState({
              showEmail: !this.state.showEmail,
              phoneNumber: "",
              phoneNumberReEnter: ""
            })
          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/phone.png")}/></TouchableOpacity>
          <TextInput style={styles.inputs}
              placeholder="Enter Your Phone Number..." 
              placeholderTextColor={"black"}
              underlineColorAndroid='transparent' 
              value={this.state.phoneNumber}
              onChangeText={(phoneNumber) => this.setState({
                phoneNumber
              })}/>
          
        </View>
        
        <Text style={{ textAlign: "left", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10, paddingLeft: 5, paddingTop: 7, paddingBottom: 5 }}>Re-Enter Phone #</Text>
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
              placeholderTextColor={"black"}
              underlineColorAndroid='transparent' 
              value={this.state.phoneNumberReEnter}
              onChangeText={(phoneNumberReEnter) => this.setState({
                phoneNumberReEnter
              })}/>
        </View></React.Fragment> : <React.Fragment><Text style={{ textAlign: "left", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10, paddingLeft: 5, paddingTop: 7, paddingBottom: 5 }}>Email Address</Text><View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => {
            this.setState({
              showEmail: !this.state.showEmail,
              email: "",
              emailReEnter: ""
            })
          }}><Image style={styles.inputIcon} source={require("../../../assets/icons/mail-two.png")}/></TouchableOpacity>
          <TextInput style={styles.inputs}
              placeholder="Enter Your Email..."  
              placeholderTextColor={"black"}
              value={this.state.email}
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({
                email
              })}/>
        </View>
        
        <Text style={{ textAlign: "left", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10, paddingLeft: 5, paddingTop: 7, paddingBottom: 5 }}>Re-Enter Email</Text>
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
              placeholderTextColor={"black"}
              placeholder="Re-Enter Your Email..."
              underlineColorAndroid='transparent'
              onChangeText={(emailReEnter) => this.setState({
                emailReEnter
              })}/>
        </View></React.Fragment>}
        <Text style={{ textAlign: "left", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10, paddingLeft: 5, paddingTop: 7, paddingBottom: 5 }}>Password</Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => {
            this.setState({
              shown: !this.state.shown
            })
          }}>
            <Image style={styles.inputIcon} source={require("../../../assets/icons/login.png")}/>
          </TouchableOpacity>
          <TextInput style={styles.inputs} 
              placeholderTextColor={"black"}
              value={this.state.password}
              placeholder="Enter a password" 
              secureTextEntry={this.state.shown}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({
                password
              })}/>
        </View>
        <Text style={{ textAlign: "left", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10, paddingLeft: 5, paddingTop: 7, paddingBottom: 5 }}>Birthdate</Text>
        <View style={styles.inputContainer}>
          <DatePicker
          style={{width: 250 }}
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
        <Text style={{ textAlign: "left", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10 , paddingLeft: 5, paddingTop: 7, paddingBottom: 5}}>Username</Text>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../../../assets/icons/user.png")}/>
          <TextInput style={styles.inputs} 
              placeholderTextColor={"black"}
              value={this.state.username}
              placeholder="Enter Your Username..."
              underlineColorAndroid='transparent'
              onChangeText={(username) => this.setState({
                username
              })}/>
        </View>
        <Text style={{ textAlign: "left", fontSize: 24, color: "white", fontWeight: "bold", paddingBottom: 10, paddingLeft: 5, paddingTop: 7, paddingBottom: 5 }}>Hometown</Text>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../../../assets/icons/real.png")}/>
          <TextInput style={styles.inputs} 
              value={this.state.hometown}
              placeholderTextColor={"black"}
              placeholder="Enter Your Hometown..."
              underlineColorAndroid='transparent'
              onChangeText={(hometown) => 
                this.setState({
                  hometown
                })}/>
        </View>
        
       
        <View style={{ marginBottom: 30 }}>
        <Text style={{ textAlign: "left", fontSize: 20, fontWeight: "bold", marginBottom: 20 , paddingLeft: 5, paddingTop: 7, paddingBottom: 5, color: "white"}}>Select a profile picture</Text>
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
             style={this.state.base64.length === 0 ? {
               paddingVertical: 30,
               width: 150,
               height: 150,
               borderRadius: 75, 
               tintColor: "#613DC1"
             } : {
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
         <View style={{ marginBottom: 30 }}>
        <Text style={{ textAlign: "left", fontSize: 20, maxWidth: width - 125, fontWeight: "bold", marginBottom: 20 , paddingLeft: 5, paddingTop: 7, paddingBottom: 5, color: "white"}}>Select your sign-in authentication verifcation image...</Text>
        <View style={{ borderBottomWidth: 3, borderBottomColor: "white", maxWidth: width - 125, }} />
        <Text style={{ color: "white", padding: 10, maxWidth: width - 125, paddingBottom: 20, fontWeight: "bold" }}>Take a CLEAR headshot of your face - this picture will be used to authenticate you as the account owner when signing in to prevent secuirty threats</Text>
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
            chooseFromLibraryButtonTitle: null 
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
        </View>
        <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={() => {
          this.handleSubmission();
        }}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableHighlight>
        
        </ScrollView>
      </View>
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
      borderColor: 'black',
      color: "black"
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
 