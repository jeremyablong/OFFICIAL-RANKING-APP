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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import RNPickerSelect from 'react-native-picker-select';


const { width, height } = Dimensions.get("window");

export class EditProfileHomepage extends Component {
	render() {
		return (
			<Fragment>
				<Header style={{ width: width }}>
		          <Left>
		            <NativeButton onPress={() => {
		              this.props.navigation.navigate("profile-settings");
		            }} hasText transparent>
		             <NativeText>Back</NativeText>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title>Testing</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked user interface...");
		                 {/*this.props.navigation.navigate("chat-users");*/}
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/user-interface.png")}/>
		            </NativeButton>
		            {/*<NativeButton onPress={() => {
		            	console.log("clicked chat...");
		            	this.props.navigation.navigate("chat-users");
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
		            </NativeButton>*/}
		          </Right>
		        </Header>
				<ImageBackground source={require("../../../../assets/images/toast.jpg")} style={styles.containerMain}>
			        
				<View style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 50 }}>
				<Text style={styles.label}>Where do you work?</Text>
				<View style={styles.searchContainer}>

					<GooglePlacesAutocomplete 
					  placeholderTextColor="black"
				      placeholder='Search'
				      onPress={(data, details = null) => {
				        // 'details' is provided when fetchDetails = true
				        console.log(data, details);
				      }} 
				      styles={{
				      	listView: {
				      		backgroundColor: "white"
				      	},
					    textInputContainer: {
					      backgroundColor: 'rgba(0,0,0,0)',
					      borderTopWidth: 0,
					      borderBottomWidth: 0,
					    },
					    textInput: {
					      marginLeft: 0,
					      marginRight: 0,
					      height: 38,
					      color: '',
					      fontSize: 16,
					    },
					    predefinedPlacesDescription: {
					      color: '#1faadb',
					    },
					  }}
				      query={{
				        key: 'AIzaSyBdJh-NGr0nCUTTcawLgiNsQuDsKtT8ERw',
				        language: 'en',
				        types: "establishment"
				      }}
				    />
			    </View>   
			    <AutoGrowingTextInput placeholderTextColor="black" style={styles.textInput} placeholder={'Your a bio...'} />
			<View style={styles.viewContainer}>
			    <RNPickerSelect 
		            onValueChange={(value) => console.log(value)}
		            items={[
		                { label: 'Single', value: 'single' },
		                { label: 'In a relationship', value: 'in-a-relationship' },
		                { label: "It's complicated", value: 'its-complicated' },
		                { label: "Sleeping around", value: "sleeping-around" },
		                { label: "Taking a break", value: "taking-a-break" },
		                { label: "No-Response", value: "no-response" },
		                { label: "Confused", value: "confused" }
		            ]}
		        />
		    </View>
			        <View style={styles.inputContainer}>
			          <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/speech-bubble/ultraviolet/50'}}/>
			          <TextInput placeholderTextColor="black" style={[ styles.messageInput]}
			              placeholder="Message"
			              underlineColorAndroid='transparent'
			              />
			        </View>

			        <View style={styles.center}>
						<TouchableHighlight style={[styles.buttonContainer, styles.sendButton]} onPress={() => this.onClickListener('login')}>
				          <Text style={styles.buttonText}>Update Profile Information</Text>
				        </TouchableHighlight>
			        </View>
				</View>
			       
			    </ImageBackground>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	viewContainer: {
		width: 250, 
		backgroundColor: "white", 
		height: 35, 
		paddingTop: 10, 
		marginBottom: 30,
		paddingLeft: 10
	},
	label: {
		fontSize: 18, 
		color: "white",
		fontWeight: "bold",
		paddingBottom: 10
	},
	textInput: {
		width: 250,
		height: 65,
		minHeight: 45,
		backgroundColor: "white",
		paddingTop: 10,
		paddingLeft: 10,
		paddingBottom: 10,
		marginBottom: 30
	},
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    height: height,
    width: width
  },
  center: {
	justifyContent: "center", 
	alignItems: "center", 
	alignContent: "center"
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
    searchContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      width:250,
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
  sendButton: {
    backgroundColor: "#613DC1",
  },
  buttonText: {
    color: 'white',
  }
}); 

export default EditProfileHomepage;