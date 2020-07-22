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
  FlatList, 
  Animated
} from 'react-native';
import { Container, Header, Left, Body, Right, Button as NativeButton, Footer, FooterTab, Title, Text as NativeText, Thumbnail, List, ListItem, Content, Badge } from 'native-base';
import moment from 'moment';
import { connect } from "react-redux";
import axios from "axios";
import Loading from "../../../chat/loader.js";
import _ from "lodash";
import Modal from 'react-native-modal';
import SearchBar from 'react-native-search-bar';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");


export class ListOfMessages extends React.Component {
constructor(props) {
  super(props);

  this.state = {
    data: [
        {id:1,  name: "I'm being scammed...", image: require("../../../../assets/icons/scam.png")},
        {id:2,  name: "They're being offensive...", image: require("../../../../assets/icons/offensive.png")},
        {id:3,  name: "It's something else...", image: require("../../../../assets/icons/change.png")}
    ],
  	ready: false,
  	messages: [],
  	inboxActive: true,
  	groupActive: false,
  	id: "",
  	modalIsVisible: false,
  	searchValue: "",
  	swiped: false
  };
}
	handleRedirect = (user) => {
		console.log("US :", user);
		// console.log("handle redirect...", user);
		this.props.navigation.navigate("message-individual", { user, image: user.picture });
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
	  					username: this.props.username === message.author ? message.reciever : message.author
	  				}).then((res) => {

	  					console.log("RES.DATA :", res.data);

	  					const picture = res.data.user.profilePic;
	
						console.log("PICTURE :", picture);
						
						// append picture to object
						message["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture[picture.length - 1].picture}`;

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
	  			alert(res.data.message);
	  		}
	  	}).catch((err) => {
	  		console.log("ERROR :", err);
	  	});


	  	
	}
	deleteThread = (item) => {
		console.log("clicked trash...", item);
	}
    RightActions = (item) => { 
    	console.log("swiped...", item);
		return (
			<ListItem onPress={() => {
				{/*console.log("k, running function...");*/}
				this.handleRedirect(item);
			}}>
               	<NativeButton onPress={() => {
               		this.deleteThread(item);
               	}} style={styles.trashBtn}>
					<Image source={require("../../../../assets/icons/del.png")} style={{ width: 40, height: 40 }} />
               	</NativeButton> 

        </ListItem>
		) 
	}
	renderList = () => {
		if (this.state.inboxActive === true) {
			return (
				<FlatList 
			        data={this.state.messages}
			        renderItem={({ item }) => {
			        	console.log("itemmmmmm listOfMessages: ", item);
						return (
						<Swipeable renderRightActions={this.RightActions}>
							<ListItem onPress={() => {
									{/*console.log("k, running function...");*/}
									this.handleRedirect(item);
								}} thumbnail>
					              <Left>
					                <Thumbnail square source={item.picture ? { uri: item.picture } : require("../../../../assets/icons/anonymous.png")} />
					              </Left>
					              <Body>
					                <Text style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>{item.reciever === this.props.username ? item.author : item.reciever}</Text>
					                <Text style={this.props.dark_mode ? { color: "white" } : { color: "black" }} note numberOfLines={1}>{item.replies ? item.replies[item.replies.length - 1].message : item.message}</Text>
					              </Body>
					              <Right>
					                <NativeButton transparent>
					                  <Text style={this.props.dark_mode ? { color: "#97DFFC" } : { color: "darkred" }}>View</Text>
					                </NativeButton>
					              </Right>
					            </ListItem>
					    </Swipeable>
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
    renderModalComponent = () => {
	  	if (this.state.modalIsVisible === true) {
	  		return (
				<Modal isVisible={true}>
		          <View style={{ flex: 1, width: width, height: height * 0.90, backgroundColor: "white", alignSelf: 'center', justifyContent:"center", alignItems: 'center'}}>
		           {this.state.data ? this.state.data.map((item, index) => {
		           	return (
						<TouchableOpacity style={styles.card} onPress={() => { 
							this.handleProblemRedirect(item) 
						}}>
			              <Image style={styles.image} source={item.image}/>
			              <View style={styles.cardContent}>
			                <Text style={styles.name}>{item.name}</Text>
			                <TouchableOpacity style={styles.followButton} onPress={() => {
			                	this.handleProblemRedirect(item);
			                }}>
			                  <Text style={styles.followButtonText}>Explore now</Text>  
			                </TouchableOpacity>
			              </View>
			            </TouchableOpacity>
		           	);
		           }) : null}
					<NativeButton style={styles.buttonCancel} onPress={() => {
						this.setState({
							modalIsVisible: false
						})
					}}><NativeText style={{ color: "white", fontSize: 23, fontWeight: "bold", marginLeft: width / 4 }}>Cancel</NativeText></NativeButton>
		          </View>
		        </Modal>
	  		);
	  	}
    }
    searchForValue = () => {
    	console.log("search for value...");
    }
    cancelSearch = () => {
    	console.log("cancel search...");
    }
	render() {
		console.log(this.state);
		return (
			<Fragment>
				<Header style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
		          <Left>
		            <NativeButton onPress={() => {
		              this.props.navigation.navigate("dashboard");
		            }} hasText transparent>
		              <Image style={this.props.dark_mode ? { width: 35, height: 35, marginBottom: 10, tintColor: "white" } : { width: 35, height: 35, marginBottom: 10 }} source={require("../../../../assets/icons/construction.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Message List</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked chat...");
		            	this.setState({
		            		modalIsVisible: true
		            	})
		            }} hasText transparent>
		             	<NativeText style={this.props.dark_mode ? { color: "white" } : null}>Report?</NativeText>
		            </NativeButton>
		          </Right>
		        </Header>
		        <ScrollView style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }} horizontal={false}>
		        {this.state.messages.length === 0 ? <View style={styles.header}>
		              <Text style={styles.headerTitle}>
		                You have <Text style={{ color: "#97DFFC" }}>0</Text> messages
		              </Text>
		          </View> : null}
		        <List>
				{this.renderModalComponent()}

					{this.state.messages && this.state.ready ? <Fragment><Footer>
				          <FooterTab>
				            {/*<NativeButton>
				              <NativeText>Apps</NativeText>
				            </NativeButton>
				            <NativeButton>
				              <NativeText>Camera</NativeText>
				            </NativeButton>*/}
				            <NativeButton style={this.props.dark_mode ? { backgroundColor: "black", borderWidth: 3, borderColor: "white" } : { backgroundColor: "white" }} onPress={() => {
				            	this.setState({
				            		inboxActive: true,
				            		groupActive: false
				            	})
				            }} active={this.state.inboxActive}>
				              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Inbox</NativeText>
				            </NativeButton>
				            <NativeButton style={this.props.dark_mode ? { backgroundColor: "black", borderWidth: 3, borderColor: "white" } : { backgroundColor: "white" }} onPress={() => {
				            	this.setState({
				            		groupActive: true,
				            		inboxActive: false
				            	})
				            }} active={this.state.groupActive}>
				              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Group Messages</NativeText>
				            </NativeButton>
				          </FooterTab></Footer><SearchBar
							  ref="searchBar"
							  placeholder="Search For Specific User..."
							  onChangeText={(value) => {
								this.setState({
									searchValue: value
								})
							  }}
							  onSearchButtonPress={() => {
							  	this.searchForValue();
							  }}
							  onCancelButtonPress={() => {
							  	this.cancelSearch();
							  }}
							/>{this.renderList()}</Fragment> : <Loading />}
				</List>
				</ScrollView>
					<Footer style={this.props.dark_mode ? { backgroundColor: "black" } : {  }}>
			          <FooterTab>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("dashboard");
				            }}>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/home-run.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("notifications");
				            }}>
				            <Badge style={{ marginBottom: -15, marginLeft: 5 }}><NativeText>3</NativeText></Badge>
			               <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/notification.png")} />
			            </NativeButton>
			            <NativeButton active onPress={() => {
				            	this.props.navigation.navigate("chat-users");
				            }}>
				          <Badge style={{ marginBottom: -10 }}><NativeText>51</NativeText></Badge>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "black" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/mail-three.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("public-wall");
				            }}>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/wall.png")} />
			            </NativeButton>
		              <NativeButton onPress={() => {
		                  this.props.navigation.navigate("profile-settings");
		                }}>
		                <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/list.png")} />
		              </NativeButton>
			          </FooterTab>
			        </Footer>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  header:{
    padding:30,
    alignItems: 'center',
    backgroundColor: "#858AE3",
  },
  headerTitle:{
    fontSize:30,
    color:"#FFFFFF",
    marginTop:10,
  },
  buttonCancel: {
  	width: width * 0.90,
  	marginTop: 50
  },
  contentList:{
    flex:1,
  },
  cardContent: {
    marginLeft:20,
    marginTop:10
  },
  image:{
    width:90,
    height:90,
    borderRadius:45,
    borderWidth:2,
    borderColor:"#ebf0f7"
  },
  trashBtn: {
  	backgroundColor: "transparent", 
  	justifyContent: "center", 
  	alignItems: "center", 
  	alignContent: "center"
  },
  card:{
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginLeft: 20,
    marginRight: 20,
    marginTop:20,
    backgroundColor:"white",
    padding: 10,
    flexDirection:'row',
    borderRadius:30,
  },

  name:{
    fontSize:18,
    flex:1,
    alignSelf:'center',
    color:"#3399ff",
    fontWeight:'bold'
  },
  count:{
    fontSize:14,
    flex:1,
    alignSelf:'center',
    color:"#6666ff"
  },
  followButton: {
    marginTop:10,
    height:35,
    width:100,
    padding:10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "white",
    borderWidth:1,
    borderColor:"#dcdcdc",
  },
  followButtonText:{
    color: "#dcdcdc",
    fontSize:12,
  },
})	
const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username,
		dark_mode: state.mode.dark_mode
	}
}

export default connect(mapStateToProps, {  })(ListOfMessages);