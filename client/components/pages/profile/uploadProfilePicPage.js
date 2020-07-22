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
  Keyboard
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import PhotoUpload from 'react-native-photo-upload';
import axios from "axios";
import { connect } from "react-redux";



const { width, height } = Dimensions.get("window");

class UploadProfilePicPage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	title: "",
  	description: "",
  	avatar: null
  };
}
	handleSubmission = () => {

		const { title, description, avatar } = this.state;

		console.log("handle submission...");

		if (title.length > 0 && avatar !== null) {
			axios.post("http://recovery-social-media.ngrok.io/post/new/profile/picture/page", {
				username: this.props.username,
				title,
				description,
				avatar
			}).then((res) => {
				if (res.data.message === "Successfully added new profile!") {
					console.log(res.data);
					this.setState({
						title: "",
						description: ""
					}, () => {
						alert(res.data.message);
					})
					
				}
			}).catch((err) => {
				console.log(err);
			})
		} else {
			alert("Please upload a profile picture and enter a title...");
		}
	}
	render() {
		console.log("this.state :", this.state);
		return (
			<Fragment>
				<Header style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
		          <Left>
		            <NativeButton onPress={() => {
		              if (this.props.route.params.publicProfile === true) {
		              	this.props.navigation.navigate("public-wall");
		              } else {
		              	this.props.navigation.navigate("profile-individual");
		              }
		            }} hasText transparent>
		             <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Back</NativeText>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Profile Picture</Title>
		          </Body> 
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked chat...");
		            	this.props.navigation.navigate("chat-users");
		            }} hasText transparent>
		              <Image style={this.props.dark_mode ? { width: 45, height: 45, marginBottom: 10, tintColor: "white" } : { width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
		            </NativeButton>
		          </Right>
		        </Header>
				<ImageBackground source={require("../../../assets/images/yoga.jpg")} style={{ height, flex: 1, maxHeight: height, width }}>
					<PhotoUpload
					   onPhotoSelect={avatar => {
					     if (avatar) {
					       console.log('Image base64 string: ', avatar);
					       this.setState({
					       	avatar
					       }, () => {
					       	Keyboard.dismiss();
					       })
					     }
					   }}
					 >
					   <Image
					     style={this.state.avatar ? styles.picNoTint : styles.picTint}
					     resizeMode='cover'
					     source={require("../../../assets/icons/user.png")}
					   />
					 </PhotoUpload>
					 <View style={styles.container}>
				        <View style={styles.inputContainer}>
				          <TextInput placeholderTextColor={"black"} value={this.state.title} style={styles.inputs}
				              placeholder="Enter your title... (REQUIRED)"
				              underlineColorAndroid='transparent'
				              onChangeText={(title) => {
				              	this.setState({
				              		title
				              	})
				              }}/>
				          <Image style={styles.inputIcon} source={require("../../../assets/icons/title.png")}/>
				        </View>
				        
				        <View style={styles.inputContainer}>
				          <TextInput placeholderTextColor={"black"} value={this.state.description} style={styles.inputs}
				              placeholder="Enter your post description... (NOT required)"
				              underlineColorAndroid='transparent'
				              onChangeText={(description) => {
				              	this.setState({
				              		description
				              	})
				              }}/>
				          <Image style={styles.inputIcon} source={require("../../../assets/icons/description.png")}/>
				        </View>

				        <NativeButton style={styles.submitBtn} onPress={() => {
				        	this.handleSubmission();
				        }}>
				            <NativeText style={{ color: "white" }}>Submit Your New Profile Picture</NativeText>
				        </NativeButton>
				      </View>
				</ImageBackground>
				<View style={{ position: "absolute", bottom: 0, width: width }}>
					<Footer style={this.props.dark_mode ? { backgroundColor: "black" } : {  }}>
			          <FooterTab>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("dashboard");
				            }}>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../assets/icons/home-run.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("notifications");
				            }}>
				            <Badge style={{ marginBottom: -15, marginLeft: 5 }}><NativeText>3</NativeText></Badge>
			               <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../assets/icons/notification.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("chat-users");
				            }}>
				          <Badge style={{ marginBottom: -10 }}><NativeText>51</NativeText></Badge>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../assets/icons/mail-three.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("public-wall");
				            }}>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../assets/icons/wall.png")} />
			            </NativeButton>
		              <NativeButton onPress={() => {
		                  this.props.navigation.navigate("profile-settings");
		                }}>
		                <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../assets/icons/list.png")} />
		              </NativeButton>
			          </FooterTab>
			        </Footer>
				</View>
			</Fragment>
		)
	}
}
const resizeMode = 'center';

const styles = StyleSheet.create({
  picNoTint: {
	paddingVertical: 30,
    width: 150,
    height: 150,
    borderRadius: 75	
  },
  picTint: {
	paddingVertical: 30,
    width: 150,
    height: 150,
    borderRadius: 75,
    tintColor: "#4E148C"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -100
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:300,
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  submitBtn: {
	alignItems: "center", 
	justifyContent: "center", 
	alignContent: "center", 
	backgroundColor: "#858AE3"
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
    marginRight:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:300,
    borderRadius:30,
    backgroundColor:'transparent'
  },
  btnForgotPassword: {
    height:15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom:10,
    width:300,
    backgroundColor:'transparent'
  },
  loginButton: {
    backgroundColor: "#00b5ec",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.50,
    shadowRadius: 12.35,

    elevation: 19,
  },
  loginText: {
    color: 'white',
  },
  bgImage:{
    flex: 1,
    resizeMode,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  btnText:{
    color:"white",
    fontWeight:'bold'
  }
});

const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username,
		dark_mode: state.mode.dark_mode
	}
}


export default connect(mapStateToProps, {  })(UploadProfilePicPage);