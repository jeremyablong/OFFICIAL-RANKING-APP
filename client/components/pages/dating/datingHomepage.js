import React, { Component, Fragment } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView, 
  TextInput, 
  ImageBackground
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import NavigationDrawer from "../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import RNPickerSelect from 'react-native-picker-select';
import axios from "axios";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

const URL = "http://recovery-social-media.ngrok.io";

class DatingHomepage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false,
  	preference: "",
  	age: "",
  	pronoun: "",
  	registered: false,
  	shown: null
  };
}
	handleSubmission = () => {
		console.log("submitted...");

		const { age, pronoun, preference } = this.state;

		if (age.length > 0 && pronoun.length > 0 && preference.length > 0) {
			axios.post(`${URL}/register/dating`, {
				username: this.props.username,
				preference,
				pronoun,
				age
			}).then((res) => {
				console.log(res.data);
				if (res.data.message === "Successfully signed up for dating!") {
					alert("Successfully registered to date!");
					this.props.navigation.navigate("upload-pictures-dating");
				}
			}).catch((err) => {
				console.log(err);
			})
		} else {
			alert("Please complete each and every field, thank you!")
		}
	}
	componentDidMount() {
		axios.post(`${URL}/check/if/dating/applicable`, {
			username: this.props.username
		}).then((res) => {
			console.log(res.data);
			if (res.data.registered === true) {
				console.log(true);
				this.setState({
					shown: true
				})
				// this.props.navigation.navigate("dating-homepage-after");
				this.props.navigation.navigate("upload-pictures-dating");
			} else {
				this.setState({
					shown: false
				})
				console.log(false);
			}
		}).catch((err) => {
			console.log(err);
		})
	}
	renderContent = () => {
		if (this.state.shown === false) {
			return (
				<Fragment> 
					<View style={styles.textContainer}>
						<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>What gender's are you interested in?</Text>
					</View>
				       
				        <View style={styles.inputContainerCustom}>

				          <RNPickerSelect 
					            onValueChange={(value) => {
					            	this.setState({
					            		preference: value
					            	})
					            }}
					            items={[
					                { label: 'Women', value: 'women' },
					                { label: 'Men', value: 'men' },
					                { label: 'Both - Men & Women', value: 'both' }
					            ]}
					        />
				        </View>
					<View style={styles.textContainer}>
						<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>What is your age?</Text>
					</View>
				        <View style={styles.inputContainerCustom}>

				          <RNPickerSelect 
					            onValueChange={(value) => {
					            	this.setState({
					            		age: value
					            	})
					            }}
					            items={[
					                { label: '18', value: '18' },
					                { label: '19', value: '19' },
					                { label: '20', value: '20' },
					                { label: '21', value: '21' },
					                { label: '22', value: '22' },
					                { label: '23', value: '23' },
					                { label: '24', value: '24' },
					                { label: '25', value: '25' },
					                { label: '26', value: '26' },
					                { label: '27', value: '27' },
					                { label: '28', value: '28' },
					                { label: '29', value: '29' },
					                { label: '30', value: '30' },
					                { label: '31', value: '31' },
					                { label: '32', value: '32' },
					                { label: '33', value: '33' },
					                { label: '34', value: '34' },
					                { label: '35', value: '35' },
					                { label: '36', value: '36' },
					                { label: '37', value: '37' },
					                { label: '38', value: '38' },
					                { label: '39', value: '39' },
					                { label: '40', value: '40' },
					                { label: '41', value: '41' },
					                { label: '42', value: '42' },
					                { label: '43', value: '43' },
					                { label: '44', value: '44' },
					                { label: '45', value: '45' },
					                { label: '46', value: '46' },
					                { label: '47', value: '47' },
					                { label: '48', value: '48' },
					                { label: '49', value: '49' },
					                { label: '50', value: '50' },
					                { label: '51', value: '51' },
					                { label: '52', value: '52' },
					                { label: '53', value: '53' },
					                { label: '54', value: '54' },
					                { label: '55', value: '55' },
					                { label: '56', value: '56' },
					                { label: '57', value: '57' },
					                { label: '58', value: '58' },
					                { label: '59', value: '59' },
					                { label: '60+', value: '60+' }
					            ]}
					        />
				        </View>
				     <View style={styles.textContainer}>
						<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>What is your preferred name/pro-noun?</Text>
					</View>
				        <View style={styles.inputContainer}>
				          <TextInput style={styles.inputs}
				              placeholder="They/He/Etc..."
				              secureTextEntry={false}
				              underlineColorAndroid='transparent'
				              onChangeText={(pronoun) => {
								this.setState({
									pronoun
								})
				              }}/>
				        </View>

				        <TouchableOpacity style={styles.btnByRegister} onPress={() => {

				        }}>
				            <Text style={styles.textByRegister}>You agree to our terms and conditions by registering.</Text>
				        </TouchableOpacity>

				        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => {
							this.handleSubmission();
				        }}>
				          <Text style={styles.loginText}>Sign-up & Start Dating!</Text>
				        </TouchableOpacity>


				        <TouchableOpacity style={styles.buttonContainer} onPress={() => {

				        }}>
				            <Text style={styles.btnText}>Questions or concerns?</Text>
				        </TouchableOpacity>
				</Fragment>
			);
		} else if (this.state.shown === true) {
			return (
				<View>
					<View style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 15 }}>
						<Text style={{ color: "white", fontSize: 25, fontWeight: "bold", textAlign: "center" }}>You have already registered to date... Continue to dating page by clicking the button below.</Text>
						<View style={{ borderBottomColor: "white", borderWidth: 3, marginTop: 50, marginBottom: 50 }} />
						<NativeButton onPress={() => {
							this.props.navigation.navigate("dating-homepage-after")
						}} style={{ justifyContent: "center", alignContent: "center", alignItems: "center", backgroundColor: "#613DC1" }}>
							<NativeText>Go To Dating Page...</NativeText>
						</NativeButton>
					</View>
				</View>
			);
		}
	}
	render() {
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header>
				  <Left>
				    <NativeButton onPress={() => {
				      this.props.navigation.navigate("profile-settings");
				    }} hasText transparent>
				      <NativeText>Back</NativeText>
				    </NativeButton>
				  </Left>
				  <Body>
				    <Title>Dating</Title>
				  </Body>
				  <Right>
				    <NativeButton onPress={() => {
		            	console.log("clicked user interface...");
		                 {/*this.props.navigation.navigate("chat-users");*/}
		                 this.setState({
		                 	isOpen: true
		                 })
		            }} hasText transparent>
		              <Image style={this.props.dark_mode ? { width: 45, height: 45, marginBottom: 10, tintColor: "white" } : { width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/user-interface.png")}/>
		            </NativeButton>
				  </Right>
				</Header>
				{/*<*/}{/*View style={{ width, height, backgroundColor: "white" }}>*/}
					<ImageBackground source={require("../../../assets/images/bloom.jpg")} style={styles.container}>
						{this.renderContent()}	
				    </ImageBackground>
				{/*</View>*/}
			</SideMenu>
			</Fragment>
		)
	}
}
const resizeMode = 'center';

const styles = StyleSheet.create({
	textContainer: {
		backgroundColor: 'rgba(0, 0, 0, 0.7)', 
		width: 325, 
		padding: 10,
		borderRadius: 30, 
		marginBottom: 20 
		},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height,
    width,
    backgroundColor: "white"
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
  inputContainerCustom: {
  	paddingTop: 13,
  	paddingLeft: 15,
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

    elevation: 5
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
  btnByRegister: {
    height:15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:20,
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
    fontWeight:'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  textByRegister:{
    color:"white",
    fontWeight:'bold',
    textAlign:'center',
    fontSize: 11,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
});

const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username,
		dark_mode: state.mode.dark_mode
	}
}
export default connect(mapStateToProps, { })(DatingHomepage);