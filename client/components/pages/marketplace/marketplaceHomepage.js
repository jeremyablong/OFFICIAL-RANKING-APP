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
  Animated
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import NavigationDrawer from "../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import Swiper from "react-native-deck-swiper";

const { width, height } = Dimensions.get("window");

class MarketplaceHomepage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false
  };
}
	swipeLeft = () => {
		console.log("swiped left...");
	}
	swipeRight = () => {
		console.log("swiped right...");
	}
	render() {
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header style={{ width: width }}>
				  <Left>
				    <NativeButton onPress={() => {
				      this.props.navigation.navigate("profile-settings");
				    }} hasText transparent>
				     <NativeText>Back</NativeText>
				    </NativeButton>
				  </Left>
				  <Body>
				    <Title>Marketplace</Title>
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
				    {/*<NativeButton onPress={() => {
				    	console.log("clicked chat...");
				    	this.props.navigation.navigate("chat-users");
				    }} hasText transparent>
				      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
				    </NativeButton>*/}
				  </Right>
				</Header>
			
			<ScrollView style={{ width: width, height, backgroundColor: "white" }}>
				<Swiper
		            cards={['DO', 'MORE', 'OF', 'WHAT', 'MAKES', 'YOU', 'HAPPY']}
		            renderCard={(card) => {
		                return (
		                    <View style={styles.card}>
		                        <Text style={styles.text}>{card}</Text>
		                    </View>
		                )
		            }}
		            onSwiped={(cardIndex) => {
		            	console.log(cardIndex)
		        	}}
		            onSwipedAll={() => {
		            	console.log('onSwipedAll')
		        	}} 
		        	cardStyle={{ height: height * 0.50 }}
		            cardIndex={0}
		            backgroundColor={'#4FD0E9'}
		            stackSize= {3}>
		            <Button
		                onPress={() => {
		                	console.log('oulala')
		            	}}
		                title="Press me">
		                You can press me
		            </Button>
		        </Swiper>
			</ScrollView>
			</SideMenu>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white"
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  }
});

export default MarketplaceHomepage;