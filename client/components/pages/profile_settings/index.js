import React, { Fragment, Component } from 'react';
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
import { Container, Header, Left, Body, Right, Thumbnail, List, ListItem, Button as NativeButton, Title, Text as NativeText, Footer, FooterTab, Badge } from 'native-base';
import NavigationDrawer from "../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import { connect } from "react-redux";
import axios from "axios";
import RBSheet from "react-native-raw-bottom-sheet";
import { authenticated } from "../../../actions/auth/auth.js";
import LoadingWall from "../wall/loading.js";
import { enableDarkMode } from "../../../actions/dark_mode/mode.js";

const { width, height } = Dimensions.get("window");

export class ProfileSettingsPage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false,
  	user: null
  };
}
	componentDidMount() {

		console.log("this.props :", this.props.username);

	 	axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
			username: this.props.username
		}).then((res) => {
			if (res.data.message === "FOUND user!") {
				console.log("RRRREEEEEEE ------- :", res.data);
				this.setState({
					user: res.data.user
				})
			} 
		}).catch((err) => {
			console.log(err);
		})
	}
	renderContent = () => {
		const { user } = this.state;

		if (user !== null) {
			return (
				<ScrollView style={this.props.dark_mode === false ? { height: height, width: width, backgroundColor: "white" } : { height: height, width: width, backgroundColor: "black" }} contentContainerStyle={{ paddingBottom: 200 }}>
		            
						<ListItem avatar>
						
			              <Left>
			                <Thumbnail style={{ width: 35, height: 35 }} source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${user.profilePic[user.profilePic.length - 1].picture}` }} />
			              </Left>
			              <Body>
			              <TouchableOpacity onPress={() => {
				            	this.props.navigation.navigate("public-wall");
				            }}>
			                <Text style={this.props.dark_mode === false ? styles.blackText : styles.whiteText}>Jeremy Blong</Text>
			                <Text style={this.props.dark_mode === false ? styles.blackText : styles.whiteText} note>See your profile</Text>
			                </TouchableOpacity>
			              </Body>
			              
			            </ListItem> 
		            
		            
		            <View style={styles.container}>
		            <View style={{ flexDirection: 'row', flex: 1 }}>
					    <View style={styles.item}>
					    <TouchableOpacity onPress={() => {
							this.props.navigation.navigate("news-homepage");
						}}>
							<View style={this.props.dark_mode === false ? styles.columnItem : styles.longColumn}>
								<Image source={require("../../../assets/images/bloom.jpg")} style={{ height: "50%", width: "100%", maxWidth: "100%" }} />
								<View style={{ height: "50%", width: "100%", maxWidth: "100%", backgroundColor: "black", padding: 10  }}>
									<Text style={{ color: "white" }}>Heat wave drives corona protesters inside - odd occurance in southern california</Text>
									<Text style={{ fontWeight: "bold", fontSize: 20, color: "#97DFFC" }}>Bloomburg</Text>
								</View>
							</View>
						</TouchableOpacity>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/post.png")} style={styles.icon} />
								<Text style={styles.boxText}>Saved</Text>
							</View>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/bag.png")} style={styles.icon} />
								<Text style={styles.boxText}>Job Board</Text>
							</View>
							<View style={this.props.dark_mode === false ? styles.columnItemTwo : styles.darkColumnItemTwo}>
								<Image source={require("../../../assets/icons/art-and-design.png")} style={styles.icon} />
								<Text style={styles.boxText}>Art - Buy/Sell</Text>
								<Text style={{ marginTop: 50, padding: 5, paddingBottom: 10 }}>Buy and sell art on our platform stricly geared towards helping artist's get paid for their work</Text>
							</View>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/dating.png")} style={styles.icon} />
								<Text style={styles.boxText}>Dating</Text>
							</View>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/recommendations-1.png")} style={styles.icon} />
								<Text style={styles.boxText}>Rank Users</Text>
							</View>
					    </View>
					
					    <View style={styles.item}>
					    <TouchableOpacity onPress={() => {
							this.props.navigation.navigate("marketplace-homepage");
						}}>
							<View style={this.props.dark_mode === false ? styles.columnItemTwo : styles.darkColumnItemTwo}>
								<Image source={require("../../../assets/icons/optimization.png")} style={styles.icon} />
								<Text style={styles.boxText}>Marketplace</Text>
								<Text style={{ marginTop: 50, padding: 5, paddingBottom: 10 }}>Buy, Sell and Trade with our unique auction platform! Sell anything from electronics to lawn supplies...</Text>
							</View>
					</TouchableOpacity>
						<TouchableOpacity onPress={() => {
							this.props.navigation.navigate("edit-profile");
						}}>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/user.png")} style={styles.icon} />
								<Text style={styles.boxText}>Edit Profile</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {
							if (this.props.dark_mode === false) {
								this.props.enableDarkMode(true);
							} else {
								this.props.enableDarkMode(false);
							}
						}}>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/dark.png")} style={styles.icon} />
								<Text style={[styles.boxText, { paddingTop: 10 }]}>Enable/Disable Dark Mode</Text>
							</View>
						</TouchableOpacity>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/location-location.png")} style={styles.icon} />
								<Text style={styles.boxText}>Rank Users</Text>
							</View>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/privacy.png")} style={styles.icon} />		
								<Text style={styles.boxText}>Privacy Settings</Text>						
							</View>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/friends-friends.png")} style={styles.icon} />
								<Text style={styles.boxText}>View Friends</Text>
							</View>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/qr-code.png")} style={styles.icon} />
								<Text style={styles.boxText}>Scan QR Codes</Text>
							</View>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/share-share.png")} style={styles.icon} />
								<Text style={styles.boxText}>Networking</Text>
							</View>
							<View style={this.props.dark_mode === false ? styles.shortItem : styles.longItem}>
								<Image source={require("../../../assets/icons/computer.png")} style={styles.icon} />
								<Text style={styles.boxText}>Videos</Text>
							</View>
							{/*<View style={styles.shortItem}>
								<Image source={require("../../../assets/icons/post.png")} style={styles.icon} />
							</View>*/}
					    </View>
					  </View>
					  	
					</View> 
					
		        </ScrollView>
			);
		} else {
			return (
				<View style={this.props.dark_mode ? { backgroundColor: "black", height } : { backgroundColor: "white" }}>
					<LoadingWall />
				</View>
			);
		}
	}
	render() {
		const { user } = this.state;

		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
		          <Left>
		            <NativeButton onPress={() => {
		              this.RBSheet.open();
		            }} hasText transparent>
		              <Image style={this.props.dark_mode ? { width: 45, height: 45, marginBottom: 10, tintColor: "white" } : { width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/logout.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Settings</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked user interface...");
		                 {/*this.props.navigation.navigate("chat-users");*/}
		                 this.setState({
		                 	isOpen: true
		                 })
		            }} hasText transparent>
		              <Image style={this.props.dark_mode ? { width: 45, height: 45, marginBottom: 10, tintColor: "white" } : { width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/user-interface.png")}/>
		            </NativeButton>
		          </Right>
		        </Header>
		        <List>
		    <View style={{ height: height, width: width, backgroundColor: "white" }}>
		        {this.renderContent()}
		        
		       </View>
		        </List>
		        <View style={styles.footer}>
					<Footer style={this.props.dark_mode ? { backgroundColor: "black" } : {  }}>
			          <FooterTab>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("dashboard");
				            }}>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../assets/icons/home-run.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("notifications");
				            }}>
				            <Badge style={{ marginBottom: -15, marginLeft: 5 }}><NativeText>3</NativeText></Badge>
			               <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../assets/icons/notification.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("chat-users");
				            }}>
				          <Badge style={{ marginBottom: -10 }}><NativeText>51</NativeText></Badge>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../assets/icons/mail-three.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("public-wall");
				            }}>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../assets/icons/wall.png")} />
			            </NativeButton>
		              <NativeButton active onPress={() => {
		                  this.props.navigation.navigate("profile-settings");
		                }}>
		                <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "black" } : { width: 35, height: 35 }} source={require("../../../assets/icons/list.png")} />
		              </NativeButton>
			          </FooterTab>
			        </Footer>
		        </View>
		        </SideMenu>
		        	<RBSheet
			              ref={ref => {
			                this.RBSheet = ref;
			              }}
			              height={300}
			              openDuration={250}
			              customStyles={this.props.dark_mode === false ? { container: { justifyContent: "center", alignItems: "center" }} : { container: { justifyContent: "center", alignItems: "center", backgroundColor: "black" }}}
			            >
			              <View>
			          <TouchableOpacity style={styles.card} onPress={() => {
			            this.props.authenticated({});
			            this.RBSheet.close();
			            this.props.navigation.navigate("homepage"); 
			          }}>
		                  <View style={styles.cardContent}>
		                    <TouchableOpacity style={styles.followButtonRed} onPress={() => {
		                      this.props.authenticated({});
		                      this.RBSheet.close();
		                      this.props.navigation.navigate("homepage");
		                    }}>
		                      <Text style={{ fontSize: 15, color: "white" }}>Sign-out</Text>  
		                    </TouchableOpacity>
		                  </View>
		                </TouchableOpacity>
		                <TouchableOpacity style={styles.card} onPress={() => {

		                }}>

		                  <View style={styles.cardContent}> 
			            <TouchableOpacity style={styles.followButton} onPress={() => {
			              this.RBSheet.close();
	                    }}>
	                      <Text style={styles.followButtonTextWhite}>Cancel</Text>  
                   		</TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            </RBSheet>
			</Fragment>
		)	
	}
}
const styles = StyleSheet.create({
	blackCard: {
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
	    justifyContent: 'center',
	    alignItems: 'center',
	    alignContent: "center",
	    borderRadius:30
	},
	blackText: {
		color: "black"
	},
	whiteText: {
		color: "white"
	},
	longItem: {
		borderRadius: 15,
		height: 90,
		width: '100%',
		backgroundColor: "#edebeb",
		marginRight: 10,
		marginLeft: 10,
		shadowOffset: {
			width: 6,
			height: 12,
		},
		shadowOpacity: 0.88,
		shadowRadius: 16.00,
		marginTop: 20,
		elevation: 24
	},
	darkColumnItemTwo: {
		borderRadius: 15,
		height: 180,
		width: '100%',
	    backgroundColor: "#edebeb",
	    marginRight: 10,
	    marginLeft: 10,
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.00,
		marginTop: 20,
		elevation: 24
	},
	longColumn: {
		borderRadius: 15,
		height: 275,
		width: '100%',
	    backgroundColor: "#edebeb",
	    marginRight: 10,
	    marginLeft: 10,
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.88,
		shadowRadius: 16.00,
		marginTop: 20,
		elevation: 24
	},
	footer: {
		position: "absolute",
		bottom: 0,
		width: width
	},
	icon: {
		width: 40,
		height: 40,
		position: "absolute",
		left: 7, 
		top: 7
	},
	boxText: {
		color: "#613DC1",
		fontSize: 17,
		fontWeight: "bold",
		textAlign: "left",
		position: "absolute",
		bottom: 0, 
		left: 0,
		padding: 5
	},	
	columnItem: {
		borderRadius: 15,
		height: 275,
		width: '100%',
	    backgroundColor: "white",
	    marginRight: 10,
	    marginLeft: 10,
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.00,
		marginTop: 20,
		elevation: 24
	},
	shortItem: {
		borderRadius: 15,
		height: 90,
		width: '100%',
		backgroundColor: "white",
		marginRight: 10,
		marginLeft: 10,
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.00,
		marginTop: 20,
		elevation: 24
	},
	columnItemTwo: {
		borderRadius: 15,
		height: 180,
		width: '100%',
	    backgroundColor: "white",
	    marginRight: 10,
	    marginLeft: 10,
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.00,
		marginTop: 20,
		elevation: 24
	},
  container: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  containerTwo: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-end' // if you want to fill rows left to right
  },
  item: {
    width: '42%', // is 50% of container width,
    flexDirection: 'column',
    height: "100%",
    marginRight: 10,
    marginLeft: 10,
  },
   cardContent: {
    marginLeft:20,
    marginTop:10,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: "center",
    width: width * 0.80
  },

  card:{
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
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: "center",
    borderRadius:30,
  },
  followButton: {
    height:45,
    width:100,
    padding:10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "white",
    borderWidth:3,
    borderColor:"black",
    width: width * 0.60
  },
   followButtonRed: {
    height:45,
    width:100,
    padding:10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "#4E148C",
    borderWidth:3,
    borderColor:"#97DFFC",
    width: width * 0.60
  },
  followButtonText:{
    color: "white",
    fontSize:15,
  },
  followButtonTextWhite:{
    color: "black",
    fontSize:15,
  }
})
const mapStateToProps = state => {
	console.log(state);
	return {
		username: state.auth.authenticated.username,
		dark_mode: state.mode.dark_mode
	}
}


export default connect(mapStateToProps, { authenticated, enableDarkMode })(ProfileSettingsPage);