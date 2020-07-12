import React, { Fragment, Component } from 'react'
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
  TouchableWithoutFeedback
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Content, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import NavigationDrawer from "../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import ProgressiveImage from "../../image/image.js";
import { connect } from "react-redux";
import axios from "axios";

const URL = "http://recovery-social-media.ngrok.io";

class ConfirmFriendPage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false
  };
}
	acceptRequest = () => {
		const passed = this.props.route.params.data;

		console.log("accept request...", passed);

		axios.post(`${URL}/accept/friend/request`, {
			username: this.props.username,
			requester: passed.user,
			requestID: passed.id
		}).then((res) => {
			if (res.data.message === "You've accepted this friend request!") {
				console.log(res.data);
				alert(res.data.message);

				setTimeout(() => {
					this.props.navigation.navigate("notifications");
				}, 2300)
			}
		}).catch((err) => {
			console.log(err);
		})
	}
	declineRequest = () => {
		const { route, username } = this.props;

		const passed = route.params.data;

		axios.post(`${URL}/decline/friend/request`, {
			username: this.props.username,
			requester: passed.user,
			requestID: passed.id
		}).then((res) => {
			if (res.data.message === "You've declined this friend request!") {
				console.log(res.data);
				alert(res.data.message);

				setTimeout(() => {
					this.props.navigation.navigate("notifications");
				}, 2300)
			}
		}).catch((err) => {
			console.log(err);
		});
	}
	render() {
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;

		const data = this.props.route.params.data;
		console.log("data", data);
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header>
				  <Left>
				    <NativeButton onPress={() => {
				      console.log("clicked.");
				      this.props.navigation.navigate("dashboard");
				    }} hasText transparent>
				      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/construction.png")}/>
				    </NativeButton>
				  </Left>
				  <Body>
				    <Title>Friend Request</Title>
				  </Body>
				  <Right>
				    <NativeButton onPress={() => {
				    	console.log("clicked user interface...");
				    	this.setState({
				    		isOpen: true
				    	})
				    }} hasText transparent>
				      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/user-interface.png")}/>
				    </NativeButton>
				  </Right>
				</Header>
				<ScrollView contentContainerStyle={{ alignItems: "center" }} style={styles.container}>
			        {/*<Image style={styles.icon} source={require("../../../assets/icons/invite.png")} />*/}
			        <ProgressiveImage source={{ uri: data.picture }} style={styles.personImage} />
			        <Text style={styles.title}>Congratulations, you have a new friend request... please accept or deny!</Text>
			        <Text style={styles.description}>You have a new potential friend! Accept or decline the request below...</Text>
			        <TouchableHighlight onPress={() => {
			        	this.acceptRequest();
			        }} style={[styles.buttonContainer, styles.loginButton]}>
			          <Text style={styles.buttonTextOne}>Accept Request</Text>
			        </TouchableHighlight>
			        <TouchableHighlight onPress={() => {
			        	this.declineRequest();
			        }} style={[styles.buttonContainerTwo, styles.loginButtonTwo]}>
			          <Text style={styles.buttonTextTwo}>Decline Request</Text>
			        </TouchableHighlight>
			      </ScrollView>
			</SideMenu>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop:50
  },
  personImage: {
  	width: 250, 
  	height: 250
  },
  icon:{
    width:40,
    height:40,
    position: "absolute",
    tintColor: "#4E148C"
  },
  title:{
    fontSize:24,
    textAlign: 'center',
    marginTop:22,
    color: "#5F6D7A"
  },
  description: {
    marginTop:20,
    textAlign: 'center',
    color: "#A9A9A9",
    fontSize:16,
    margin:40,
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    borderWidth: 3,
    borderColor: "black"
  },
  loginButton: {
    backgroundColor: "#97DFFC",
  },
  buttonContainerTwo: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:100,
    width:250,
    borderRadius:30,
    borderWidth: 3,
    borderColor: "black"
  },
  loginButtonTwo: {
    backgroundColor: "#613DC1",
  },
  buttonTextOne: {
    color: "black",
    fontSize:20,
  },
  buttonTextTwo: {
  	color: "white",
  	fontSize: 20
  }
});
const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username
	}
}

export default connect(mapStateToProps, {  })(ConfirmFriendPage);