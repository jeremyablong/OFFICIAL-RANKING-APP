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
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, Footer, FooterTab } from 'native-base';
import StoriesComponent from "..//stories/index.js";
import axios from "axios";
import Modal from 'react-native-modal';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhotoUpload from 'react-native-photo-upload';
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

export class ShowFeedList extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  	modalIsVisible: false
  };
}
	handleLiveVideoUplaod = () => {
		console.log("handle upload live video...");
	}
	uploadVideo = () => {
		console.log("upload video...");
	}
	renderModalPost = () => {
		if (this.state.modalIsVisible) {
			return (
				<Modal isVisible={true}>
		          <View style={styles.postModal}>
		          <KeyboardAwareScrollView>
					<AutoGrowingTextInput placeholderTextColor="black"  style={styles.textInputTwo} onChangeText={(data) => {
						this.setState({
							text: data
						})
					}} placeholder="What's on your mind?" />
					
					<Footer>
			          <FooterTab>
			          <NativeButton onPress={() => {
			            	this.uploadImage();
			            }}>
			               <PhotoUpload
						   onPhotoSelect={avatar => {
						     if (avatar) {
						       console.log('Image base64 string: ', avatar);
						       this.setState({
						       	avatar,
						       	converted: `data:image/png;base64,${avatar}`
						       })
						     }
						   }}
						 >
						   <Image
						     style={{
						       paddingVertical: 15,
						       width: 50,
						       height: 30,
						       borderRadius: 35
						     }}
						     resizeMode='cover'
						     source={{
						       uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'
						     }}
						   />
						 </PhotoUpload>
			            </NativeButton>
			            <NativeButton onPress={() => {
			            	this.handleLiveVideoUplaod();
			            }}>
			              <Image source={require("../../../assets/icons/live.png")} style={{ width: 100, height: 40, maxHeight: 40 }}></Image>
			            </NativeButton>
			            
			            <NativeButton onPress={() => {
			            	this.uploadVideo();
			            }}>
			              <Text style={{ fontSize: 15, fontWeight: "bold" }}>Upload Video</Text>
			            </NativeButton>
			           
			          </FooterTab>
			        </Footer>
			        <View>
						{this.state.converted ? <Image style={{ width: width * .85, height: height / 3 }} source={{ uri: this.state.converted }}></Image> : null}
						{this.state.converted ? <TouchableHighlight style={{ position: "absolute", width: 50, height: 50, top: 5, left: 5, color: "white" }} onPress={() => {
							this.setState({
								converted: ""
							})
						}}><Image style={{ position: "absolute", width: 50, height: 50, top: 5, left: 5 }} source={require("../../../assets/icons/trash.png")}></Image></TouchableHighlight> : null}
			        </View>
			        <NativeButton onPress={() => {
			        	this.handleSubmission();
			        }} style={{ backgroundColor: "black" }}>
						<Text style={{ color: "white", fontSize: 20, marginLeft: width / 3.5 }}>Submit new post</Text>
			        </NativeButton>
			         <NativeButton onPress={() => {
			        	this.setState({
			        		modalIsVisible: false
			        	})
			        }} style={{ backgroundColor: "darkred", marginTop: 30 }}>
						<Text style={{ color: "white", fontSize: 20, marginLeft: width / 3.5 }}>Close Modal</Text>
			        </NativeButton>
			        </KeyboardAwareScrollView>
				</View>
		        </Modal>
			);
		}
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
	render() {
		return (
			<Fragment>
				<ScrollView style={{ borderBottomColor: 'black', borderBottomWidth: 2 }}>
					<ScrollView horizontal={true}> 
						<FlatList  
							horizontal
					        data={this.state.entries}
					        renderItem={({ item }) => {
								return (
									<View style={styles.box}>
										<Image 
										    style={{width: 60, height: 60, borderRadius: 40 / 2, marginLeft: 6, marginRight: 6 }} 
										    source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${item.profilePic}` }}
										/>
									</View>
								);
					        }} 
					        keyExtractor={item => item.id}
					    />
					</ScrollView>
					{this.renderModalPost()}
					<TouchableOpacity>
				        <View style={styles.rowTwo}>
				          <Image source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.profilePic}` }} style={styles.pic} />
				          <View style={{ marginLeft: 0 }}>
				            <View style={styles.nameContainer}>
				              <NativeButton onPress={() => {
				            	this.setState({
									modalIsVisible: true
								})
				            }} transparent><NativeText style={{ color: "grey", fontSize: 15, textAlign: "center", fontWeight: "bold" }}>What's on your mind...?</NativeText></NativeButton>
				            </View>
				          </View>
				        </View>
				        <Footer>
					          <FooterTab>
					            <NativeButton>
					              <NativeText>Upload Photo</NativeText>
					            </NativeButton>
					            <NativeButton>
					              <Image style={{ width: 50, height: 50 }} source={require("../../../assets/icons/live.png")} />
					            </NativeButton>
					            <NativeButton>
					              <NativeText>Open A Room</NativeText>
					            </NativeButton>
					            
					          </FooterTab>
					        </Footer>
				      </TouchableOpacity>
				      <StoriesComponent />
				</ScrollView>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
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
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
	box: {
		width: 70, 
		height: 70, 
		borderRadius: 60 / 2, 
		marginLeft: 6, 
		marginRight: 6,
		marginTop: 10,
		marginBottom: 5
	}
});
const mapStateToProps = state => {
	return {
		profilePic: state.auth.authenticated.profilePic
	}
}
export default connect(mapStateToProps, {  })(ShowFeedList);