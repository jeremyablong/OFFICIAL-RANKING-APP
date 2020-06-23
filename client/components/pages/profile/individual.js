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
  ScrollView, 
  FlatList
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab } from 'native-base';
import axios from "axios";
import Modal from 'react-native-modal';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

class ProfileIndividual extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  	user: null,
  	modalIsVisible: false,
  	message: ""
  };
}
	componentDidMount() {
	  	axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
	  		username: this.props.route.params.user.username
	  	}).then((res) => {
	  		console.log(res.data);
	  		if (res.data.message === "FOUND user!") {
	  			this.setState({
		  			user: res.data.user
		  		})
	  		}
	  	}).catch((err) => {
	  		console.log(err);
	  	})
	}
	sendMessage = () => {
		const { user, message } = this.state;

		console.log(this.props.username);

		axios.post("http://recovery-social-media.ngrok.io/send/private/message", {
	  		sender: this.props.username,
	  		reciever: user.username,
	  		message
	  	}).then((res) => {
	  		console.log(res.data);
	  		if (res.data.message === "Successfully updated both users!") {
	  			alert("You've successfully messaged this user!");

	  			setTimeout(() => {
	  				this.setState({
	  					modalIsVisible: false
	  				})
	  			}, 3000)
	  		}
	  	}).catch((err) => {
	  		console.log(err);
	  	})
	}
	renderModalConstant = () => {
		return (
			<Modal isVisible={this.state.modalIsVisible}>
	          <ImageBackground source={require("../../../assets/images/painted.jpg")} style={{ flex: 1, height: height, backgroundColor: "white", width: width * 0.90, alignItems: "center", justifyContent: "center" }}>
	          <KeyboardAwareScrollView style={{ marginTop: 30 }} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
	          <Image style={{ width: 300, height: 300, marginBottom: 40}} source={require("../../../assets/images/123.jpg")} />
	          <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, marginBottom: 20 }}>You are messaging {this.state.user !== null ? this.state.user.fullName : "--"}... </Text>
	            <AutoGrowingTextInput onChangeText={(message) => {
	            	this.setState({
	            		message
	            	})
	            }} placeholderTextColor="black" style={styles.textInput} placeholder={'Enter Your Message Here...'} />
	            <TouchableOpacity onPress={() => {
	              	this.sendMessage();
	              }} style={styles.buttonContainerTwo}>
	                <Fragment><Image style={{ width: 30, height: 30 }} source={require("../../../assets/icons/message.png")} /><Text style={{ color: "white" }}>   Send Message...</Text></Fragment>  
	              </TouchableOpacity>
	            <TouchableOpacity onPress={() => {
	              	this.setState({
	              		modalIsVisible: false
	              	})
	              }} style={styles.buttonContainer}>
	                <Fragment><Image style={{ width: 30, height: 30 }} source={require("../../../assets/icons/close.png")} /><Text>  Close This Modal</Text></Fragment>  
	              </TouchableOpacity>
	          </KeyboardAwareScrollView>
	          </ImageBackground>
	        </Modal>
		);
	}
	render() {
		// const userProps = this.props.route.params.user;
		console.log(this.state);
		const { user } = this.state;
		return (
			<Fragment>
				<Header>
		          <Left>
		            <NativeButton onPress={() => {
		              this.props.navigation.navigate("dashboard");
		            }} hasText transparent>
		             <NativeText>Back</NativeText>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title>{user !== null ? user.username : "--"}</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked chat...");
		            	this.props.navigation.navigate("chat-users");
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
		            </NativeButton>
		          </Right>
		        </Header>
		        <ScrollView style={styles.container}>
				  {this.renderModalConstant()}
		          <View style={styles.header}><TouchableOpacity><Image style={{ width: 50, height: 50, position: "absolute", top: 5, left: 5 }} source={require("../../../assets/icons/cloud.png")} /></TouchableOpacity></View>
		          <Image style={styles.avatar} source={{uri: user !== null ? `https://s3.us-west-1.wasabisys.com/rating-people/${user.profilePic}` : 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
		          <View style={styles.body}>
		            <View style={styles.bodyContent}>
		              <Text style={styles.name}>{user !== null ? user.fullName : "--"}</Text>
		              <Text style={styles.info}>{user !== null ? user.username : "--"}</Text>
		              <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
		              
		              {this.props.username !== this.props.route.params.user.username ? <TouchableOpacity onPress={() => {
		              	this.setState({
		              		modalIsVisible: true
		              	})
		              }} style={styles.buttonContainer}>
		                <Fragment><Image style={{ width: 30, height: 30 }} source={require("../../../assets/icons/mail-three.png")} /><Text>   Message This User</Text></Fragment>  
		              </TouchableOpacity> : null}            
		            {/*  <TouchableOpacity style={styles.buttonContainer}>
		                <Text>Opcion 2</Text> 
		              </TouchableOpacity>*/}
		            </View>
		        </View>
		      </ScrollView>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  header:{
    backgroundColor: "#00BFFF",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"black",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "black",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
  buttonContainerTwo: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "black",
  },
  textInput: {
  	backgroundColor: "white",
  	padding: 10,
  	width: 250,
  	borderWidth: 2,
  	borderColor: "black"
  }
});
const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username
	}
}
export default connect(mapStateToProps, {  })(ProfileIndividual);