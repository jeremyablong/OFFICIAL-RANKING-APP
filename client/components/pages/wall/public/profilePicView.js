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
  PanResponder, 
  Keyboard
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import axios from "axios";
import SlidingUpPanel from 'rn-sliding-up-panel';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { connect } from "react-redux";
import Popover from 'react-native-popover-view';
import PhotoUpload from 'react-native-photo-upload';
import LoadingWall from "../loading.js";

const { width, height } = Dimensions.get("window");

class ProfilePicView extends Component {
constructor(props) {
  super(props);

  this.state = {
  	data:[
        {id:1, image: "https://bootdey.com/img/Content/avatar/avatar1.png", name:"Frank Odalthh",    comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:2, image: "https://bootdey.com/img/Content/avatar/avatar6.png", name:"John DoeLink",     comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:3, image: "https://bootdey.com/img/Content/avatar/avatar7.png", name:"March SoulLaComa", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:4, image: "https://bootdey.com/img/Content/avatar/avatar2.png", name:"Finn DoRemiFaso",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:5, image: "https://bootdey.com/img/Content/avatar/avatar3.png", name:"Maria More More",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:6, image: "https://bootdey.com/img/Content/avatar/avatar4.png", name:"Clark June Boom!", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:7, image: "https://bootdey.com/img/Content/avatar/avatar5.png", name:"The googler",      comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
    ],
  	user: null,
  	ready: false,
  	comment: "",
  	replies: [],
  	update: false,
  	alreadyLiked: false,
  	likes: [],
  	avatar: null,
  	concatenated: false,
  	reactions: null,
  	loaded: false
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
	handleCommentSubmission = () => {

		const { avatar, comment } = this.state;

		const previousID = this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].id;

		console.log("handle submission - comment.");
		if (avatar !== null && comment.length > 0) {
			axios.post("http://recovery-social-media.ngrok.io/post/profile/pic/comment", {
				comment,
				username: (this.props.username === this.props.route.params.user.username) ? this.props.username : this.props.route.params.user.username,
				avatar,
				id: previousID
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
				id: previousID
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
				id: previousID
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
	componentDidMount() {
		
		console.log("previous users information ... :", this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].id);

		const previousID = this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].id;

		axios.post("http://recovery-social-media.ngrok.io/gather/profile/pic/comments", {
			username: this.props.route.params.user.username,
			id: previousID
		}).then((res) => {
			if (res.data.message === "Here is your users profile picture comments...") {
				console.log("special res.data :", res.data);
				this.setState({
					replies: res.data.replies
				}, () => {
					for (var i = 0; i < this.state.replies.length; i++) {
						const element = this.state.replies[i];
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
					this.setState({
						concatenated: true
					})
				});
			}
		}).catch((err) => {
			console.log(err);
		});

		axios.post("http://recovery-social-media.ngrok.io/organize/single/user/data", {
          username: this.props.route.params.user.username
        }).then((res) => {
          console.log("MAGIC :", res.data);
          if (res.data.message === "FOUND user!") {
          	this.setState({
          		likes: res.data.likes,
        		reactions: res.data.reactions,
          		user: res.data.user,
          		ready: true,
          		loaded: true
          	})
          }
        }).catch((err) => {
          console.log(err);
        })
	}
	handleEmojiSubmission = (reaction) => {
		console.log(this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].id);

		const uniqueID = this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].id;

		axios.post("http://recovery-social-media.ngrok.io/react/to/profile/picture", {
			reaction,
			username: this.props.route.params.user.username,
			user: this.props.username,
			id: uniqueID
		}).then((res) => {
			if (res.data.message === "Successfully created and updated reaction object with appropriate likes in DB!") {
				console.log(res.data);
				this.setState({
              		showPopover: false,
              		update: true
              	});

              	setTimeout(() => {
					alert(res.data.message);
              	}, 2000)
				
			}
		}).catch((err) => {
			console.log(err);
		})
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.update !== this.state.update) {
			this.setState({
				alreadyLiked: true
			})
		}
	}
	renderLikesOrNot = () => {
		if (this.state.likes && !this.state.alreadyLiked) {
			for (var i = 0; i < this.state.likes.length; i++) {
				let el = this.state.likes[i];
				console.log("ELLLLLL :", el);
				if (el.posterUsername === this.props.username) {
					if (this.state.alreadyLiked === true) {
						return null;
					} else {
						this.setState({
							alreadyLiked: true
						})
					}
				}
			}
		}
	}
	calculateLikes = () => {
		let sum = 0;
		if (this.state.ready === true && this.state.reactions) {
			let values = Object.values(this.state.reactions);
			
			for (var i = 0; i < values.length; i++) {
				sum += values[i];
			}
			return sum.toString();
		}
		else {
			return 0;
		}
	}
	renderPopover = () => {
		if (this.state.alreadyLiked === false) {
			return (
				<Popover 
	              onRequestClose={() => {
	              	console.log("attempt to close...");
	              	this.setState({
	              		showPopover: false
	              	})
	              }}
	              isVisible={this.state.showPopover}
			      from={(
			        <NativeButton style={{  paddingTop: 20  }} badge vertical onPress={() => {
			        	this.setState({
			        		showPopover: true
			        	})
			        }}>
			       <Badge style={styles.badgeLike}><NativeText>{this.calculateLikes()}</NativeText></Badge>
		            
		            <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/like.png")} />
			        </NativeButton>
			      )}>
				      <View style={{ height: "100%", width: 300, backgroundColor: "white", flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
				      	<TouchableOpacity onPress={() => {
							console.log("clicked...");
							this.setState({
								showPopover: false
							})									
						}}><Image source={require("../../../../assets/icons/trash.png")} style={{ width: 20, height: 20, position: "absolute", marginTop: -10, marginLeft: -30 }}/></TouchableOpacity>
						<TouchableOpacity onPress={() => {
							console.log("clicked...");
							this.handleEmojiSubmission("laugh");									
						}}><Text style={{ height: 50, width: 50, fontSize: 40 }}>😆</Text></TouchableOpacity>
						<TouchableOpacity onPress={() => {
							console.log("clicked...");
							this.handleEmojiSubmission("heartFace");
						}}><Text style={{ height: 50, width: 50, fontSize: 40 }}>😍</Text></TouchableOpacity>
						<TouchableOpacity onPress={() => {
							console.log("clicked...");
							this.handleEmojiSubmission("frustrated");
						}}><Text style={{ height: 50, width: 50, fontSize: 40 }}>😤</Text></TouchableOpacity>
						<TouchableOpacity onPress={() => {
							console.log("clicked...");
							this.handleEmojiSubmission("heart");
						}}><Text style={{ height: 50, width: 50, fontSize: 40 }}>❤️</Text></TouchableOpacity>
						<TouchableOpacity onPress={() => {
							console.log("clicked...");
							this.handleEmojiSubmission("angry");
						}}><Text style={{ height: 50, width: 50, fontSize: 40 }}>🤬</Text></TouchableOpacity>
						<TouchableOpacity onPress={() => {
							console.log("clicked...");
							this.handleEmojiSubmission("sad");
						}}><Text style={{ height: 50, width: 50, fontSize: 40 }}>😢</Text></TouchableOpacity>
			      </View>
				</Popover>
			);
		} else {
			return (
				<Popover 
	              onRequestClose={() => {
	              	console.log("attempt to close...");
	              	this.setState({
	              		showPopover: false
	              	})
	              }}
	              isVisible={this.state.showPopover}
			      from={(
			        <NativeButton style={{  paddingTop: 20  }} badge vertical onPress={() => {
			        	this.setState({
			        		showPopover: true
			        	})
			        }}>
			        <Badge style={styles.badgeLike}><NativeText>{this.calculateLikes()}</NativeText></Badge>
		            
		            <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/like.png")} />
			        </NativeButton>
			      )}>
				     <View style={{ height: "100%", width: 300, backgroundColor: "white", flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
				      	<NativeText style={{ padding: 10, fontWeight: "bold", color: "darkred", fontSize: 20 }}>You have already like/reacted to this post...</NativeText>
			     	 </View>
				</Popover>
			);
		}
	}
	calculateComments = () => {
		return this.state.replies.length;
	}
	render() {
		if (this.state.loaded === true) {
			return (
				<Fragment>
				{this.renderLikesOrNot()}
					<Header>
			          <Left>
			            <NativeButton onPress={() => {
			             	// redirect
			             	if (this.props.route.params.sendFromIndividual === true) {
								this.props.navigation.navigate("profile-individual");
			             	} else {
			             		this.props.navigation.navigate("public-wall");
			             	}
			             	
			            }} transparent>
			              <Image style={{ width: 35, height: 35, marginBottom: 10 }} source={require("../../../../assets/icons/back-again.png")}/>
			            </NativeButton>
			          </Left>
			          <Body><Title>Profile Picture</Title>
			          </Body>
			          <Right>
			            <NativeButton onPress={() => {
			            	
			            }} transparent>
			              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/chat.png")}/>
			            </NativeButton>
			          </Right>
			        </Header>
			    <ScrollView style={{ maxHeight: height - 150 }}>
			       <Image resizeMode={'cover'} style={{ width: width * 0.90, marginLeft: 20,  height: 400 }} source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].picture}` }} />
			       <Footer>
			          <FooterTab>
						{this.renderPopover()} 
			            <NativeButton onPress={() => {
			            	this._panel.show();
			            }} style={{ paddingTop: 30 }} active badge vertical>
			              <Badge style={styles.badge}><NativeText>{this.calculateComments()}</NativeText></Badge>
			              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/comment.png")} />
			              <NativeText>Comments</NativeText>
			            </NativeButton>
			            <NativeButton vertical>
			            <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/innovation.png")} />
			              <NativeText>Share</NativeText>
			            </NativeButton>
			          </FooterTab>
			        </Footer>
			        <NativeButton onPress={() => {
			        	this.props.navigation.navigate("image-gallery", { user: this.props.route.params.user });
			        }} style={styles.viewPicturesBtn}>
						<NativeText style={{ color: "white" }}>View Other Profile Pictures</NativeText>
			        </NativeButton>
			    </ScrollView>

			       <View style={{ bottom: 0, width: width, position: "absolute" }}>
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
					            	this.props.navigation.navigate("chat-users");
					            }}>
				              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/mail-three.png")} />
				            </NativeButton>
				            <NativeButton onPress={() => {
					            	this.props.navigation.navigate("public-wall");
					            }}>
				              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/wall.png")} />
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
									     source={require("../../../../assets/icons/upload-two.png")}
									   />
									 </PhotoUpload>
						     	<NativeButton onPress={() => {
						     		this.handleCommentSubmission();
						     	}} style={styles.btn}>
									<NativeText style={{ color: "white" }}>Submit New Comment</NativeText>
								</NativeButton>
						    </View>
						</View>
			            {this.state.replies && this.state.concatenated === true ? this.state.replies.map((item, index) => {
			            	return (
			            	<Fragment>
								<View style={styles.container}>
					              <TouchableOpacity onPress={() => {}}>
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
			            }) : null}
			            <Button title='Hide' onPress={() => this._panel.hide()} />
			          </ScrollView>
			        </SlidingUpPanel>

				</Fragment>
			)
		} else {
			return (
			<Fragment>
				<Header>
		          <Left>
		            <NativeButton onPress={() => {
		             	// redirect
		             	if (this.props.route.params.sendFromIndividual === true) {
							this.props.navigation.navigate("profile-individual");
		             	} else {
		             		this.props.navigation.navigate("public-wall");
		             	}
		             	
		            }} transparent>
		              <Image style={{ width: 35, height: 35, marginBottom: 10 }} source={require("../../../../assets/icons/back-again.png")}/>
		            </NativeButton>
		          </Left>
		          <Body><Title>Profile Picture</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	
		            }} transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/chat.png")}/>
		            </NativeButton>
		          </Right>
		        </Header>
				<LoadingWall />
			</Fragment>
			);
		}
		return null;
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
export default connect(mapStateToProps, {  })(ProfilePicView);