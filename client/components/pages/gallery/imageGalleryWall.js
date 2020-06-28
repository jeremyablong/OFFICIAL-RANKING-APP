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
import Modal from 'react-native-modal';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const { width, height } = Dimensions.get("window");

let row = [];
let prevOpenedRow;

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
  	id: "",
  	reviewModalVisible: false,
  	rating: 0,
  	reviewed: false,
  	elatable: 0, 
  	entertaining: 0, 
  	offensive: 0, 
  	relevant: 0, 
  	happy: 0, 
  	overall: 0,
  	dragPanel: false,
  	selected: null
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

		this.setState({
			dragPanel: false
		}, () => {
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
		})
	}
	handleRatingSubmission = () => {
		const { relatable, entertaining, offensive, relevant, happy, overall } = this.state;

		this.setState({
			dragPanel: false,
			rating: relatable + entertaining + offensive + relevant + happy + overall,
    		reviewModalVisible: false
    	})
	}
	handleReviews = () => {
		if (this.state.reviewModalVisible) {
			return (
				<Modal style={{ height, width: width * 0.90, backgroundColor: "white" }} isVisible={true}>
		          <ScrollView style={{ flex: 1 }}>
		          	<Text style={{ color: "Darkred", fontSize: 25, textAlign: "center" }}>This post was <Text style={{ color: "blue" }}>relatable</Text>...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6} 
					  size={20}  
					  onFinishRating={(value) => {
					  	this.setState({
					  		relatable: value
					  	})
					  }} 
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10,
					  }}
					/>
					<Text style={{ color: "Darkred", fontSize: 25, textAlign: "center" }}>This post was <Text style={{ color: "blue" }}>entertaining</Text>...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6}
					  size={20} 
					  onFinishRating={(value) => {
					  	this.setState({
					  		entertaining: value
					  	})
					  }}
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10
					  }}
					/>
					<Text style={{ color: "Darkred", fontSize: 25, textAlign: "center" }}>This post was NOT <Text style={{ color: "blue" }}>offensive</Text>...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6}
					  size={20} 
					  onFinishRating={(value) => {
					  	this.setState({
					  		offensive: value
					  	})
					  }}
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10
					  }}
					/>
					<Text style={{ color: "Darkred", fontSize: 25, textAlign: "center" }}>This post was <Text style={{ color: "blue" }}>relevant</Text>...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6}
					  size={20} 
					  onFinishRating={(value) => {
					  	this.setState({
					  		relevant: value
					  	})
					  }}
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10
					  }}
					/>
					<Text style={{ color: "Darkred", fontSize: 25, textAlign: "center" }}>I'm <Text style={{ color: "blue" }}>happy</Text> I saw this post...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6}
					  size={20} 
					  onFinishRating={(value) => {
					  	this.setState({
					  		happy: value
					  	})
					  }}
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10
					  }}
					/>
					<Text style={{ color: "Darkred", fontSize: 25, textAlign: "center" }}>I <Text style={{ color: "blue" }}>liked</Text> this post overall...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6}
					  size={20} 
					  onFinishRating={(value) => {
					  	this.setState({
					  		overall: value
					  	})
					  }}
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10
					  }}
					/>
		            <NativeButton onPress={() => {
			        	this.setState({
			        		reviewModalVisible: false
			        	})
			        }} style={styles.viewPicturesBtn}>
						<NativeText style={{ color: "white" }}>Close Modal</NativeText>
			        </NativeButton>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: -30, 
					    marginBottom: 10
					  }}
					/>
			        <NativeButton onPress={() => {
			        	this.handleRatingSubmission();
			        }} style={styles.viewPicturesBtnBlue}>
						<NativeText style={{ color: "white" }}>Submit Rating - Profile Post</NativeText>
			        </NativeButton>
		          </ScrollView>
		        </Modal>
			);
		}
	}
	likeCommentRespond = () => {
		// this.state.selected === item
		console.log('liked...', this.state.selected);
		axios.post("http://recovery-social-media.ngrok.io/like/subcomment/respond", {
			username: this.props.username,
			id: this.state.selected.id
		}).then((res) => {
			console.log(res.data);
		}).catch((err) => {
			console.log(err);
		})
	}
	replyToCommentRespond = () => {
		// this.state.selected === item
		console.log("respond... ", item);
	}
	RightActions = () => {
		return (
			<Fragment>
				<TouchableOpacity onPress={() => {
					this.setState({
						dragPanel: false
					}, () => {
						this.likeCommentRespond();
					})
				}}>
					<Image style={{ width: 40, height: 40, marginTop: 20, marginRight: 30 }} source={require("../../../assets/icons/like.png")} />
				</TouchableOpacity>
				<TouchableOpacity>
					<Image style={{ width: 40, height: 40, marginTop: 20, marginRight: 30 }} source={require("../../../assets/icons/reply-auto.png")} />
				</TouchableOpacity>
			</Fragment>
		);
	}
	closeRow = (index) => {
	    if (prevOpenedRow && prevOpenedRow !== row[index]) {
			prevOpenedRow.close();
	    }
	    prevOpenedRow = row[index];
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
			{this.handleReviews()}
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
					    <Footer style={{ marginTop: 10 }}>
				          <FooterTab>
				            <NativeButton onPress={() => {
				            	console.log("pressed.")
					            this.setState({
					            	dragPanel: false,
					            	reviewModalVisible: true
					            }, () => {
					            	this._panel.hide();
					            })		
					        }}>
				              <Image style={{ width: 35, height: 35 }} source={require("../../../assets/icons/review.png")} />
				              <NativeText style={{ color: "black" }}>Review Post</NativeText>
				            </NativeButton>
				            <NativeButton onPress={() => {
					            	{/*this.props.navigation.navigate("dashboard");*/}
					            }}>
				               <Image style={{ width: 35, height: 35 }} source={require("../../../assets/icons/share.png")} />
				                <NativeText style={{ color: "black" }}>Share Post</NativeText>
				            </NativeButton>
				            {/*<NativeButton onPress={() => {
					            	this.props.navigation.navigate("chat-users");
					            }}>
					          <Badge style={{ marginBottom: -10 }}><NativeText>51</NativeText></Badge>
				              <Image style={{ width: 35, height: 35 }} source={require("../../../assets/icons/mail-three.png")} />
				            </NativeButton>*/}
				            {/*<NativeButton onPress={() => {
					            	this.props.navigation.navigate("public-wall");
					            }}>
				              <Image style={{ width: 35, height: 35 }} source={require("../../../assets/icons/wall.png")} />
				            </NativeButton>*/}
				          </FooterTab>
				        </Footer>
					</View>
		            {this.state.replies ? this.state.replies.map((item, index) => {
		            	return (
		            	<Fragment>
		            	<Swipeable ref={ref => row[index] = ref} onSwipeableRightOpen={() => {
		            		this.closeRow(index);
		            		// set to state so accessible in functions to respond to comment
		            		this.setState({
		            			selected: item
		            		})
		            	}} renderRightActions={this.RightActions}>
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
				        </Swipeable>
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
  viewPicturesBtnBlue: {
	backgroundColor: "darkblue", 
  	marginTop: 20, 
  	alignItems: "center", 
  	justifyContent: "center", 
  	alignContent: "center",
  	marginBottom: 50
  },
  viewPicturesBtn: {
  	backgroundColor: "black", 
  	marginTop: 20, 
  	alignItems: "center", 
  	justifyContent: "center", 
  	alignContent: "center",
  	marginBottom: 50
  },
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