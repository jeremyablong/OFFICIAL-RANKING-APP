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
  Keyboard
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import { connect } from "react-redux";
import { authenticated } from "../../../actions/auth/auth.js";


const { width, height } = Dimensions.get("window");

class NotificationsPage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	pusher: null
  };
}
	componentDidUpdate(prevProps, prevState) {
		
	}
	render() {
		return (
			<Fragment>
				<Header>
		          <Left>
		            <NativeButton onPress={() => {
		              this.props.authenticated({});
		              this.props.navigation.navigate("login");
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/logout.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title>Notifications</Title>
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
				
				<View>
					
				</View>
	
		        <View style={styles.footer}>
					<Footer>
			          <FooterTab>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("dashboard");
				            }}>
			              <Image style={styles.icon} source={require("../../../assets/icons/home-run.png")} />
			            </NativeButton>
			            <NativeButton active onPress={() => {
				            	this.props.navigation.navigate("notifications");
				            }}>
				            <Badge style={{ marginBottom: -15, marginLeft: 5 }}><NativeText>3</NativeText></Badge>
			               <Image style={styles.icon} source={require("../../../assets/icons/notification.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("chat-users");
				            }}>
				            <Badge style={{ marginBottom: -10 }}><NativeText>51</NativeText></Badge>
			              <Image style={styles.icon} source={require("../../../assets/icons/mail-three.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("public-wall");
				            }}>
			              <Image style={styles.icon} source={require("../../../assets/icons/wall.png")} />
			            </NativeButton>
			          </FooterTab>
			        </Footer>
		        </View>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	footer: {
		position: "absolute",
		bottom: 0,
		width: width
	},
	icon: {
		width: 35, 
		height: 35
	}
})

export default connect(null, { authenticated })(NotificationsPage);