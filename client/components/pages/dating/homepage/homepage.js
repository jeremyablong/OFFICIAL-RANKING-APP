import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet, Button, Dimensions, Image } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import NavigationDrawer from "../../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';



const { width, height } = Dimensions.get("window");

const URL = "http://recovery-social-media.ngrok.io";

class DatingSwiperDeck extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false
  };
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
				    <Title>Randomized</Title>
				  </Body>
				  <Right>
				    <NativeButton onPress={() => {
				    	console.log("clicked user interface...");
				        this.setState({
				        	isOpen: true
				        })
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
				<View style={styles.container}>
			        <Swiper
			            cards={['DO', 'MORE', 'OF', 'WHAT', 'MAKES', 'YOU', 'HAPPY']}
			            renderCard={(card) => {
			                return (
			                    <View style={styles.card}>
			                        <Text style={styles.text}>{card}</Text>
			                    </View>
			                )
			            }}
			            onSwiped={(cardIndex) => {console.log(cardIndex)}}
			            onSwipedAll={() => {console.log('onSwipedAll')}}
			            cardIndex={0}
			            backgroundColor={'#4FD0E9'}
			            stackSize= {3}>
			            <NativeButton 
			            	style={{ color: "white", alignItems: "center", justifyContent: "center" }}
			                onPress={() => {
			                	console.log("changed settings...");
			                }}>
			                <NativeText>
								Change Settings
			                </NativeText>
			            </NativeButton>
			        </Swiper>
			    </View>
			   </SideMenu>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#858AE3"
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
    maxHeight: height * 0.75
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  }
});

export default DatingSwiperDeck;