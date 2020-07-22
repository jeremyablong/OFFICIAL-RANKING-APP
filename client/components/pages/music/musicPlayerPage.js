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
  ListView
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Separator, Text as NativeText, Card, CardItem, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import { connect } from "react-redux";
import axios from "axios";
import NavigationDrawer from "../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import RBSheet from "react-native-raw-bottom-sheet";
import DocumentPicker from 'react-native-document-picker';
import PhotoUpload from 'react-native-photo-upload';
import * as Progress from 'react-native-progress';
import TrackPlayer from 'react-native-track-player';

const { width, height } = Dimensions.get("window");


class MusicPlayerPage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false,
  	audioURI: null,
  	show: false,
  	progress: 0.27
  };
}
	pickFile = async () => {
		try {
			  const res = await DocumentPicker.pick({
			    type: [DocumentPicker.types.audio],
			  });
			  console.log(
			    res.uri,
			    res.type, // mime type
			    res.name,
			    res.size
			  );
			  this.setState({
			  	audioURI: res.uri,
			  	show: true
			  })
		} catch(e) {
			// statements
			console.log(e);
		}
	}
	rewindAudio = () => {
		console.log("clicked.......");
	}
	pauseAudio = () => {
		console.log("clicked.......");
	}
	fastForward = () => {
		console.log("clicked.......");
	}
	componentDidMount() {
	  
	}
	render() {
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
		          <Left>
		            <NativeButton onPress={() => {
		            	console.log("clicked chat...");
		            	this.props.navigation.navigate("chat-users");
		            }} hasText transparent>
		              <Image style={this.props.dark_mode ? { width: 45, height: 45, marginBottom: 10, tintColor: "white" } : { width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Music List</Title>
		          </Body>
		          <Right>
		          	<NativeButton onPress={() => {
		            	console.log("clicked user interface...");
					    this.setState({
					    	isOpen: true
					    })
		            }} hasText transparent>
		              <Image style={this.props.dark_mode ? { width: 45, height: 45, marginBottom: 10, tintColor: "white" } : { width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/user-interface.png")}/>
		            </NativeButton>
		          </Right>
		        </Header>
		        <RBSheet
		          ref={ref => {
		            this.RBSheet = ref;
		          }}
		          height={550}
		          openDuration={250}
		          customStyles={{
		            container: {
		              justifyContent: "center",
		              alignItems: "center"
		            }
		          }}
		        >
		          <View style={styles.container}>
					<Text style={styles.alignCenterText}>Please select a profile audio background track... This will be played only when users click the music icon on your profile.</Text>

					 <View style={{ height: 175, marginTop: 50, marginBottom: 50 }}>
					 <Text style={styles.specialText}>Select the cover photo for your MP3 audio track</Text>
						<PhotoUpload
						   onPhotoSelect={avatar => {
						     if (avatar) {
						       console.log('Image base64 string: ', avatar)
						     }
						   }}
						 >
						   <Image
						     style={{
						       paddingVertical: 30,
						       width: 150,
						       height: 150,
						       borderRadius: 75
						     }}
						     resizeMode='cover'
						     source={require("../../../assets/icons/user.png")}
						   />
						 </PhotoUpload>
					 </View>
			        {this.state.show === false ? <NativeButton onPress={() => {
			        	this.pickFile();
			        }} style={styles.nativeBtn}>
						<NativeText style={styles.text}>Select MP3 Audio Clip</NativeText>
			        </NativeButton> : null}

			        {this.state.show === true ?  <NativeButton onPress={() => {
			        	this.pickFile();
			        }} style={styles.nativeBtnTwo}>
						<NativeText style={styles.textTwo}>Upload Clip To Wall!</NativeText>
			        </NativeButton> : null}
			      </View>
		        </RBSheet>
		        <ScrollView style={{ width, height, backgroundColor: "white" }}>
					<NativeButton style={styles.mainBtn} onPress={() => {
						this.RBSheet.open();
					}}>
						<NativeText style={{ fontWeight: "bold" }}>Upload Tracks To Personal Playlist</NativeText>
					</NativeButton>

					<Card style={{flex: 0}}>
			            <CardItem>
			              <Left>
			                <Thumbnail source={{uri: "https://s3.us-west-1.wasabisys.com/rating-people/08a97ce9-3b09-4fb3-b313-ca2e0bffe380" }} />
			                <Body>
			                  <Text>NativeBase</Text>
			                  <Text note>April 15, 2016</Text>
			                  <TouchableOpacity onPress={() => {
								this.setState({
									progress: 0.87
								})
			                  }} style={{ position: "absolute", right: 10, top: 0 }}>
								<Image style={{ width: 45, height: 45 }} source={require("../../../assets/icons/nexttt.png")} />
			                  </TouchableOpacity>
			                </Body>
			              </Left>
			            </CardItem>
			            <CardItem>
			              <Body>
			                <Image resizeMode={"cover"} source={{uri: 'https://s3.us-west-1.wasabisys.com/rating-people/08a97ce9-3b09-4fb3-b313-ca2e0bffe380'}} style={{height: 350, width: "100%", flex: 1}}/>
			                <View style={{ marginTop: 25 }}>
								<Progress.Bar progress={this.state.progress} color={"blue"} width={width * 0.90} />
			                </View>
							<View style={{ flexDirection: "row", marginTop: 10, justifyContent: 'space-between', flex: 1, backgroundColor: "black", paddingTop: 35, paddingBottom: 35 }}>
								<TouchableOpacity style={{ flex: 1 }} onPress={() => {
									this.rewindAudio();
								}}>
									<Image resizeMode={"cover"} source={require("../../../assets/icons/backkkk.png")} style={{height: 50, width: 50, alignSelf: 'center', tintColor: "white" }}/>
								</TouchableOpacity>
								<TouchableOpacity style={{ flex: 1 }} onPress={() => {
									this.pauseAudio();
								}}>
									<Image resizeMode={"cover"} source={require("../../../assets/icons/pause.png")} style={{height: 50, width: 50, alignSelf: 'center', tintColor: "white" }}/>
								</TouchableOpacity>
								<TouchableOpacity style={{ flex: 1 }} onPress={() => {
									this.fastForward();
								}}>
									<Image resizeMode={"cover"} source={require("../../../assets/icons/fast-forward.png")} style={{height: 50, width: 50, alignSelf: 'center', tintColor: "white" }}/>
								</TouchableOpacity>
							</View>
							
			              </Body>
			            </CardItem>
			            <CardItem>
			              {/*<Left>
			                <Button transparent textStyle={{color: '#87838B'}}>
							  <Image style={{ width: 25, height: 25 }} source={require("../../../assets/icons/uploadie.png")} />
			                  <Text>1,926 stars</Text>
			                </Button>
			              </Left>*/}
			            </CardItem>
			          </Card>
		        </ScrollView>
		        </SideMenu>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	mainBtn: {
		flex: 1, 
		top: 0, 
		height: 50, 
		backgroundColor: "#613DC1", 
		justifyContent: "center", 
		alignItems: "center", 
		alignContent: "center", 
		borderWidth: 4, 
		borderColor: "black"
	},
	specialText: {
		fontSize: 18, 
		textAlign: "center", 
		fontWeight: "bold", 
		paddingBottom: 50, 
		color: "#4E148C", 
		marginRight: 20, 
		marginLeft: 20
	},
	alignCenterText: {
		fontWeight: "bold",
		fontSize: 18,
		padding: 20,
		textAlign: "center"
	},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    width
  },
  logo:{
    width:120,
    height:120,
    justifyContent: 'center',
    marginBottom:20,
  },
  textTwo: {
  	color: "white"
  },
  nativeBtnTwo: {
	justifyContent: "center",
	alignItems: "center",
	alignContent: "center",
	backgroundColor: "#2C0735"
  },
  nativeBtn: {
	justifyContent: "center",
	alignItems: "center",
	alignContent: "center",
	backgroundColor: "#613DC1"
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:100,
    borderRadius:30,
  },
  sendButton: {
    backgroundColor: "#FF4500",
  },
  buttonText: {
    color: 'white',
  }
}); 

export default MusicPlayerPage;