import React, { Component, Fragment } from 'react'
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


class FriendListMain extends Component {
constructor(props) {
  super(props);

  this.state = {};
}

	render() {
		return (
			<Fragment>
				<Header>
		          <Left>
		            <NativeButton onPress={() => {
		              this.props.navigation.navigate("dashboard");
		            }} hasText transparent>
		              <Image style={{ width: 35, height: 35, marginBottom: 10 }} source={require("../../../assets/icons/construction.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title>Friends-List</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked chat...");
		            	this.props.navigation.navigate("chat-users");
		            }} hasText transparent>
		              <Image style={{ width: 35, height: 35, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
		            </NativeButton>
		          </Right>
		        </Header>

		        <Text style={{ fontSize: 35, color: "darkred", marginTop: 50, left: 14 }}>You have landed on the friends page which has not been built yet...</Text>
			</Fragment>
		)
	}
}

export default FriendListMain;