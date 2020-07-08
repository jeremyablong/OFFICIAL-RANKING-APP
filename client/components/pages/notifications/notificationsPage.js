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
  ListView
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Separator, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import { connect } from "react-redux";
import { authenticated } from "../../../actions/auth/auth.js";
import axios from "axios";
import _ from "lodash";
import LoadingWall from "../wall/loading.js";
import NavigationDrawer from "../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import RBSheet from "react-native-raw-bottom-sheet";

const { width, height } = Dimensions.get("window");

class NotificationsPage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	notifications: [],
  	ready: false,
  	last: null,
  	navigate: false,
  	isOpen: false,
  	selected: null
  };
}
	componentDidMount() {
        return new Promise((resolve, reject) => {
            axios.post("http://recovery-social-media.ngrok.io/gather/notifications", {
			  	username: this.props.username
			  }).then((response) => {
			  	let count = 0;
			  	// console.log(res.data);
		            if (response.data.message === "You have notifications!") {
						const finale = new Promise((resolve, reject) => {
							for (let i = 0; i < response.data.notifications.length; i++) {
								console.log("i", i)
								let notification = response.data.notifications[i];
								// console.log("notification.. :", notification);
								axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
				  					username: notification.user
				  				}).then((res) => {

				  					console.log("resolution :", res.data);
				  					const picture = res.data.user.profilePic[res.data.user.profilePic.length - 1].picture;
									// append picture to object
									notification["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

									count++

									console.log("this.state.notifications.length :", this.state.notifications.length, count);
									if (count === this.state.notifications.length) {
										resolve();
									}
									
				  				}).catch((err) => {
				  					console.log("FAILURE :", err);
				  				})

				  				this.setState({
									notifications: [ notification, ...this.state.notifications ],
									last: notification
								})


							}
							
						});
						

						finale.then(() => {
						    console.log('All done!');
						    this.setState({
								ready: true
							})
						});
				  	}
			  }).catch((err) => {
			  	console.log(err);
			  })
        });
		

	}
	redirectToSpecific = (data) => {

		console.log("Data", data);

		if (data.data === "commented on your profile picture") {
			axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
	          username: this.props.username
	        }).then((res) => {
	          console.log(res.data);
	          if (res.data.message === "FOUND user!") {
	          	this.setState({
	          		user: res.data.user,
	          		navigate: true
	          	}, () => {
					this.props.navigation.navigate(data.route, { user: this.state.user, index: data.index });
	          	})
	          }
	        }).catch((err) => {
	          console.log(err);
	        })
  		} else if (data.data === "sent you a new private message!") {
			axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
	          username: this.props.username
	        }).then((res) => {
	          console.log("RESO : ", res.data);
	          if (res.data.message === "FOUND user!") {
	          	this.setState({
	          		user: res.data.user,
	          		navigate: true
	          	}, () => {
	          		for (var i = 0; i < this.state.user.messages.length; i++) {
	          			let message = this.state.user.messages[i];
	          			console.log("message :", message);
	          			if (message.author === data.user) {
	          				console.log("We have a MATCH... :", message);
	          				this.props.navigation.navigate(data.route, { user: message, notify: data });
	          			}
	          		}
					// this.props.navigation.navigate(data.route, { user: this.state.user });
	          	})
	          }
	        }).catch((err) => {
	          console.log(err);
	        })
  		} else if (data.data === "sent you a friend request!") {
			this.props.navigation.navigate(data.route, { data });
  		}
	}
	returnNonMessage = () => {
		return (
			<View><LoadingWall /></View>
		);
	}
	removeNotification = () => {

		const { username } = this.props;

		console.log("selected... :", this.state.selected);

		axios.post("http://recovery-social-media.ngrok.io/remove/notification", {
          username,
          notificationID: this.state.selected.id
        }).then((res) => {
            if (res.data.message === "Successfully removed notification!") {
				for (let i = 0; i < this.state.notifications.length; i++) {
					let notification = this.state.notifications[i];
					console.log(notification.id, res.data.removed.id);
					if (notification.id === res.data.removed.id) {
						console.log("found the correct - removed item === :", notification, i);
						// may need to be correct... fix reverse
						this.setState({
							notifications: this.state.notifications.filter(item => {
								if (item.id !== notification.id) {
									return item;
								}
							})
						})
					}
				}
            }
        }).catch((err) => {
          console.log(err);
        })
	}
	render() {
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		console.log(this.state);
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header>
		          <Left>
		            <NativeButton onPress={() => {
		            	console.log("clicked chat...");
		            	this.props.navigation.navigate("chat-users");
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title>Notifications</Title>
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
				
				<ScrollView style={{ backgroundColor: "white" }}>
				<List>
					{this.state.notifications && this.state.ready === true ? this.state.notifications.map((notify, index) => {
{/*						console.log("notify :", notify);*/}
						return (
							
								<ListItem key={index} style={{ width: width }} thumbnail>
								<TouchableOpacity key={index} onPress={() => {
				                	this.redirectToSpecific(notify);
				                }}>
					              <Left>
					                <Thumbnail square source={{ uri: notify.picture }} />
					              </Left>
					            </TouchableOpacity>
					            <TouchableOpacity onPress={() => {
				                	this.redirectToSpecific(notify);
				                }}>
					              <Body style={{ width: width * 0.65 }}>
					                <NativeText style={{ fontWeight: "bold" }}>{notify.user}</NativeText>
					                <NativeText style={{ color: "black" }} note numberOfLines={2}>{notify.data}...</NativeText>
					              </Body>
					            </TouchableOpacity>
					            <TouchableOpacity key={index} onPress={() => {
				                	this.redirectToSpecific(notify);
				                }}>
					              <Right>
					                <NativeButton onPress={() => {
					                	this.setState({
					                		selected: notify
					                	}, () => {
					                		this.RBSheet.open();
					                	})
					                	
					                }} transparent>
					                  <Image style={{ width: 30, height: 30 }} source={require("../../../assets/icons/more-two.png")} />
					                </NativeButton>
					              </Right>
					            </TouchableOpacity>
					            </ListItem>
					        
			            )
					}) : this.returnNonMessage()}
				</List>
				</ScrollView>
				<RBSheet
		          ref={ref => {
		            this.RBSheet = ref;
		          }}
		          height={175}
		          openDuration={250}
		          customStyles={{
		            container: {
		              justifyContent: "center",
		              alignItems: "center"
		            }
		          }}
		        >
		        <ScrollView>
		        <List>
		          <Separator style={styles.seperator} bordered>
		            <Text style={styles.texttt}>Settings</Text>
		          </Separator>
		          <ListItem style={styles.listItem}>
		            <TouchableOpacity onPress={() => {
		            	this.removeNotification();
		            }}><Text>Remove this notification</Text></TouchableOpacity>
		          </ListItem>
		          <ListItem style={styles.listItem} last>
		            <Text>Report issue to notifications team</Text>
		          </ListItem>
		          {/*<Separator style={styles.seperator} bordered>
		            <Text style={styles.texttt}>MIDFIELD</Text>
		          </Separator>
		          <ListItem style={styles.listItem}>
		            <Text>Caroline Aaron</Text>
		          </ListItem>
		          <ListItem style={styles.listItem} last>
		            <Text>Lee Allen</Text>
		          </ListItem>*/}
		        </List>
		        </ScrollView>
		        </RBSheet>
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
		        </SideMenu>
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
	},
	listItem: {
		width: width
	},
	seperator: {
		height: 50,
		backgroundColor: "#858AE3"
	},
	texttt: {
		color: "white"
	}
})
const mapStateToProps = (state) => {
	return {
		username: state.auth.authenticated.username
	}
}

export default connect(mapStateToProps, { authenticated })(NotificationsPage);