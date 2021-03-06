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
  SafeAreaView
} from 'react-native';
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, Footer, FooterTab, Badge, List, ListItem } from 'native-base';
import StoriesComponent from "..//stories/index.js";
import axios from "axios";
import Modal from 'react-native-modal';  
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhotoUpload from 'react-native-photo-upload';
import { connect } from "react-redux";
import SlidingUpPanel from 'rn-sliding-up-panel';
import RBSheet from "react-native-raw-bottom-sheet";
import HomePostsPage from "../../wall/displayPosts/homePostsPage.js";

const { width, height } = Dimensions.get("window");

export class ShowFeedList extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  	modalIsVisible: false,
    userSelected: [],
      User:{
        id:1,
        name:"Mark Johnson",
        image:"https://bootdey.com/img/Content/avatar/avatar6.png",
      }
  };
}
	handleLiveVideoUplaod = () => {
		console.log("handle upload live video...");
	}
	uploadVideo = () => {
		console.log("upload video...");
	}
	componentDidMount() {
		axios.get("http://recovery-social-media.ngrok.io/gather/all/profiles").then((res) => {
			console.log(res.data);
			if (res.data) {
				this.setState({
					entries: res.data
				})
			}
		}).catch((err) => {
			console.log(err);
		})
	}
	clickEventListener = () => {
		console.log("clicked...");
	}
	render() {
		console.log("this.PROPY :", this.props);
		return (
			<Fragment>
			<View style={{ flex: 1 }}>
				<ScrollView style={this.props.dark_mode ? { borderBottomColor: 'black', backgroundColor: "black", borderBottomWidth: 2 } : { borderBottomColor: 'black', backgroundColor: "white", borderBottomWidth: 2 }}>
					<ScrollView horizontal={true} style={this.props.dark_mode ? styles.darkScroll : styles.lightScroll}> 
						<FlatList  
							horizontal
					        data={this.state.entries}
					        renderItem={({ item }) => {
								return (
									<View style={this.props.dark_mode ? styles.boxDark : styles.box}>
										<Image 
										    style={{width: 60, height: 60, borderRadius: 40 / 2, marginLeft: 6, marginRight: 6 }} 
										    source={{ uri: this.props.profilePic ? `https://s3.us-west-1.wasabisys.com/rating-people/${item.profilePic[item.profilePic.length - 1].picture}` : "" }}
										/>
										<Image 
										    style={{width: 15, height: 15, marginTop: -15, borderRadius: 40 / 2, marginLeft: 6, marginRight: 6 }} 
										    source={require("../../../assets/icons/dot.png")}
										/>
									</View>
								);
					        }} 
					        keyExtractor={item => item.id}
					    />
					</ScrollView>
					<View style={{ marginTop: 0, marginBottom: 0 }}>
						
						<TouchableOpacity style={styles.wrapper}>
					        <View style={styles.rowTwo}>
					          <Image source={{ uri: this.props.profilePic ? `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.profilePic.picture}` : "" }} style={styles.pic} />
					          <View style={{ marginLeft: 0 }}>
					            <View style={styles.nameContainer}>
					              <NativeButton onPress={() => {
					            	this.props.navigation.navigate("post-to-wall-page");
					            }} transparent><NativeText style={{ color: "grey", fontSize: 15, textAlign: "center", fontWeight: "bold" }}>What's on your mind...?</NativeText></NativeButton>
					            </View>
					          </View>
					        </View>
					        <Footer>
					          <FooterTab>
					            <NativeButton onPress={() => {
					            	this.props.navigation.navigate("post-to-wall-page");
					            }}>
					              <NativeText>Upload Photo</NativeText>
					            </NativeButton>
					            <NativeButton onPress={() => {
					            	this.props.navigation.navigate("post-to-wall-page");
					            }}>
					              <Image style={{ width: 50, height: 50 }} source={require("../../../assets/icons/live.png")} />
					            </NativeButton>
					            <NativeButton onPress={() => {
					            	this.props.navigation.navigate("post-to-wall-page");
					            }}>
					              <NativeText>Open A Room</NativeText>
					            </NativeButton>
					            
					          </FooterTab>
					        </Footer>
					      </TouchableOpacity>
					</View>
					{/* stories component - updates component from newsfeed */}
				    <StoriesComponent navigation={this.props.navigation} open={true} />
					{/* this component is the wall posts from all users	 */}
					<HomePostsPage navigation={this.props.navigation} />
				</ScrollView>
	        </View>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	darkScroll: {
		backgroundColor: "black"
	},
	lightScroll: {
		backgroundColor: "white"
	},
	boxDark: {
	    shadowOffset: {
	      width: 10,
	      height: 6,
	    },
	    shadowOpacity: 0.77,
	    shadowRadius: 3.49,
	    elevation: 22,
	    width: 70, 
		height: 70, 
		borderRadius: 60 / 2, 
		marginLeft: 2, 
		marginRight: 2,
		marginTop: 10,
		marginBottom: 5
	},
    rowTwo: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    borderColor: '#DCDCDC',
	    backgroundColor: '#fff',
	    borderBottomWidth: 1,
    	padding: 10
    },
    nameContainer: {
	    flexDirection: 'row',
	    justifyContent: 'space-between',
	    width: 270,
    },
	box: {
		shadowColor: 'lightgrey',
	    shadowOffset: {
	      width: 0,
	      height: 6,
	    },
	    shadowOpacity: 0.77,
	    elevation: 22,
		width: 70, 
		height: 70, 
		marginLeft: 2, 
		marginRight: 2,
		marginTop: 10,
		marginBottom: 5
	},
});
const mapStateToProps = state => {
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
export default connect(mapStateToProps, {  })(ShowFeedList);