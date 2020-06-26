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
import { Container, Header, Left, Body, Right, Button as NativeButton, Footer, FooterTab, Title, Text as NativeText, Thumbnail, List, ListItem, Content, Badge } from 'native-base';
import moment from 'moment';
import { connect } from "react-redux";
import axios from "axios";
import Loading from "../../../../loading.js";
import _ from "lodash";
import Modal from 'react-native-modal';
import SearchBar from 'react-native-search-bar';

const { width, height } = Dimensions.get("window");

export class ListOfMessages extends React.Component {
constructor(props) {
  super(props);

  this.state = {
    data: [
        {id:1,  name: "I'm being scammed...",   image: require("../../../../assets/icons/scam.png")},
        {id:2,  name: "They're being offensive...",    image: require("../../../../assets/icons/offensive.png")},
        {id:3,  name: "It's something else...",       image: require("../../../../assets/icons/change.png")}
    ],
  	ready: false,
  	messages: [],
  	inboxActive: true,
  	groupActive: false,
  	id: "",
  	modalIsVisible: false,
  	searchValue: ""
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
	  					username: message.reciever
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
			        	console.log("itemmmmmm listOfMessages: ", item);
						return (
							<ListItem onPress={() => {
									{/*console.log("k, running function...");*/}
									this.handleRedirect(item);
								}} thumbnail>
					              <Left>
					                <Thumbnail square source={{ uri: item.picture }} />
					              </Left>
					              <Body>
					                <Text>{item.reciever}</Text>
					                <Text note numberOfLines={1}>{item.replies ? item.replies[item.replies.length - 1].message : item.message}</Text>
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
		            	this.setState({
		            		modalIsVisible: true
		            	})
		            }} hasText transparent>
		             	<NativeText>Report?</NativeText>
		            </NativeButton>
		          </Right>
		        </Header>
		        <ScrollView horizontal={false}>
		        <List>
				{this.renderModalComponent()}

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
				<Footer>
		          <FooterTab>
		            <NativeButton onPress={() => {
		            	this.props.navigation.navigate("dashboard");
		            }}>
		              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/home-run.png")} />
		            </NativeButton>
		            <NativeButton onPress={() => {
		            	this.props.navigation.navigate("dashboard");
		            }}>
		               <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/sport-team.png")} />
		            </NativeButton>
		            <NativeButton onPress={() => {
		            	this.props.navigation.navigate("dashboard");
		            }} active>
		              <Badge style={{ marginBottom: -10 }}><NativeText>51</NativeText></Badge>
		              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/mail-three.png")} />
		            </NativeButton>
		            <NativeButton onPress={() => {
		            	this.props.navigation.navigate("public-wall");
		            }}>
		              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/wall.png")} />
		            </NativeButton>
		          </FooterTab>
	        	</Footer>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
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
		username: state.auth.authenticated.username
	}
}

export default connect(mapStateToProps, {  })(ListOfMessages);