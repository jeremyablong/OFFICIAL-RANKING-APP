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
  Keyboard
} from 'react-native';
import { Container, Header, Card, CardItem, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab } from 'native-base';
import axios from "axios";
import Modal from 'react-native-modal';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from "react-redux";
import SlidingUpPanel from 'rn-sliding-up-panel';
import PhotoUpload from 'react-native-photo-upload';
import FriendsListSubComponent from "../../friends/friendList.js";
import NavigationDrawer from "../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import RBSheet from "react-native-raw-bottom-sheet";
import ProgressiveImage from "../../image/image.js";
import Video from 'react-native-video';
 
const { width, height } = Dimensions.get("window");

const URL = "http://recovery-social-media.ngrok.io";

class ProfileIndividual extends React.Component {
constructor(props) { 
  super(props);

  this.state = {
  	user: null,
  	modalIsVisible: false,
  	message: "",
  	cover: null,
  	isOpen: false,
  	alreadyFriends: false,
  	requestSent: false, 
  	ready: false,
  	posts: [],
  	countFrom: 5,
  	conditionalRender: false
  };
}
	componentDidMount() {

	  	axios.post(`${URL}/get/user/by/username`, {  
	  		username: this.props.route.params.user.username
	  	}).then((res) => { 
	  		console.log(res.data);
	  		if (res.data.message === "FOUND user!") { 
	  			if (res.data.user.friends) {
 
	  				for (let i = 0; i < res.data.user.friends.length; i++) {
		  				let friend = res.data.user.friends[i];
		  				console.log(friend)
						if (Object.values(friend).indexOf(this.props.username) > -1) {
		  					console.log("includes...!");
		  					this.setState({
		  						user: res.data.user,
		  						alreadyFriends: true
		  					})
			  			} else {
			  				console.log("Doesn't include...");
			  			}
		  			}
		  			if (res.data.user.wall) {
		  				for (var i = 0; i < res.data.user.wall.length; i++) {
			          		let post = res.data.user.wall[i];
			          		console.log("postieeee ", post);
			          		axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
								username: post.author
							}).then((resolution) => {
								console.log("resolution :", resolution.data);
								const picture = resolution.data.user.profilePic[resolution.data.user.profilePic.length - 1].picture;
								// append picture to object
								post["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

								this.setState({
									posts: [post, ...this.state.posts]
								})
							}).catch((err) => {
								console.log("FAILURE :", err);
							})
			          	}
		  			}
	  			} else {
	  				console.log("doesnt have any friends.");
	  				if (res.data.user.wall) {
	  					for (let i = 0; i < res.data.user.wall.length; i++) {
			          		let post = res.data.user.wall[i];
			          		console.log("postieeee ", post);
			          		axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
								username: post.author
							}).then((resolution) => {
								console.log("resolution :", resolution.data);
								const picture = resolution.data.user.profilePic[resolution.data.user.profilePic.length - 1].picture;
								// append picture to object
								post["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

								this.setState({
									posts: [post, ...this.state.posts]
								})
							}).catch((err) => {
								console.log("FAILURE :", err);
							})
			          	}
	  				}
	  				this.setState({
	  					user: res.data.user,
	  					alreadyFriends: false,
	  					ready: true
	  				})
	  			}
	  			this.setState({
		  			user: res.data.user,
		  			ready: true
		  		})
	  		}
	  	}).catch((err) => {
	  		console.log(err);
	  	});
	}
	renderOne = (images) => {
	    const {countFrom} = this.state;
	    return(
	      <View style={styles.row}>
	        <TouchableOpacity style={[styles.imageContent, styles.imageContent1]} onPress={() => {
	        	this.viewImage();
	        }}>
	          <ProgressiveImage style={styles.image} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${images[0]}`}}/>
	        </TouchableOpacity>
	      </View>
	    );
	}
	viewImage = (imageUrl) => {
		console.log("clicked image...", imageUrl);
		this.setState({
			modalImageValue: imageUrl,
			showModal: true
		})
	}
	renderModal = () => {
		return (
			<Modal isVisible={this.state.showModal}>
	          <View style={this.props.dark_mode ? styles.modalViewDark : styles.modalView}>
	            <ProgressiveImage source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.modalImageValue}` }} style={{ width: width - 75, height: height * 0.60 }} />
	            <NativeButton onPress={() => {
	            	this.setState({
	            		showModal: false
	            	})
	            }} style={styles.closeBtn}>
					<NativeText style={{ color: "white" }}>Close</NativeText>
	            </NativeButton>
	          </View>
	        </Modal>
		);
	}
	renderTwo = (images) => {
	    const { countFrom } = this.state;
	    const conditionalRender = [3, 4].includes(images.length) || images.length > +countFrom && [3, 4].includes(+countFrom);

	    return(
	      <View style={styles.row}>
	        <TouchableOpacity resizeMode={"contain"} style={this.props.dark_mode ? [styles.imageContentDark, styles.imageContent2] : [styles.imageContent, styles.imageContent2]} onPress={() => {
	        	if (conditionalRender) {
					this.viewImage(images[1]);
	        	} else {
	        		this.viewImage(images[0]);
	        	}
	        }}>
	          <ProgressiveImage style={styles.image} source={{uri: (conditionalRender) ? `https://s3.us-west-1.wasabisys.com/rating-people/${images[1]}` : `https://s3.us-west-1.wasabisys.com/rating-people/${images[0]}`}}/>
	        </TouchableOpacity>
	        <TouchableOpacity style={this.props.dark_mode ? [styles.imageContentDark, styles.imageContent2] : [styles.imageContent, styles.imageContent2]} onPress={() => {
	        	if (conditionalRender) {
					this.viewImage(images[2]);
	        	} else {
	        		this.viewImage(images[1]);
	        	}
	        }}>
	          <ProgressiveImage style={styles.image} source={{uri: (conditionalRender) ? `https://s3.us-west-1.wasabisys.com/rating-people/${images[2]}` : `https://s3.us-west-1.wasabisys.com/rating-people/${images[1]}`}}/>
	        </TouchableOpacity>
	      </View>
	    );
	}

	renderThree = (images) => {
	    const { countFrom } = this.state;
	    const overlay = !countFrom || countFrom > 5 || images.length > countFrom && [4, 5].includes(+countFrom) ? this.renderCountOverlay(images) : this.renderOverlay(images);
	    const conditionalRender = images.length == 4 || images.length > +countFrom && +countFrom == 4;

	    return(
	      <View style={styles.row}>
	        <TouchableOpacity style={this.props.dark_mode ? [styles.imageContentDark, styles.imageContent3] : [styles.imageContent, styles.imageContent3]} onPress={() => {
	        	if (conditionalRender) {
					this.viewImage(images[1]);
	        	} else {
	        		this.viewImage(images[2]);
	        	}
	        	
	        }}>
	          <ProgressiveImage style={styles.image} source={{uri: (conditionalRender) ? `https://s3.us-west-1.wasabisys.com/rating-people/${images[1]}` : `https://s3.us-west-1.wasabisys.com/rating-people/${images[2]}`}}/>
	        </TouchableOpacity>
	        <TouchableOpacity style={this.props.dark_mode ? [styles.imageContentDark, styles.imageContent3] : [styles.imageContent, styles.imageContent3]} onPress={() => {
	        	if (conditionalRender) {
					this.viewImage(images[2]);
	        	} else {
	        		this.viewImage(images[3]);
	        	}
	        }}>
	          <ProgressiveImage style={styles.image} source={{uri: (conditionalRender) ? `https://s3.us-west-1.wasabisys.com/rating-people/${images[2]}` : `https://s3.us-west-1.wasabisys.com/rating-people/${images[3]}`}}/>
	        </TouchableOpacity>
	        {overlay}
	      </View>
	    );
	}

	renderOverlay = (images) => {
	    return(
	        <TouchableOpacity style={this.props.dark_mode ? [styles.imageContentDark, styles.imageContent3] : [styles.imageContent, styles.imageContent3]} onPress={() => {
	        	this.viewImage(images[images.length - 1]);
	        }}>
	          <ProgressiveImage style={styles.image} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${images[images.length - 1]}`}}/>
	        </TouchableOpacity>
	    );
	}

	renderCountOverlay = (images) => {
	    const {countFrom} = this.state;
	    const extra = images.length - (countFrom && countFrom > 5 ? 5 : countFrom);
	    const conditionalRender = images.length == 4 || images.length > + countFrom && +countFrom == 4;
	    return(
	        <TouchableOpacity style={[styles.imageContent, styles.imageContent3]} onPress={() => {
	        	if (conditionalRender) {
	        		this.viewImage(images[3]);
	        	} else {
	        		this.viewImage(images[4]);
	        	}
	        }}>
	          <ProgressiveImage style={styles.image} source={{uri: (conditionalRender) ? `https://s3.us-west-1.wasabisys.com/rating-people/${images[3]}` : `https://s3.us-west-1.wasabisys.com/rating-people/${images[4]}`}}/>
	          <View style={this.props.dark_mode ? styles.overlayContentDark : styles.overlayContent}>
	            <View>
	              <Text style={styles.count}>+{extra}</Text>
	            </View>
	          </View>
	        </TouchableOpacity>
	    );
	}
	sendMessage = () => {
		const { user, message } = this.state;

		console.log(this.props.username);

		axios.post("http://recovery-social-media.ngrok.io/send/private/message", {
	  		sender: this.props.username,
	  		reciever: user.username,
	  		message
	  	}).then((res) => {
	  		console.log(res.data);
	  		if (res.data.message === "Successfully updated both users!") {
	  			alert("You've successfully messaged this user!");

	  			setTimeout(() => {
	  				this.setState({
	  					modalIsVisible: false
	  				})
	  			}, 3000)
	  		}
	  	}).catch((err) => {
	  		console.log(err);
	  	})
	}

	uploadCoverPhoto = () => { 
		
		const { avatar } = this.state;

        axios.post("http://recovery-social-media.ngrok.io/upload/cover/photo", {
          avatar,
          username: this.props.username
        }).then((res) => {
          console.log(res.data);
          if (res.data.message === "Successfully uploaded cover photo!") {
          	this.setState({
          		cover: res.data.image
          	}, () => {
          		alert("Successfully uploaded your new cover photo!");
          	})
          }
        }).catch((err) => {
          console.log(err);
        })
	}
	renderSlideUpContent = () => {
		const { user } = this.state;

		if (user !== null) {
			return (
				 <ImageBackground resizeMode='cover' source={{ uri: this.state.cover !== null ? `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.cover}` : `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.user.coverPhoto}` }} style={styles.header}>{user.username === this.props.username ? <TouchableOpacity onPress={() => {
		          	this._panel.show();
		          }}><Image style={{ width: 50, height: 50, position: "absolute", top: 5, left: 5,  tintColor: "white" }} source={require("../../../assets/icons/upload-two.png")} /></TouchableOpacity> : null}</ImageBackground>
			);
		} else {
			return (
				<Fragment><View style={styles.header}></View></Fragment>
			);
		}
	}
	redirectUser = () => {
		this.props.navigation.navigate("profile-pic-view", { user: this.state.user, sendFromIndividual: true });
	}
	sendFriendRequest = () => {
		console.log("send friend request...", this.state.user);
		axios.post("http://recovery-social-media.ngrok.io/send/friend/request", {
          username: this.props.username,
          recipient: this.state.user.username
        }).then((res) => {
          if (res.data.message === "Successfully sent friend request!") {
          	console.log(res.data);
          	alert(res.data.message);
          	this.setState({
          		requestSent: true
          	})
          }
        }).catch((err) => {
          console.log(err);
        })
	}
	onBuffer = () => {

	}
	videoError = () => {
		
	}
	renderEmojisReturn = (post) => { 
		console.log("POSTIE :", post);

		const emojis = [];

		for (let key in post) {
			let element = post[key];

			console.log("key ", key);
 
			if (element > 0) {
				switch (key) {   
					case "angry":
						console.log("angry");
						emojis.push("🤬");
						// return <Text style={this.props.dark_mode ? { textAlign: "left", color: "white", position: "absolute", left: 6, bottom: 10 } : { textAlign: "left", position: "absolute", left: 6, bottom: 10 }}>🤬</Text>;
						break;  
					case "frustrated":
						console.log("frustrated");
						emojis.push("😤");
						// return <Text style={this.props.dark_mode ? { textAlign: "left", color: "white", position: "absolute", left: 6, bottom: 10 } : { textAlign: "left", position: "absolute", left: 6, bottom: 10 }}>😤</Text>;
						break;
					case "heart": 
						console.log("heart");
						emojis.push("❤️");
						// return <Text style={this.props.dark_mode ? { textAlign: "left", color: "white", position: "absolute", left: 6, bottom: 10 } : { textAlign: "left", position: "absolute", left: 6, bottom: 10 }}>❤️</Text>;
						break;
					case "heartFace":
						console.log("heartFace");
						emojis.push("😍");
						// return <Text style={this.props.dark_mode ? { textAlign: "left", color: "white", position: "absolute", left: 6, bottom: 10 } : { textAlign: "left", position: "absolute", left: 6, bottom: 10 }}>😍</Text>;
						break;
					case "laugh":
						console.log("laugh");
						emojis.push("😆");
						// return <Text style={this.props.dark_mode ? { textAlign: "left", color: "white", position: "absolute", left: 6, bottom: 10 } : { textAlign: "left", position: "absolute", left: 6, bottom: 10 }}>😆</Text>;
						break;
					case "puke":
						console.log("puke");
						emojis.push("🤮");
						// return <Text style={this.props.dark_mode ? { textAlign: "left", color: "white", position: "absolute", left: 6, bottom: 10 } : { textAlign: "left", position: "absolute", left: 6, bottom: 10 }}>🤮</Text>;
						break;
					case "sad":
						console.log("sad");
						emojis.push("😢");
						// return <Text style={this.props.dark_mode ? { textAlign: "left", color: "white", position: "absolute", left: 6, bottom: 10 } : { textAlign: "left", position: "absolute", left: 6, bottom: 10 }}>😢</Text>;
						break;
					default:
						return;
						break;
				} 
			}

			console.log("elemenntttttttttttt :" , element);
		}
		console.log("emoji array ---------- :", emojis);
		return <Text style={this.props.dark_mode ? { textAlign: "left", color: "white", position: "absolute", left: 6, bottom: 10 } : { textAlign: "left", position: "absolute", left: 6, bottom: 10 }}>{emojis}</Text>;
	}
	render() { 
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		console.log(this.state);
		const { user } = this.state;
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
		          <Left>
		            <NativeButton onPress={() => {
		              this.props.navigation.navigate("dashboard");
		            }} hasText transparent>
		             <NativeText>Back</NativeText>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>{user !== null ? user.username : "--"}</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked user interface...");
		                 {/*this.props.navigation.navigate("chat-users");*/}
					    this.setState({
					    	isOpen: true
					    })
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/user-interface.png")}/>
		            </NativeButton>
		            {/*<NativeButton onPress={() => {
		            	console.log("clicked chat...");
		            	this.props.navigation.navigate("chat-users");
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
		            </NativeButton>*/}
		          </Right>
		        </Header>
		    	{this.renderModal()}
		        <ScrollView style={styles.container}>
				  {this.renderSlideUpContent()}
		          <TouchableOpacity style={styles.avatar} onPress={this.redirectUser}>
					 <Image style={{ width: 130,
					    height: 130,
					    borderRadius: 63,
					    marginTop: -4,
					    marginLeft: -4,
					    borderWidth: 4,
					    borderColor: "white",
					    paddingRight: 10 }} source={{ uri: user !== null ? `https://s3.us-west-1.wasabisys.com/rating-people/${user.profilePic[user.profilePic.length - 1].picture}` : 'https://bootdey.com/img/Content/avatar/avatar6.png' }}/>
				  </TouchableOpacity>
		          <View style={styles.body}>
		            <View style={styles.bodyContent}>
		            {this.state.user !== null && (this.state.user.username === this.props.username) ? <TouchableOpacity onPress={() => {
		              	this.props.navigation.navigate("upload-profile-picture", { publicProfile: false });
		              }} style={{ right: 15, top: -25, position: "absolute" }}><Image style={{ width: 50, height: 50 }} source={require("../../../assets/icons/ar-camera.png")}/></TouchableOpacity> : null}
		              <Text style={styles.name}>{user !== null ? user.fullName : "--"}</Text>
		              <Text style={styles.ranking}><Text style={{ color: "black" }}>Social Ranking:</Text> 671</Text>
		              <Text style={styles.info}>{user !== null ? user.username : "--"}</Text>
		              <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
		              
		              {this.props.username !== this.props.route.params.user.username ? <TouchableOpacity onPress={() => {
		              	this.RBSheet.open();
		              }} style={styles.buttonContainer}>
		                <Fragment><Image style={{ width: 30, height: 30, tintColor: "white" }} source={require("../../../assets/icons/mail-three.png")} /><Text style={{ color: "white" }}>   Message This User</Text></Fragment>  
		              </TouchableOpacity> : null} 
		              <View  /> 
		              {(this.props.username !== this.props.route.params.user.username && this.state.alreadyFriends !== true) && this.state.requestSent === false ? <TouchableOpacity onPress={() => {
		              	this.sendFriendRequest();
		              }} style={styles.buttonContainerThree}>
		                <Fragment><Image style={{ width: 30, height: 30 }} source={require("../../../assets/icons/request.png")} /><Text style={{ color: "white" }}>  Send Friend Request</Text></Fragment>  
		              </TouchableOpacity> : null}          
		            {/*  <TouchableOpacity style={styles.buttonContainer}>
		                <Text>Opcion 2</Text> 
		              </TouchableOpacity>*/}
		            </View>
		            <FriendsListSubComponent navigation={this.props.navigation} user={this.props.route.params.user} />

		             {this.state.ready === true ? this.state.posts.map((post, index) => {
		            	console.log("post... :", post);
							return (
								<Card>  
					            <CardItem style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
					              <Left>
					                <Thumbnail source={{ uri: post.picture }} />
					                <Body>
					                  <TouchableOpacity onPress={() => {
					                  	this.handleRedirect(post);
					                  }}><NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>{post.author}</NativeText></TouchableOpacity>
					                  <NativeText note>{post.date}</NativeText>
					                </Body> 
					              </Left>
					            </CardItem>
					             <CardItem cardBody style={this.props.dark_mode ? { backgroundColor: "black", flex: 1 } : { backgroundColor: "white", flex: 1 }}>
					              {post.text ?  <NativeText style={this.props.dark_mode ? { textAlign: "left", color: "white", paddingLeft: 20, paddingRight: 20 } : { textAlign: "left", color: "black", paddingLeft: 20, paddingRight: 20 }}>{post.text}</NativeText> : null}
					            </CardItem>
					            <CardItem style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
									{post.images ? <View style={styles.container}>
							          {[1, 3, 4].includes(post.images.length)  && this.renderOne(post.images)}
							          {post.images.length >= 2 && post.images.length != 4 && this.renderTwo(post.images)}
							          {post.images.length >= 4 && this.renderThree(post.images)}
							      </View> : null}
							      
								  {post.original ? <Fragment><Card style={{flex: 0, width: width * 0.88, minHeight: 250, marginBottom: 35, borderWidth: 3, marginLeft: 10, borderColor: "#4E148C" }}>
						            <CardItem>
						              <Left>
						                <Thumbnail source={{uri: post.original.picture }} />
						                <Body> 
						                  <TouchableOpacity onPress={() => {
						                  	this.props.navigation.navigate("profile-individual", {
						                  		user: {
						                  			username: post.original.author 
						                  		}
						                  	})
						                  }}>
											<Text>{post.original.author}</Text>
						                  </TouchableOpacity>
						                  <Text note>{post.original.date}</Text>
						                </Body>
						              </Left>
						            </CardItem>
						            <CardItem>
						              <Body>
						                {post.original.images ? <View style={this.props.dark_mode ? styles.containerDark : styles.container}>
								          {[1, 3, 4].includes(post.original.images.length)  && this.renderOne(post.original.images)}
								          {post.original.images.length >= 2 && post.original.images.length != 4 && this.renderTwo(post.original.images)}
								          {post.original.images.length >= 4 && this.renderThree(post.original.images)}
							      		</View> : null} 
						              </Body>
						            </CardItem>
						            {post.original.text ?  <NativeText style={this.props.dark_mode ? { textAlign: "left", color: "white", paddingLeft: 20, paddingRight: 20 } : { textAlign: "left", color: "black", paddingLeft: 20, paddingRight: 20, marginBottom: 60 }}>{post.original.text}</NativeText> : null}
						             
						          
						          </Card></Fragment> : null}

							      {post.videoID ? <Video 
							      	   ignoreSilentSwitch={"ignore"} 
							      	   muted={false} 
							      	   paused={true}  
							      	   resizeMode={"cover"} 
							      	   controls={true} 
							      	   source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.videoID}` }} 
									   ref={(ref) => {
									     this.player = ref
									   }}                                  
									   onBuffer={this.onBuffer}            
									   onError={this.videoError}          
									   style={styles.backgroundVideo} 
									/> : null }
					            </CardItem>
					            <CardItem style={this.props.dark_mode ? { backgroundColor: "black", paddingTop: 15, paddingTop: 40, paddingBottom: 10 } : { backgroundColor: "white", paddingTop: 40, paddingBottom: 10 }}>
									<TouchableOpacity onPress={() => {
										console.log("clicked.")
										this.props.navigation.navigate("wall-individual", { post });
									}}>
										{this.renderEmojisReturn(post.reactions)}
										<Text style={this.props.dark_mode ? { textAlign: "right", color: "white", position: "absolute", right: 6, bottom: 10 } : { textAlign: "right", position: "absolute", right: 6, bottom: 10 }}>{post.replies.length} Comments - {Math.floor(Math.random() * (9 - 0 + 1)) + 0} Shares</Text>
									</TouchableOpacity>
					            </CardItem>
					            <Footer style={{ width: width * 0.98 }}>
						          <FooterTab>
						            <NativeButton style={this.props.dark_mode ? { backgroundColor: "black", borderWidth: 3, borderColor: "white" } : { backgroundColor: "white", borderWidth: 3, borderColor: "lightgrey", margin: 3 }} onPress={() => {
						            	this.likePost();
						            }}>
						              <NativeText style={this.props.dark_mode ? styles.darkText : styles.lightText}>Like</NativeText>
						            </NativeButton>
						            <NativeButton style={this.props.dark_mode ? { backgroundColor: "black", borderWidth: 3, borderColor: "white" } : { backgroundColor: "white", borderWidth: 3, borderColor: "lightgrey", margin: 3 }}>
						              <NativeText style={this.props.dark_mode ? styles.darkText : styles.lightText}>Comment</NativeText>
						            </NativeButton>
						            <NativeButton style={this.props.dark_mode ? { backgroundColor: "black", borderWidth: 3, borderColor: "white" } : { backgroundColor: "white", borderWidth: 3, borderColor: "lightgrey", margin: 3 }}>
						              <NativeText style={this.props.dark_mode ? styles.darkText : styles.lightText}>Share</NativeText>
						            </NativeButton>
						          </FooterTab>
						        </Footer>
					            

					          </Card>
							);
		            }) : null}
		        </View>
		      </ScrollView>
		    </SideMenu>
		    <RBSheet 
		      showsVerticalScrollIndicator={false}
	          ref={ref => {
	            this.RBSheet = ref;
	          }}
	          height={400}
	          openDuration={250}
	          customStyles={{ 
	            container: {
	              justifyContent: "center",
	              alignItems: "center"
	            }
	          }}
	        >
	          <ImageBackground source={require("../../../assets/images/classic.jpg")} style={{ flex: 1, height: height, width: width, alignItems: "center", justifyContent: "center" }}>
		          <KeyboardAwareScrollView style={{ marginTop: 30 }} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
			          {/*<Image style={{ width: 300, height: 300, marginBottom: 40}} source={require("../../../assets/images/123.jpg")} />*/}
			          <Text style={styles.customTexttt}>You are messaging <Text style={{ color: "aquamarine" }}>{this.state.user !== null ? this.state.user.fullName : "--"}</Text>... </Text>
			            <AutoGrowingTextInput onChangeText={(message) => {
			            	this.setState({
			            		message
			            	})
			            }} placeholderTextColor="black" style={styles.textInput} placeholder={'Enter Your Message Here...'} />
			            <TouchableOpacity onPress={() => {
			              	this.sendMessage();
			              }} style={styles.buttonContainerTwo}>
			                <Fragment><Image style={{ width: 30, height: 30 }} source={require("../../../assets/icons/message.png")} /><Text style={{ color: "white" }}>   Send Message...</Text></Fragment>  
			              </TouchableOpacity>
		           		<TouchableOpacity onPress={() => {
			              	this.RBSheet.close();
			            }} style={styles.buttonContainer}>
			                <Fragment><Image style={{ width: 30, height: 30, tintColor: "white" }} source={require("../../../assets/icons/close.png")} /><Text style={{ color: "white" }}>  Close This Modal</Text></Fragment>  
		              </TouchableOpacity>
	          	</KeyboardAwareScrollView>
	          </ImageBackground>
	        </RBSheet>
      		<SlidingUpPanel ref={c => this._panel = c}>
	          <View style={styles.slide}>
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
				     style={{
				       paddingVertical: 30,
				       width: 150,
				       height: 150,
				       borderRadius: 75, 
				       tintColor: "#858AE3"
				     }}
				     resizeMode='cover'
				     source={require("../../../assets/icons/user.png")}
				   />
				 </PhotoUpload>
				 <Text style={{ fontSize: 25 }}>Please select a wall cover photo</Text>
				 <View style={{ top: -150 }}>
					<NativeButton style={{ backgroundColor: "#4E148C" }} onPress={this.uploadCoverPhoto}>
						<NativeText style={{ color: "white" }}>Submit Cover Photo</NativeText>
					 </NativeButton>
				 </View>
	            <Button title='Hide' onPress={() => this._panel.hide()} />
	          </View>
	        </SlidingUpPanel>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  customTexttt: {
  	 color: "white", 
  	 fontWeight: "bold", 
  	 fontSize: 18, 
  	 marginBottom: 20, 
  	 backgroundColor: 'rgba(0, 0, 0, 0.6)', 
  	 padding: 10 
  },
  touchable: {
  	width: width * 0.33333, 
  	paddingRight: 6, 
  	paddingLeft: 6, 
  	marginBottom: 5, 
  	marginTop: 20, 
  	shadowColor: "#000",
	shadowOffset: {
		width: 0,
		height: 6,
	},
	shadowOpacity: 0.29,
	shadowRadius: 9.30,

	elevation: 15
  },
  container: {
  	backgroundColor: "white"
  },
  buttonContainerThree: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#4E148C",
    borderWidth: 3, 
    borderColor: "#97DFFC"
},
  slide: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header:{
    backgroundColor: "#97DFFC",
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
    color:"black",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    alignItems: 'center',
    padding:30,
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  infoTwo:{
    fontSize:16,
    color: "black",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "black",
    marginTop:10,
    textAlign: 'center'
  },
  backgroundVideo: {
		width: width * 0.90,
		height: 250,
		minHeight: 250, 
		minWidth: width * 0.90,
		marginBottom: 40
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
    backgroundColor: "#858AE3",
    borderWidth: 3, 
    borderColor: "#4E148C"
  },
  ranking: {
    fontSize:30,
    color:"#e31b39",
    fontWeight:'600',
    textDecorationLine: "underline"
  },
  buttonContainerTwo: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "black",
    borderWidth: 3, 
    borderColor: "white"
  },
  textInput: {
  	backgroundColor: "white",
  	padding: 10,
  	width: 300,
  	borderWidth: 2,
  	borderColor: "black", 
  	marginBottom: 70
  },
 	popoverPop: {
	    height: "100%", 
	    width: "100%", 
	    backgroundColor: "white", 
	    flex: 1, 
	    flexDirection: 'row', 
	    justifyContent: 'space-between', 
	    paddingTop: 10, 
	    paddingBottom: 10
    },
	backgroundBlack: {
		backgroundColor: "black"
	},
	backgroundWhite: {	
		backgroundColor: "white"
	},
	modalView: {
		flex: 1, 
		backgroundColor: "white", 
		width: width * 0.90, 
		height: height, 
		justifyContent: "center", 
		alignItems: "center", 
		alignContent: "center"
	},
	closeBtn: {
		width: width - 75, 
		backgroundColor: "#613DC1", 
		marginTop: 50, 
		justifyContent: "center", 
		alignItems: "center", 
		alignContent: "center"
	},
	modalViewDark: {
		flex: 1, 
		backgroundColor: "black", 
		width: width * 0.90, 
		height: height, 
		justifyContent: "center", 
		alignItems: "center", 
		alignContent: "center"
	},
  container: {
    backgroundColor: "white"
  },
  containerDark: {
	backgroundColor: "black",
	flex: 1,
    marginVertical: 20,
  },
  row:{
    flexDirection:'row'
  },
  imageContent:{
    borderWidth:1,
    borderColor:'black',
    height:120, 
  },
  imageContent1:{
    width:'100%',
    height: 350
  },
  submitBtn: {
	justifyContent: "center", 
	alignItems: "center", 
	alignContent: "center",
	width: width,
	backgroundColor: "#613DC1"
  },
  imageContentDark: {
  	backgroundColor: "black",
    borderWidth:1,
    borderColor:'black',
    height:120
  },
  imageContent2:{
    width:'50%',
  },
  imageContent3:{
    width:'33.33%',
  },
  image:{
    width:'100%',
    height:'100%'
  },
  //overlay efect
  overlayContent: {
    flex: 1,
    position: 'absolute',
    zIndex: 100,
    right: 0,
    width:'100%',
    height:'100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent:'center',
    alignItems:'center'
  },
  overlayContentDark: {
    flex: 1,
    position: 'absolute',
    zIndex: 100,
    right: 0,
    width:'100%',
    height:'100%',
    backgroundColor: 'black',
    justifyContent:'center',
    alignItems:'center' 	
  },
  count:{
    fontSize:50,
    color: "#ffffff",
    fontWeight:'bold',
    textShadowColor: 'rgba(0, 0, 139, 1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
});
const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username,
		dark_mode: state.mode.dark_mode
	}
}
export default connect(mapStateToProps, {  })(ProfileIndividual);