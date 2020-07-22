import React, { Component, Fragment } from 'react';
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
  Linking
} from 'react-native';
import { Container, Header, Card, CardItem, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab } from 'native-base';
import NavigationDrawer from "../../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

class ProfileMenuListDisplay extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false
  };
}
	render() {
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
			<Fragment>
			<Header style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
			  <Left>
			    <NativeButton onPress={() => {
			      this.props.navigation.navigate("public-wall");
			    }} hasText transparent>
			     <NativeText style={this.props.dark_mode ? { color: "white" } : null}>Back</NativeText>
			    </NativeButton>
			  </Left>
			  <Body>
			    <Title style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>News</Title>
			  </Body>
			  <Right>
			    <NativeButton onPress={() => {
			    	console.log("clicked user interface...");
			         {/*this.props.navigation.navigate("chat-users");*/}
			         this.setState({
			         	isOpen: true
			         })
			    }} hasText transparent>
			      <Image style={this.props.dark_mode ? { tintColor: "white", width: 45, height: 45, marginBottom: 10 } : { width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/user-interface.png")}/>
			    </NativeButton>
			    {/*<NativeButton onPress={() => {
			    	console.log("clicked chat...");
			    	this.props.navigation.navigate("chat-users");
			    }} hasText transparent>
			      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
			    </NativeButton>*/}
			  </Right>
			</Header>
				<ScrollView style={this.props.dark_mode ? { height, width, backgroundColor: "black" } : { height, width, backgroundColor: "white" }}>
					<List style={this.props.dark_mode ? { height, width, backgroundColor: "black" } : { height, width, backgroundColor: "white" }}>
			            <ListItem>
			              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}><Image source={require("../../../../assets/icons/real.png")} style={this.props.dark_mode ? styles.iconDark : styles.icon} /> Story Archive</NativeText>
			            </ListItem>
			            <ListItem>
			              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}><Image source={require("../../../../assets/icons/edit.png")} style={this.props.dark_mode ? styles.iconDark : styles.icon} /> Edit Profile</NativeText>
			            </ListItem>
			            <ListItem>
			              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}><Image source={require("../../../../assets/icons/post.png")} style={this.props.dark_mode ? styles.iconDark : styles.icon} /> Saved Items</NativeText>
			            </ListItem>
			            <ListItem>
			              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}><Image source={require("../../../../assets/icons/registration.png")} style={this.props.dark_mode ? styles.iconDark : styles.icon} /> Activity Log</NativeText>
			            </ListItem>
			            <ListItem>
			              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}><Image source={require("../../../../assets/icons/write.png")} style={this.props.dark_mode ? styles.iconDark : styles.icon} /> Review Timeline</NativeText>
			            </ListItem>
			            <ListItem>
			              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}><Image source={require("../../../../assets/icons/lock.png")} style={this.props.dark_mode ? styles.iconDark : styles.icon} /> View Privacy Shortcuts</NativeText>
			            </ListItem>
			            <ListItem>
			              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}><Image source={require("../../../../assets/icons/search.png")} style={this.props.dark_mode ? styles.iconDark : styles.icon} /> Search Profile</NativeText>
			            </ListItem>
			            <ListItem>
			              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}><Image source={require("../../../../assets/icons/death.png")} style={this.props.dark_mode ? styles.iconDark : styles.icon} /> Memorization Settings - Life After</NativeText>
			            </ListItem>
			            <ListItem>
			              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}><Image source={require("../../../../assets/icons/wifi.png")} style={this.props.dark_mode ? styles.iconDark : styles.icon} /> Connect</NativeText>
			            </ListItem>
			          </List>
				</ScrollView>

			</Fragment>
		 </SideMenu>
		)
	}
}
const mapStateToProps = state => {
	return {
		dark_mode: state.mode.dark_mode
	}
}
const styles = StyleSheet.create({
	icon: {
		width: 25,
		height: 25,
		tintColor: "black"
	},
	iconDark: {
		tintColor: "white",
		width: 25, 
		height: 25
	}
})

export default connect(mapStateToProps, {  })(ProfileMenuListDisplay);