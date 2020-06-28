import React, { Fragment } from 'react';
import GallerySwiper from "react-native-gallery-swiper";
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
  PanResponder, 
  Keyboard
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import axios from "axios";
import SlidingUpPanel from 'rn-sliding-up-panel';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import PhotoUpload from 'react-native-photo-upload';
import { connect } from "react-redux";


const { width, height } = Dimensions.get("window");

class ImageGalleryWall extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  	pictures: [],
  	ready: false,
  	indexed: 0,
  	replies: [],
  	avatar: null,
  	comment: "",
  	id: ""
  };
  this._panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: this._onGrant,
    onPanResponderRelease: this._onRelease,
    onPanResponderTerminate: this._onRelease,
  });
}
	_onGrant = () => {
	  this.setState({ dragPanel: false });
	  return true;
	}

	_onRelease = () => {
	  this.setState({ dragPanel: true });
	}
	componentDidMount() {
	  axios.post("http://recovery-social-media.ngrok.io/gather/profile/pictures/gallery", {
		username: this.props.route.params.user.username,
		index: this.state.indexed
	  }).then((res) => {
	  	console.log("BAM :", res.data);
	  	this.setState({
	  		id: res.data.pictures[res.data.pictures.length - 1].id
	  	})
	  	for (var i = 0; i < res.data.pictures.length; i++) {
	  		let picture = res.data.pictures[i];
	  		console.log("custom :", picture);
	  		this.setState({
	  			pictures: [ { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${picture.picture}` } , ...this.state.pictures]
	  		}, () => {
	  			if (res.data.pictures) {
	  				for (var i = 0; i < res.data.pictures.length; i++) {
	  					let element = res.data.pictures[i];
	  					console.log("E :", element);
	  					axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
		  					username: element.poster
		  				}).then((res) => {
		  					console.log("resolution :", res.data);
		  					const picture = res.data.user.profilePic[res.data.user.profilePic.length - 1].picture;
							// append picture to object
							element["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

							this.setState({
			  					replies: [...this.state.replies]
			  				});
							
		  				}).catch((err) => {
		  					console.log("FAILURE :", err);
		  				})
	  				}
	  			}
	  		})
	  	}
	  }).catch((err) => {
	  	console.log(err);
	  });

	  this.setState({
	  	ready: true
	  })
	}	
	gatherDataForPicture = () => {
		console.log("ran...");
		axios.post("http://recovery-social-media.ngrok.io/gather/profile/pictures/gallery/slide", {
			username: this.props.route.params.user.username,
			index: this.state.indexed
		}).then((res) => {
		  	console.log("RESOLUTION :", res.data);
		  	if (res.data.message === "We correctly indexed your picture and retrieved the results...!") {
		  		if (res.data.pictures.replies) {
		  			this.setState({
			  			replies: res.data.pictures.replies.reverse(),
			  			id: res.data.pictures.id
			  		}, () => {
			  			if (this.state.replies) {
			  				for (var i = 0; i < this.state.replies.length; i++) {
			  					let element = this.state.replies[i];
			  					console.log("E :", element);
			  					axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
				  					username: element.poster
				  				}).then((res) => {
				  					console.log("resolution :", res.data);
				  					const picture = res.data.user.profilePic[res.data.user.profilePic.length - 1].picture;
									// append picture to object
									element["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

									this.setState({
					  					replies: [...this.state.replies]
					  				});
									
				  				}).catch((err) => {
				  					console.log("FAILURE :", err);
				  				})
			  				}
			  			}
			  		})
		  		} else {
		  			this.setState({
		  				replies: []
		  			})
		  		}
		  	}
		}).catch((err) => {
		  	console.log(err);
		});

	}
	renderContent = () => {
		return (
			<GallerySwiper onPageSelected={(index) => {
				console.log("index", index);
				this.setState({
					indexed: index
				}, () => {
					this.gatherDataForPicture();
				})
			}} onLongPress={() => {
				console.log("pressed...");
				this._panel.show();
			}} style={{ marginBottom: 70, marginTop: 30 }} resizeMode={"contain"}
		            images={this.state.pictures}
		        />
		);
	}
	handleCommentSubmission = () => {

		const { avatar, comment } = this.state;

		console.log("handle submission - comment.");
		if (avatar !== null && comment.length > 0) {
			axios.post("http://recovery-social-media.ngrok.io/post/profile/pic/comment", {
				comment,
				username: (this.props.username === this.props.route.params.user.username) ? this.props.username : this.props.route.params.user.username,
				avatar,
				id: this.state.id
			}).then((res) => {
				if (res.data.message === "Successfully posted new comment!") {
					console.log(res.data);
					this.setState({
						comment: ""
					}, () => {
						this._panel.hide();
						alert("You've successfully messaged commented on this picture!")
					})
				}
			}).catch((err) => {
				console.log(err);
			})
		} else if (avatar !== null && comment.length === 0) {
			axios.post("http://recovery-social-media.ngrok.io/post/profile/pic/comment", {
				username: (this.props.username === this.props.route.params.user.username) ? this.props.username : this.props.route.params.user.username,
				avatar,
				id: this.state.id
			}).then((res) => {
				if (res.data.message === "Successfully posted new comment!") {
					console.log(res.data);
					this.setState({
						comment: ""
					}, () => {
						this._panel.hide();
						alert("You've successfully messaged commented on this picture!")
					})
				}
			}).catch((err) => {
				console.log(err);
			})
		} else if (comment.length > 0 && avatar === null) {
			axios.post("http://recovery-social-media.ngrok.io/post/profile/pic/comment", {
				username: (this.props.username === this.props.route.params.user.username) ? this.props.username : this.props.route.params.user.username,
				comment, 
				id: this.state.id
			}).then((res) => {
				if (res.data.message === "Successfully posted new comment!") {
					console.log(res.data);
					this.setState({
						comment: ""
					}, () => {
						this._panel.hide();
						alert("You've successfully messaged commented on this picture!")
					})
				}
			}).catch((err) => {
				console.log(err);
			})
		}
	}
	render() {
		console.log("This state... :", this.state);
		return (
			<Fragment>
			<Header>
	          <Left>
	            <NativeButton onPress={() => {
	              this.props.navigation.navigate("public-wall");
	            }} hasText transparent>
	              <NativeText>Back</NativeText>
	            </NativeButton>
	          </Left>
	          <Body>
	            <Title>Gallery</Title>
	          </Body>
	          <Right>
	            <NativeButton hasText transparent>
	              <NativeText>help?</NativeText>
	            </NativeButton>
	          </Right>
	        </Header>
				{this.state.ready ? this.renderContent() : null}
		    <View style={{ position: "absolute", bottom: 0, width: width }}>
				<Footer>
		          <FooterTab>
		            <NativeButton badge onPress={() => {
			            	this.props.navigation.navigate("dashboard");
			            }}>
			            <Badge style={{ marginBottom: 0 }}><NativeText>51</NativeText></Badge>
		              	<NativeText>Comments</NativeText>
		            </NativeButton>
		            <NativeButton badge onPress={() => {
			            	this.props.navigation.navigate("dashboard");
			            }}>
			            <Badge style={{ marginBottom: 0 }}><NativeText>106</NativeText></Badge>
		               <NativeText>Likes</NativeText>
		            </NativeButton>
		            <NativeButton onPress={() => {
			            	this.props.navigation.navigate("chat-users");
			            }}>
			            
		              <NativeText>Share</NativeText>
		            </NativeButton>
		            
		          </FooterTab>
		        </Footer>
			</View>
				<SlidingUpPanel allowDragging={this.state.dragPanel} ref={c => this._panel = c}>
		          <ScrollView {...this._panResponder.panHandlers} style={styles.containerModal}>
					<View style={{ marginTop: 50 }}>

						<AutoGrowingTextInput onChangeText={(value) => {
							this.setState({
								comment: value
							})
						}} placeholderTextColor='black' style={styles.textInput} placeholder={'Your your Comment/Message Here...'} />
						<View style={styles.containerTwoRow}>
							<PhotoUpload
								   onPhotoSelect={avatar => {
								     if (avatar) {
								       console.log('Image base64 string: ', avatar);
								        this.setState({
											avatar
								        }, () => {
								        	Keyboard.dismiss();
								        })
								     }
								   }} 
								 >
								   <Image
								     style={styles.camera}
								     resizeMode='cover'
								     source={require("../../../assets/icons/upload-two.png")}
								   />
								 </PhotoUpload>
					     	<NativeButton onPress={() => {
					     		this.handleCommentSubmission();
					     	}} style={styles.btn}>
								<NativeText style={{ color: "white" }}>Submit New Comment</NativeText>
							</NativeButton>
					    </View>
					</View>
		            {this.state.replies ? this.state.replies.map((item, index) => {
		            	return (
		            	<Fragment>
							<View style={styles.container}>
				              <TouchableOpacity onPress={() => {
				              	console.log("picture clicked...");
				              }}>
				                <Image style={styles.image} source={{uri: item.picture }}/>
				              </TouchableOpacity>
				              <View style={styles.content}>
				                <View style={styles.contentHeader}>
				                  <Text  style={styles.name}>{item.poster}</Text>
				                  
				                </View>
				                <Text style={styles.time}>
				                    {item.date}
				                  </Text>
				                <Text rkType='primary3 mediumLine'>{item.comment}</Text>
				               
				              </View>
							  
				            </View>
				            {item.postedImage ? <Image style={{ flex: 1, height: 350, width: width * 0.80, marginLeft: 50 }} resizeMode="contain" source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${item.postedImage}` }} /> : null}
				        </Fragment>
		            	);
		            })
		       		: null }
		            <Button title='Hide' onPress={() => this._panel.hide()} />
		          </ScrollView>
		        </SlidingUpPanel>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  viewPicturesBtn: {
  	backgroundColor: "black", 
  	marginTop: 20, 
  	alignItems: "center", 
  	justifyContent: "center", 
  	alignContent: "center"
  },
  camera: {
	width: 35, 
	height: 35, 
	bottom: 0, 
	marginLeft: 20, 
	marginTop: 6
  },
  btn: {
	alignItems: "center", 
	justifyContent: "center", 
	width: width * 0.80,
	marginRight: 10
  },
  containerTwoRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: 'green',
    width: '40%',
    height: 40
  },
  containerModal: {
    backgroundColor: 'white',

  },
  textInput: {
    paddingLeft: 10,
    fontSize: 17,
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 0,
    minHeight: 50
  },
  badge: {
  	marginBottom: -10
  },
  badgeLike: {
  	marginBottom: -20,
  	marginRight: -40
  },
  root: {
    backgroundColor: "#ffffff",
    marginTop:10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  image:{
    width:45,
    height:45,
    borderRadius:20,
    marginLeft:20
  },
  time:{
    fontSize:11,
    color:"#808080",
  },
  name:{
    fontSize:16,
    fontWeight:"bold",
  },
})
const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username
	}
}

export default connect(mapStateToProps, {  })(ImageGalleryWall);