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
import NavigationDrawer from "../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import axios from "axios";
import moment from "moment";
import ProgressiveImage from "../../image/image.js";

const { width, height } = Dimensions.get("window");

export class NewsHomepage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false,
  	articles: []
  };
}
	componentDidMount() {
	  let url = 'http://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=3e0ac79e7f134798ba7438b1d91397f4';

      axios.get(url).then((res) => {
      	console.log("TOP HEADLINES :", res.data);
      	this.setState({
      		articles: res.data.articles
      	})
      }).catch((err) => {
      	console.log(err);
      })
	}
	handleChangeSearch = (searchValue) => {
		console.log("clicked...", searchValue);

		 let url = `http://newsapi.org/v2/top-headlines?country=us&category=${searchValue}&apiKey=3e0ac79e7f134798ba7438b1d91397f4`;

	      axios.get(url).then((res) => {
	      	console.log("TOP HEADLINES :", res.data);
	      	this.setState({
	      		articles: res.data.articles
	      	})
	      }).catch((err) => {
	      	console.log(err);
	      })
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
				    <Title>News</Title>
				  </Body>
				  <Right>
				    <NativeButton onPress={() => {
				    	console.log("clicked user interface...");
				         {/*this.props.navigation.navigate("chat-users");*/}
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
				<ScrollView style={styles.background}>
					<ScrollView style={{ flex: 1, flexDirection: "row", padding: 20, backgroundColor: "black" }} showsHorizontalScrollIndicator={false} horizontal={true}>
						<NativeButton onPress={() => {
							this.handleChangeSearch("entertainment");
						}} style={styles.roundedBtn} transparent textStyle={{color: '#87838B'}}>
		                  {/*<Icon name="logo-github" />*/}
		                  <NativeText style={styles.nativeBtnText}>Entertainment</NativeText>
		                </NativeButton>
						<NativeButton onPress={() => {
							this.handleChangeSearch("general");
						}} style={styles.roundedBtnLight} transparent textStyle={{color: '#87838B'}}>
		                  {/*<Icon name="logo-github" />*/}
		                  <NativeText style={styles.nativeBtnText}>General</NativeText>
		                </NativeButton>
						<NativeButton onPress={() => {
							this.handleChangeSearch("health");
						}} style={styles.roundedBtn} transparent textStyle={{color: '#87838B'}}>
		                  {/*<Icon name="logo-github" />*/}
		                  <NativeText style={styles.nativeBtnText}>Health</NativeText>
		                </NativeButton>
		                <NativeButton onPress={() => {
							this.handleChangeSearch("science");
						}} style={styles.roundedBtnLight} transparent textStyle={{color: '#87838B'}}>
		                  {/*<Icon name="logo-github" />*/}
		                  <NativeText style={styles.nativeBtnText}>Science</NativeText>
		                </NativeButton>
						<NativeButton onPress={() => {
							this.handleChangeSearch("sports");
						}} style={styles.roundedBtn} transparent textStyle={{color: '#87838B'}}>
		                  {/*<Icon name="logo-github" />*/}
		                  <NativeText style={styles.nativeBtnText}>Sports</NativeText>
		                </NativeButton>
						<NativeButton onPress={() => {
							this.handleChangeSearch("technology");
						}} style={styles.roundedBtnLight} transparent textStyle={{color: '#87838B'}}>
		                  {/*<Icon name="logo-github" />*/}
		                  <NativeText style={styles.nativeBtnText}>Technology</NativeText>
		                </NativeButton>
					</ScrollView>
					{this.state.articles ? this.state.articles.map((source, index) => {
						console.log("source :", source);
						if (source.urlToImage) {
							return (
								<TouchableOpacity onPress={() => {
									Linking.openURL(source.url);
								}}>
									<Card style={{flex: 0}}>
						            	<CardItem>
							              <Left>
							                <Thumbnail source={{uri: source.urlToImage }} />
							                <Body>
							                  <NativeText>{source.source.name}</NativeText>
							                  <NativeText note>{source.author}</NativeText>
							                  <NativeText note>{moment(source.publishedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}</NativeText>
							                </Body>
							              </Left>
							            </CardItem>
							            <CardItem>
							              <Body style={{ flex: 1 }}>
							                <ProgressiveImage  resizeMode={"cover"} source={{uri: source.urlToImage }} style={{height: height * 0.40, maxHeight: height * 0.40, width: width * 0.93, flex: 1}}/>
							                <NativeText>
							                  {source.content ? source.content.slice(0, 225) : "---------"}
							                </NativeText>
							              </Body>
							            </CardItem>
							            <CardItem>
							              <Left>
							                <NativeButton transparent textStyle={{color: '#87838B'}}>
							                  {/*<Icon name="logo-github" />*/}
							                  <NativeText>1,926 stars</NativeText>
							                </NativeButton>
							              </Left>
							            </CardItem>
							        </Card>
								</TouchableOpacity>
							);
						}
					}) : null}
				</ScrollView>
			</SideMenu>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	background: {
		width: width,
		height: height,
		backgroundColor: "white"
	},
	roundedBtn: {
		alignSelf: 'stretch',
		borderRadius: 25,
		marginRight: 10,
		backgroundColor: "#613DC1"
	},
	roundedBtnLight: {
		alignSelf: 'stretch',
		borderRadius: 25,
		marginRight: 10,
		backgroundColor: "#858Ae3"
	},
	nativeBtnText: {
		fontSize: 22,
		color: "white",
		fontWeight: "bold"
	}
})

export default NewsHomepage;