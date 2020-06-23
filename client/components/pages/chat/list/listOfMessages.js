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
import { Container, Header, Left, Body, Right, Button as NativeButton, Footer, FooterTab, Title, Text as NativeText, Thumbnail, List, ListItem, Content } from 'native-base';
import moment from 'moment';
import { connect } from "react-redux";
import axios from "axios";
import Loading from "../../../../loading.js";
import _ from "lodash";

const { width, height } = Dimensions.get("window");

export class ListOfMessages extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  	users: [
		{ name: "Jeremy Blong", posted: moment(new Date()).format("MM-DD HH:mm:ss A"), image: "https://s3.us-west-1.wasabisys.com/rating-people/f571d9e7-65d2-4294-80cc-e59223d5ab73", id: 1 },
		{ name: "Johnny Smith", posted: moment(new Date()).format("MM-DD HH:mm:ss A"), image: "https://s3.us-west-1.wasabisys.com/rating-people/b8b2b28c-d636-4a46-98a3-3fe15198cf10", id: 2 },
		{ name: "Sarah Adams", posted: moment(new Date()).format("MM-DD HH:mm:ss A"), image: "https://s3.us-west-1.wasabisys.com/rating-people/f571d9e7-65d2-4294-80cc-e59223d5ab73", id: 3 },
		{ name: "John Doe", posted: moment(new Date()).format("MM-DD HH:mm:ss A"), image: "https://s3.us-west-1.wasabisys.com/rating-people/b8b2b28c-d636-4a46-98a3-3fe15198cf10", id: 4 },
		{ name: "Josh Blong", posted: moment(new Date()).format("MM-DD HH:mm:ss A"), image: "https://s3.us-west-1.wasabisys.com/rating-people/f571d9e7-65d2-4294-80cc-e59223d5ab73", id: 5 }
  	],
  	ready: false,
  	messages: [],
  	inboxActive: true,
  	groupActive: false,
  	id: ""
  };
}
	handleRedirect = (user) => {
		console.log("US :", user);
		// console.log("handle redirect...", user);
		this.props.navigation.navigate("message-individual", { user });
	}
	componentDidMount() {
		// console.log("USERNAME :", this.props.username);
	  	axios.post("http://recovery-social-media.ngrok.io/get/user/by/username/filter", {
	  		username: this.props.username
	  	}).then((res) => {
	  		// console.log("MAGIC RES.DATA ListOfMessages :", res.data);
	  		if (res.data.message === "FOUND user!") {
	  			// console.log("FOUND USER.");
	  			this.setState({
	  				messages: res.data.messages
	  			})
	  			// iterate through and each message append the appropriate picture...
	  			for (let i = 0; i < this.state.messages.length; i++) {
	  				let message = this.state.messages[i];
	  				console.log("MESSAGE :", message);
		  			
		  			// make api request to gather photo of feed/message log
	  				axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
	  					username: message.author
	  				}).then((res) => {

	  					console.log("RES.DATA :", res.data);

	  					const picture = res.data.user.profilePic;
	
						console.log("PICTURE :", picture);
						
						// append picture to object
						message["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

						this.setState({
		  					messages: [...this.state.messages]
		  				});
						
	  				}).catch((err) => {
	  					console.log("FAILURE :", err);
	  				})
	  			}
	  				
	  			// this.sortMessages(this.state.messages);

	  			this.setState({
	  				ready: true
	  			})
	  		} else {
	  			console.log("uh oh.");
	  		}
	  	}).catch((err) => {
	  		console.log("ERROR :", err);
	  	});
	}
	renderList = () => {
		if (this.state.inboxActive === true) {
			return (
				<FlatList 
			        data={this.state.messages}
			        renderItem={({ item }) => {
			        	// console.log("itemmmmmm listOfMessages: ", item);
						return (
							<ListItem onPress={() => {
									{/*console.log("k, running function...");*/}
									this.handleRedirect(item);
								}} thumbnail>
					              <Left>
					                <Thumbnail square source={{ uri: item.picture }} />
					              </Left>
					              <Body>
					                <Text>{item.date}</Text>
					                <Text note numberOfLines={1}>{item.message}</Text>
					              </Body>
					              <Right>
					                <NativeButton transparent>
					                  <Text style={{ color: "darkred" }}>View</Text>
					                </NativeButton>
					              </Right>
					            </ListItem>
						);
			        }} 
			        keyExtractor={item => item.id}
			    />
			);
		} else if (this.state.groupActive === true) {
			return (
				<View>

				</View>
			);
		}
	}
	// sortMessages = (messages) => {
	// 	const newarr = messages.sort((a, b) => {
	// 	  return moment.utc(a.date).diff(moment.utc(b.date))
	// 	});	
	// 	this.setState({
	// 		messages: newarr
	// 	})
	// }
	render() {
		console.log(this.state);
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
		            <Title>Message List</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked chat...");
		            }} hasText transparent>
		             	<NativeText>Report?</NativeText>
		            </NativeButton>
		          </Right>
		        </Header>
		        <ScrollView horizontal={false}>
		        <List>
					{this.state.messages ? <Fragment><Footer>
				          <FooterTab>
				            {/*<NativeButton>
				              <NativeText>Apps</NativeText>
				            </NativeButton>
				            <NativeButton>
				              <NativeText>Camera</NativeText>
				            </NativeButton>*/}
				            <NativeButton onPress={() => {
				            	this.setState({
				            		inboxActive: true,
				            		groupActive: false
				            	})
				            }} active={this.state.inboxActive}>
				              <NativeText>Inbox</NativeText>
				            </NativeButton>
				            <NativeButton onPress={() => {
				            	this.setState({
				            		groupActive: true,
				            		inboxActive: false
				            	})
				            }} active={this.state.groupActive}>
				              <NativeText>Group Messages</NativeText>
				            </NativeButton>
				          </FooterTab></Footer>{this.renderList()}</Fragment> : <Loading />}
				</List>
				</ScrollView>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	box: {

	}
})	
const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username
	}
}

export default connect(mapStateToProps, {  })(ListOfMessages);