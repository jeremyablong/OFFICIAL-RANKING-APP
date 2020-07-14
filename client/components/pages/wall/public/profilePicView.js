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
  Keyboard, 
  Animated
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import axios from "axios";
import SlidingUpPanel from 'rn-sliding-up-panel';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { connect } from "react-redux";
import Popover from 'react-native-popover-view';
import PhotoUpload from 'react-native-photo-upload';
import LoadingWall from "../loading.js";
import Modal from 'react-native-modal';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Swipeable from 'react-native-gesture-handler/Swipeable';


const { width, height } = Dimensions.get("window");

let row = [];
let prevOpenedRow;

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
  	loaded: false,
  	modalIsVisible: false,
  	rating: 0,
  	reviewed: false,
  	elatable: 0, 
  	entertaining: 0, 
  	offensive: 0, 
  	relevant: 0, 
  	happy: 0, 
  	overall: 0,
  	selected: null,
  	index: 0,
  	sum: 0,
  	display: null,
  	showPopoverTwo: false,
  	loading: true
  };

  	const touchThreshold = 20;
	this._panResponder = PanResponder.create({
		    onStartShouldSetPanResponder : () => false,
		    onMoveShouldSetPanResponder : (e, gestureState) => {
		        const {dx, dy} = gestureState;

		        return (Math.abs(dx) > touchThreshold) || (Math.abs(dy) > touchThreshold);
	    }
    });
	this._animatedValue = new Animated.Value(0)
}
	closeRow = (index) => {
	    if (prevOpenedRow && prevOpenedRow !== row[index]) {
			prevOpenedRow.close();
	    }
	    prevOpenedRow = row[index];
	}
	// _onGrant = () => {
	//   this.setState({ dragPanel: false });
	//   return true;
	// }

	// _onRelease = () => {
	//   this.setState({ dragPanel: true });
	// }
	handleCommentSubmission = () => {

		const { avatar, comment } = this.state;

		const previousID = this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].id;

		console.log("handle submission - comment.", this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1]);

		const owner = this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].poster;

		if (avatar !== null && comment.length > 0) {
			axios.post("http://recovery-social-media.ngrok.io/post/profile/pic/comment", {
				comment,
				username: this.props.username,
				avatar,
				id: previousID,
				owner
			}).then((res) => {
				if (res.data.message === "Successfully posted new comment!") {
					console.log("MAGIC :", res.data);

					this.setState({
						comment: "",
						replies: [ res.data.newly, ...this.state.replies ]
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
				username: this.props.username,
				avatar,
				id: previousID,
				owner
			}).then((res) => {
				if (res.data.message === "Successfully posted new comment!") {
					console.log("MAGIC :", res.data);
					this.setState({
						comment: "",
						replies: [ res.data.newly, ...this.state.replies ]
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
				username: this.props.username,
				comment, 
				id: previousID,
				owner
			}).then((res) => {
				if (res.data.message === "Successfully posted new comment!") {
					console.log("MAGIC :", res.data);
					this.setState({
						comment: "",
						replies: [ res.data.newly, ...this.state.replies ]
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
						concatenated: true,
						loading: false
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
              		update: true,
              		sum: this.state.sum + 1,
              		alreadyLiked: true
              	});

              	setTimeout(() => {
					alert("You've successfully liked this post!");
              	}, 2000)
				
			}
		}).catch((err) => {
			console.log(err);
		})
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

		if (this.state.ready === true && this.state.reactions) {
			let values = Object.values(this.state.reactions);
			
			for (var i = 0; i < values.length; i++) {
				this.setState({
					sum: this.state.sum += values[i]
				});
			}
			this.setState({
				calculated: true
			})

			return this.state.sum.toString();


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
			       <Badge style={styles.badgeLike}><NativeText>{this.state.calculated === true ? this.state.sum : this.calculateLikes()}</NativeText></Badge>
		            
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
			        <Badge style={styles.badgeLike}><NativeText>{this.state.calculated === true ? this.state.sum : this.calculateLikes()}</NativeText></Badge>
		            
		            <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/like.png")} />
			        </NativeButton>
			      )}>
				     <View style={{ height: "100%", width: 300, backgroundColor: "white", flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
				      	<NativeText style={{ padding: 10, fontWeight: "bold", color: "darkred", fontSize: 20 }}>You have already like/reacted to this post...</NativeText>

			     	 </View>
			     	 <TouchableOpacity onPress={() => {
			     	 	this.unlikePicture();
			     	 }}><Image style={{ width: 50, height: 50, left: 10, bottom: 10 }} source={require("../../../../assets/icons/undo.png")} /></TouchableOpacity>
				</Popover>
			);
		}
	}
	unlikePicture = () => {
		console.log('liked...', this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].poster);

		let bool = false;

		const likes = this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].likes;

		if (likes) {
			bool = likes.some((o) => {
				console.log("0 :", o);
				if (o["posterUsername"] === this.props.username) {
					return true;
				} else {
					return false;
				}
			})
		}

		console.log(bool);

		if (bool === true) {
			axios.post("http://recovery-social-media.ngrok.io/latest/profile/picture/unlike", {
				username: this.props.username,
				poster: this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].poster,
				exists: true,
				id: this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].id
			}).then((res) => {
				console.log(res.data);
				if (res.data.message === "Successfully modified data and removed like...") {
					this.setState({
	              		showPopover: false,
	              		sum: this.state.sum - 1,
	              		alreadyLiked: false
	              	})
					setTimeout(() => {
						alert("You've unliked this post.");
					}, 1000);
				}
			}).catch((err) => {
				console.log(err);
			})
		} 

	}
	calculateComments = () => {
		return this.state.replies.length;
	}
	handleRatingSubmission = () => {
		const { relatable, entertaining, offensive, relevant, happy, overall } = this.state;

		this.setState({
			rating: relatable + entertaining + offensive + relevant + happy + overall,
    		modalIsVisible: false
    	})
	}
	handleReviewRedirect = () => {
		if (this.state.modalIsVisible) {
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
			        		modalIsVisible: false
			        	})
			        }} style={styles.viewPicturesBtn}>
						<NativeText style={{ color: "white" }}>Close Modal</NativeText>
			        </NativeButton>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: -30, 
					    marginBottom: 40
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

		// bool - returns false if not met...
		console.log('liked...', this.state.selected);
		const bool = this.state.selected.likes.some((o) => {
			console.log("0 :", o);
			if (o["likedBy"] === this.props.username) {
				return true;
			} else {
				return false;
			}
		})

		if (bool === true) {
			axios.post("http://recovery-social-media.ngrok.io/like/subcomment/respond", {
				username: this.props.username,
				id: this.state.selected.id,
				receiver: this.state.selected,
				exists: true
			}).then((res) => {
				console.log(res.data);
				if (res.data.message === "Successfully liked this comment!") {
					row[this.state.index].close();
				}
			}).catch((err) => {
				console.log(err);
			})
		} else {
			axios.post("http://recovery-social-media.ngrok.io/like/subcomment/respond", {
				username: this.props.username,
				id: this.state.selected.id,
				receiver: this.state.selected,
				exists: false
			}).then((res) => {
				console.log(res.data);
				if (res.data.message === "Successfully liked this comment!") {
					row[this.state.index].close();
				}
			}).catch((err) => {
				console.log(err);
			})
		}

		console.log(bool);
	}
	RightActions = () => {
		return (
			<Fragment>
				<TouchableOpacity onPress={() => {
					this.likeCommentRespond();
				}}>
					<Image style={{ width: 40, height: 40, marginTop: 20, marginRight: 30 }} source={require("../../../../assets/icons/like.png")} />
				</TouchableOpacity>
				<TouchableOpacity>
					<Image style={{ width: 40, height: 40, marginTop: 20, marginRight: 30 }} source={require("../../../../assets/icons/reply-auto.png")} />
				</TouchableOpacity>
			</Fragment>
		);
	}
	loadImage = (like) => {
		axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
			username: like.likedBy
		}).then((res) => {
			const picture = res.data.user.profilePic[res.data.user.profilePic.length - 1].picture;
			// append picture to object
			like["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;
		
		}).catch((err) => {
			console.log("FAILURE :", err);
		})
		return (
			<TouchableOpacity onPress={() => {
		      	console.log("picture clicked...");
		    }}>
		        <Image style={styles.image} source={{uri: like.picture }}/>
	    	</TouchableOpacity>
		);
	}
	renderSlideUpContent = () => {
		if (this.state.ready === true && this.state.loading === false) {
			return (
				<ScrollView {...this._panResponder.panHandlers} style={this.props.dark_mode ? styles.containerModalDark : styles.containerModal}>
				<View style={{ marginTop: 50 }}>
					<Button title='Hide' onPress={() => this._panel.hide()} />
					<AutoGrowingTextInput value={this.state.comment} onChangeText={(value) => {
						this.setState({
							comment: value
						})
					}} placeholderTextColor='black' style={styles.textInput} placeholder={'Your your Comment/Message Here...'} />
					<View style={this.props.dark_mode ? styles.containerTwoRowDark : styles.containerTwoRow}>
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
							     style={this.props.dark_mode ? styles.cameraDark : styles.camera}
							     resizeMode='cover'
							     source={require("../../../../assets/icons/upload-two.png")}
							   />
							 </PhotoUpload>
				     	<NativeButton onPress={() => {
				     		this.handleCommentSubmission();
				     	}} style={this.props.dark_mode ? styles.darkBtn : styles.btn}>
							<NativeText style={{ color: "white" }}>Submit New Comment</NativeText>
						</NativeButton>
				    </View>
				</View>
	            {this.state.replies && this.state.concatenated === true ? this.state.replies.map((item, index) => {
	            	return (
	            	<Fragment>
	            	<Swipeable ref={ref => row[index] = ref} onSwipeableRightOpen={() => {
	            		this.closeRow(index);
	            		// set to state so accessible in functions to respond to comment
	            		this.setState({
	            			selected: item,
	            			index
	            		})
	            	}} renderRightActions={this.RightActions}>
						<View style={styles.container}>
			              <TouchableOpacity onPress={() => {

			              }}>
			                <Image style={styles.image} source={{uri: item.picture }}/>
			              </TouchableOpacity>
			              <View style={styles.content}>
			                <View style={styles.contentHeader}>
			                  <Text  style={this.props.dark_mode ? styles.darkName : styles.name}>{item.poster}</Text>
			                  
			                </View>
			                <Text style={styles.time}>
			                    {item.date}
			                  </Text>
			                <Text rkType='primary3 mediumLine' style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>{item.comment}</Text>
			               	{item.likes ? <Popover
						      isVisible={this.state.showPopoverTwo}
						      onRequestClose={() => {
						      	this.setState({
						      		showPopover: false
						      	})
						      }}
						      from={(
						        <TouchableOpacity onPress={() => {
						        	console.log("B-I-N-G-O: ", item);
						        	this.setState({
							      		showPopoverTwo: true,
							      		display: item.likes
							      	})
						        }}>
						          <Text style={this.props.dark_mode ? { color: "white" } : { color: "darkred" }}>View Reactions</Text>
						        </TouchableOpacity>
						      )}>
						      <NativeButton onPress={() => {
						      	this.setState({
						      		showPopoverTwo: false,
						      		display: null
						      	})
						      }} style={{ alignItems: "center", justifyContent: "center", backgroundColor: "black", alignContent: "center" }}>
								<NativeText style={{ color: "white" }}>Close</NativeText>
						      </NativeButton>
						      <ScrollView style={{ width: width * 0.90, height: height, backgroundColor: "white" }}>
						      {this.state.display !== null ? this.state.display.map((like, indexxx) => {
						      		return (
										<View key={indexxx} style={styles.container}>
							              {this.loadImage(like)}
							              <View style={styles.content}>
							                <View style={styles.contentHeader}>
							                  <Text style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>{like.likedBy}</Text>
							                  
							                </View>
							                <Text style={styles.time}>
							                    {like.date}
							                  </Text>
							              </View>
										  
							            </View>
							      	);
						      }) : console.log("display === null")}
						      </ScrollView>
						    </Popover> : null}
			              </View>
						  
			            </View>
			            {item.postedImage ? <Image style={{ flex: 1, height: 350, width: width * 0.80, marginLeft: 50 }} resizeMode="contain" source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${item.postedImage}` }} /> : null}
			        </Swipeable>
			        </Fragment>
	            	);
	            }) : null}
	            <Button title='Hide' onPress={() => this._panel.hide()} />
	          </ScrollView>
			);
		} else {
			return <LoadingWall />;
		}
	}
	render() {
		console.log(this.state);
		if (this.state.loaded === true) {

			return (
				<Fragment>
				{this.renderLikesOrNot()}
					<Header style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
			          <Left>
			            <NativeButton onPress={() => {
			             	// redirect
			             	if (this.props.route.params.sendFromIndividual === true) {
								this.props.navigation.navigate("profile-individual");
			             	} else {
			             		this.props.navigation.navigate("public-wall");
			             	}
			             	
			            }} transparent>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, marginBottom: 10, tintColor: "white" } : { width: 35, height: 35, marginBottom: 10 }} source={require("../../../../assets/icons/back-again.png")}/>
			            </NativeButton>
			          </Left>
			          <Body><Title style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Profile Picture</Title>
			          </Body>
			          <Right>
			            <NativeButton onPress={() => {
			            	
			            }} transparent>
			              <Image style={this.props.dark_mode ? { tintColor: "white", width: 45, height: 45, marginBottom: 10 } : { width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/chat.png")}/>
			            </NativeButton>
			          </Right>
			        </Header>
			    <ScrollView style={this.props.dark_mode ? { maxHeight: height, backgroundColor: "black" } : { maxHeight: height - 150 }}>
			       <Image resizeMode={'cover'} style={{ width: width * 0.90, marginLeft: 20,  height: 400 }} source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.route.params.user.profilePic[this.props.route.params.user.profilePic.length - 1].picture}` }} />
			       <Footer>
			          <FooterTab style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
						{this.renderPopover()} 
			            <NativeButton onPress={() => {
			            	this._panel.show();
			            }} style={{ paddingTop: 30 }} active badge vertical>
			              <Badge style={styles.badge}><NativeText>{this.calculateComments()}</NativeText></Badge>
			              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/comment.png")} />
			              <NativeText>Comments</NativeText>
			            </NativeButton>
			            <NativeButton onPress={() => {
			            	this.setState({
			            		modalIsVisible: true
			            	})
			            }} vertical>
			            <Image style={{ width: 50, height: 50, top: 7 }} source={require("../../../../assets/icons/review.png")} />
			            </NativeButton>
			          </FooterTab>
			        </Footer>
			        <NativeButton onPress={() => {
			        	this.props.navigation.navigate("image-gallery", { user: this.props.route.params.user });
			        }} style={styles.viewPicturesBtn}>
						<NativeText style={{ color: "white" }}>View Other Profile Pictures</NativeText>
			        </NativeButton>
			    </ScrollView>
				{this.handleReviewRedirect()}
			       <View style={{ bottom: 0, width: width, position: "absolute" }}>
						<Footer>
				          <FooterTab style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
				            <NativeButton onPress={() => {
					            	this.props.navigation.navigate("dashboard");
					            }}>
				              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/home-run.png")} />
				            </NativeButton>
				            <NativeButton onPress={() => {
					            	this.props.navigation.navigate("dashboard");
					            }}>
					            <Badge style={{ marginBottom: -15, marginLeft: 5 }}><NativeText>3</NativeText></Badge>
				               <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/notification.png")} />
				            </NativeButton>
				            <NativeButton onPress={() => {
					            	this.props.navigation.navigate("chat-users");
					            }}>
				              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/mail-three.png")} />
				            </NativeButton>
				            <NativeButton active onPress={() => {
					            	this.props.navigation.navigate("public-wall");
					            }}>
				              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/wall.png")} />
				            </NativeButton>
				            <NativeButton onPress={() => {
			                  this.props.navigation.navigate("profile-settings");
			                }}>
			                <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/list.png")} />
			              </NativeButton>
				          </FooterTab>
			        	</Footer>
					</View>
				
					<SlidingUpPanel animatedValue={this._animatedValue} allowDragging={false} ref={c => this._panel = c}>
			          {this.renderSlideUpContent()}
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
				<View style={this.props.dark_mode ? { backgroundColor: "black", height: height } : { backgroundColor: "white" }}>
					<LoadingWall />
				</View>
			</Fragment>
			);
		}
		return null;
	}
}
const styles = StyleSheet.create({
  viewPicturesBtnBlue: {
	backgroundColor: "#613DC1", 
  	marginTop: 20, 
  	alignItems: "center", 
  	justifyContent: "center", 
  	alignContent: "center",
  	marginBottom: 50
  },
  viewPicturesBtn: {
  	backgroundColor: "#613DC1", 
  	marginTop: 20, 
  	alignItems: "center", 
  	justifyContent: "center", 
  	alignContent: "center",
  	marginBottom: 50
  },
  cameraDark: {
	width: 35, 
	height: 35, 
	bottom: 0, 
	marginLeft: 20, 
	marginTop: 20,
	marginRight: 10,
	tintColor: "#858AE3"
  },
  camera: {
	width: 35, 
	height: 35, 
	bottom: 0, 
	marginLeft: 20, 
	marginTop: 6
  },
  darkBtn: {
	alignItems: "center", 
	justifyContent: "center", 
	width: width * 0.80,
	marginRight: 10,
	marginTop: 20,
	backgroundColor: "#858AE3"
  },
  btn: {
	alignItems: "center", 
	justifyContent: "center", 
	width: width * 0.80,
	marginRight: 10,
	backgroundColor: "#858AE3"
  },
  containerTwoRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  containerTwoRowDark: {
 	flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  button: {
    backgroundColor: 'green',
    width: '40%',
    height: 40
  },
  containerModal: {
    backgroundColor: 'white'
  },
  containerModalDark: {
  	backgroundColor: 'black'
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
    color: "#808080",
  },
  darkName: {
    fontSize:16,
    fontWeight:"bold",
    color: "white"
  },
  name:{
    fontSize:16,
    fontWeight:"bold"
  },
})

const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username,
		dark_mode: state.mode.dark_mode
	}
}
export default connect(mapStateToProps, {  })(ProfilePicView);