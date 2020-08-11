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
  FlatList, 
  Keyboard, 
  Animated
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import { connect } from "react-redux";
import { authenticated } from "../../../actions/auth/auth.js";
import Carousel from 'react-native-snap-carousel';
import axios from "axios";
import SearchBar from 'react-native-search-bar';
import ShowFeedList from "../../dashboard/feed/showFeed.js";
import NavigationDrawer from "../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import RBSheet from "react-native-raw-bottom-sheet";
import HomePostsPage from "../../wall/displayPosts/homePostsPage.js";
 

const { width, height } = Dimensions.get("window");

class DashboardAfterAuth extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  	searching: false,
  	searchValue: "",
  	people: [],
  	specific: null,
  	isOpen: false,
    offset: 0
  };

  this.height = new Animated.Value(150);
}
	uploadImage = () => {
		console.log("upload");
	}
	handleSearch = () => {
		console.log("search...");
		if (this.state.searchValue.length > 0) {
			axios.post("http://recovery-social-media.ngrok.io/get/specific/user", {
				searchValue: this.state.searchValue.toLowerCase()
			}).then((res) => {
				console.log("RRRR :", res.data);
				if (res.data.message === "FOUND user!") {
					this.setState({
						people: [res.data.user]
					})
				} else if (res.data.message === "User could NOT be found...") {
					this.setState({
						people: []
					})
				}
			}).catch((err) => {
				console.log(err);
			})
		}

	}
	handleCancel = () => {
		console.log("handle cancel...");
		axios.get("http://recovery-social-media.ngrok.io/gather/all/profiles").then((res) => {
			console.log(res.data);
			if (res.data) {
				this.setState({
					people: res.data,
					searching: false,
					isOpen: false
				}, () => {
					Keyboard.dismiss();
				})
			}
		}).catch((err) => {
			console.log(err);
		});
	}
	componentDidMount() {
		axios.get("http://recovery-social-media.ngrok.io/gather/all/profiles").then((res) => {
			console.log(res.data);
			if (res.data) {
				this.setState({
					people: res.data,
					isOpen: false
				})
			}
		}).catch((err) => {
			console.log(err);
		})

    // axios.post("http://recovery-social-media.ngrok.io/create-facelist").then((res) => {
    //   console.log("AI MAGIC :", res.data);
    // }).catch((err) => {
    //   console.log(err);
    // })
	}
  renderContent = () => {
    if (this.state.searching === true) {
      if (this.state.people) {
        return (
          <FlatList 
            style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}
            data={this.state.people}
            renderItem={({ item }) => {
              console.log("itemmmmmm :", item);
              return (
                <ListItem thumbnail>
                    <Left style={{ }}>
                      <Thumbnail square source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${item.profilePic[item.profilePic.length - 1].picture}` }} />
                    </Left>
                    <Body>
                      <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "#4E148C" }}>{item.username}</NativeText>
                      {/*<NativeText note numberOfLines={1}>{}</NativeText>*/}
                    </Body>
                    <Right style={{ top: -1 }}>
                      <NativeButton onPress={() => {
                        Keyboard.dismiss();
                          this.props.navigation.navigate("profile-individual", { user: item });
                      }} transparent>
                        <NativeText style={this.props.dark_mode ? { color: "#97DFFC" } : { color: "#2C0735" }}>View</NativeText>
                      </NativeButton>
                    </Right>
                  </ListItem>
              ); 
            }}
            keyExtractor={item => item.id}
          />
        );
      } else {
        return (
          <View style={this.props.dark_mode ? { backgroundColor: "black", height: height, width: width } : { backgroundColor: "white", height: height, width: width }}><NativeButton><NativeText>Load page...</NativeText></NativeButton></View>
        );
      }
    } else {
      return (
        <Fragment>
          <ShowFeedList navigation={this.props.navigation} />

        </Fragment>
      );
    }
  }
  onScroll = (event) => {
    var currentOffset = event.nativeEvent.contentOffset.y;
    var direction = currentOffset > this.state.offset ? 'down' : 'up';
    // this.state.offset = currentOffset;
    this.setState({
      offset: currentOffset,
      isOpen: false
    })
    console.log("DIRECTION ...: ", direction);
    if (direction === "up") {
      Animated.timing(this.height, {
         duration: 400,
         toValue: 150,
         useNativeDriver: false
       }).start()
    }
    if (direction === "down") {
      Animated.timing(this.height, {
         duration: 400,
         toValue: 70,
         useNativeDriver: false
       }).start()
    }
  }
	render() {
		console.log(this.props);
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
		<Fragment>
		<SideMenu isOpen={this.state.isOpen} menu={menu}>
		    <Header style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
          <Left>
            <NativeButton onPress={() => {
              this.RBSheet.open();
            }} hasText transparent>
              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/logout.png")}/>
            </NativeButton>
          </Left>
          <Body>
            <Title style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Dashboard</Title>
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
    <Animated.View style={this.props.dark_mode ? { backgroundColor: "black", paddingTop: 20, height: this.height } : { backgroundColor: "white", paddingTop: 20, height: this.height }}>   
        <View style={this.props.dark_mode ? { alignItems: "center", alignContent: "center", justifyContent: "center", backgroundColor: "black" } : { alignItems: "center", alignContent: "center", justifyContent: "center", backgroundColor: "white" }}>
          <NativeButton style={styles.mainBtn} onPress={() => {
                 this.props.navigation.navigate("rank-nearby-users");
            }} hasText>
            <NativeText style={{ color: "white" }}>Rate Users Nearby In Your Proximity </NativeText>
          </NativeButton>
        </View>
          <SearchBar    
            ref="searchBar"
            placeholder="Search by user-name..."
            onChangeText={(value) => {
              this.setState({
                searchValue: value,
                searching: true,
                isOpen: false
              })
            }} 
            onSearchButtonPress={this.handleSearch}
            onCancelButtonPress={this.handleCancel}
          />
    </Animated.View>
   
    <View style={this.props.dark_mode ? { flex: 1, backgroundColor: "black" } : { flex: 1, backgroundColor: "white" }}>
      <ScrollView onScroll={this.onScroll}>
        {this.renderContent()}
      </ScrollView>
    </View>
			<Footer style={this.props.dark_mode ? { backgroundColor: "black" } : {  }}>
	          <FooterTab>
	            <NativeButton active onPress={() => {
		            	this.props.navigation.navigate("dashboard");
		            }}>
	              <Image style={{ width: 35, height: 35 }} source={require("../../../assets/icons/home-run.png")} />
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
              <NativeButton onPress={() => {
                  this.props.navigation.navigate("profile-settings");
                }}>
                <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../assets/icons/list.png")} />
              </NativeButton>
	          </FooterTab>
	        </Footer>
          <RBSheet 
              ref={ref => {
                this.RBSheet = ref;
              }}
              height={300}
              openDuration={250}
              customStyles={{
                container: {
                  justifyContent: "center",
                  alignItems: "center"
                }
              }}
            >
              <View style={this.props.dark_mode ? { backgroundColor: "black", height: 300 } : { backgroundColor: "white", height: 300 }}>
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
	        </SideMenu>
		</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  mainBtn: {
    width: width * 0.95, 
    marginBottom: 20,
    backgroundColor: "#858AE3", 
    alignItems: "center", 
    borderColor: "black", 
    borderWidth: 3, 
    alignContent: "center", 
    justifyContent: "center"
  },
  rowTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width:170,
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    justifyContent: 'space-between',

  },
  pic: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 270,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 15,

  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontWeight: '400',
    color: '#666',
    fontSize: 12,
	marginLeft: 14
  },
  icon:{
    height: 28,
    width: 28, 
  },
	textInputTwo: {
		marginBottom: 30,
		padding: 14,
		backgroundColor: "white",
		padding: 10,
		color: "black"
	},
	post: {
		padding: 10
	},
	postModal: {
		padding: 10,
		backgroundColor: "white"
	},
  header:{
    backgroundColor: "#00BFFF",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
	box: {
		width: 70, 
		height: 70, 
		borderRadius: 60 / 2, 
		marginLeft: 6, 
		marginRight: 6,
		marginTop: 10,
		marginBottom: 5
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
	if (state.auth.authenticated.username) {
		return {
			profilePic: state.auth.authenticated.profilePic ? state.auth.authenticated.profilePic[state.auth.authenticated.profilePic.length - 1] : [],
      dark_mode: state.mode.dark_mode
		}
	} else {
		return {
			dark_mode: state.mode.dark_mode
		}
	}
}
 
export default connect(mapStateToProps, { authenticated })(DashboardAfterAuth);