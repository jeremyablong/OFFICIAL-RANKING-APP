import React, { Fragment, Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert, 
  ImageBackground, 
  Dimensions, 
  TouchableOpacity
} from 'react-native';
import axios from "axios";
import { connect } from "react-redux";
import { Container, Header, Left, Body, Right, Button as NativeButton, Footer, FooterTab, Title, Text as NativeText, Card, CardItem, Thumbnail, List, ListItem, Content, Badge } from 'native-base';
import Carousel from 'react-native-snap-carousel';
import Modal from 'react-native-modal';
import ProgressiveImage from "../../image/image.js";
import Popover from 'react-native-popover-view';
import RBSheet from "react-native-raw-bottom-sheet";
import moment from "moment";
import uuid from "react-uuid";

const { width, height } = Dimensions.get("window");

const URL = "http://recovery-social-media.ngrok.io";

class HomePostsPage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	posts: [],
  	countFrom: 5,
    conditionalRender: false,
    ready: false,
    modalImageValue: null,
    showModal: false,
    showPopover: false,
    selected: null,
    alreadyLikedPost: false
  };
}

	componentDidMount() {
		axios.get("http://recovery-social-media.ngrok.io/gather/wall/posts/all").then((res) => {
          console.log("RES.Data :", res.data);
          if (res.data.message === "Successfully gather all wall postings...") {
          	for (var i = 0; i < res.data.wall.length; i++) {
          		let post = res.data.wall[i];
          		console.log("postieeee ", post);
          		axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
					username: post.author
				}).then((res) => {
					console.log("resolution :", res.data);
					const picture = res.data.user.profilePic[res.data.user.profilePic.length - 1].picture;
					// append picture to object
					post["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

					this.setState({
						posts: [post, ...this.state.posts]
					})
				}).catch((err) => {
					console.log("FAILURE :", err);
				})
          	}
          	this.setState({
          		ready: true
          	})
          }
        }).catch((err) => {
          console.log(err);
        })
	}	
	renderOne(images) {
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
	renderTwo(images) {
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

	renderThree(images) {
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

	renderOverlay(images) {
	    return(
	        <TouchableOpacity style={this.props.dark_mode ? [styles.imageContentDark, styles.imageContent3] : [styles.imageContent, styles.imageContent3]} onPress={() => {
	        	this.viewImage(images[images.length - 1]);
	        }}>
	          <ProgressiveImage style={styles.image} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${images[images.length - 1]}`}}/>
	        </TouchableOpacity>
	    );
	}

	renderCountOverlay(images) {
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
	          <View style={this.props.dark_mode ? styles.overlayContentDark : overlayContent}>
	            <View>
	              <Text style={styles.count}>+{extra}</Text>
	            </View>
	          </View>
	        </TouchableOpacity>
	    );
	}
	handleRedirect = (data) => {
		console.log("handle redirect occurred...", data);
		axios.post(`${URL}/get/user/by/username`, {
	  		username: data.author
	  	}).then((res) => {
	  		console.log(res.data);
	  		if (res.data.message === "FOUND user!") {
	  			this.props.navigation.navigate("profile-individual", { user: res.data.user });
	  		}
	  	}).catch((err) => {
	  		console.log(err);
	  	})
	}
	handleEmojiSubmission = (reaction) => {
		const { selected } = this.state;

		console.log("this.state.selected", selected);

		axios.post(`${URL}/react/emoji/main/wall/posts`, {
	  		poster: selected.author,
	  		reaction,
	  		id: selected.id,
	  		username: this.props.username
	  	}).then((res) => {
	  		console.log(res.data);
	  		if (res.data.message === "You've successfully liked this user's post!") {
	  			const { posts } = this.state;
	  			
				return posts.filter((x) => {
					if (x.id === this.state.selected.id) {
						console.log("x", x);
						x.likes.push({
							username: this.props.username,
							date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
							id: uuid(),
							reaction: reaction
						})
						this.setState({
							posts: this.state.posts
						}, () => {
							this.RBSheet.close(); 
						})
					};
				})
	  		}
	  	}).catch((err) => {
	  		console.log(err);
	  	})
	}
	takeBackLike = () => {
		console.log("TAKE BACK LIKE....");
	}
	renderResponseButton = (post) => {
		let count = 0;
		for (let i = 0; i < post.likes.length; i++) {
			let element = post.likes[i];
			if (element.username === this.props.username && count === 0) {
				count++
				return (
					<NativeButton onPress={() => {
			        	this.takeBackLike();
			        }} style={this.props.dark_mode ? { backgroundColor: "black", borderColor: "white", borderWidth: 2 } : { backgroundColor: "#858AE3", borderWidth: 3, borderColor: "lightgrey", margin: 3 }}>
		              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "white" }}>Un-Like</NativeText>
		            </NativeButton>
				);
			} 
		}
		if (post.likes.length === 0) {
			return (
				<NativeButton onPress={() => {
		        	this.setState({
		        		selected: post
		        	}, () => {
		        		this.RBSheet.open();
		        	})
		        	
		        }} style={this.props.dark_mode ? { backgroundColor: "black", borderColor: "white", borderWidth: 2 } : { backgroundColor: "white", borderWidth: 3, borderColor: "lightgrey", margin: 3 }}>
	              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Like</NativeText>
	            </NativeButton>
			);
		}
		return (
			<NativeButton onPress={() => {
	        	this.setState({
	        		selected: post
	        	}, () => {
	        		this.RBSheet.open();
	        	})
	        	
	        }} style={this.props.dark_mode ? { backgroundColor: "black", borderColor: "white", borderWidth: 2 } : { backgroundColor: "white", borderWidth: 3, borderColor: "lightgrey", margin: 3 }}>
              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Like</NativeText>
            </NativeButton>
		);
	}
	render() {
		return (
			<Fragment>
			<Content>
			{this.renderModal()}
				{this.state.posts && this.state.ready === true ? this.state.posts.map((post, index) => {
					console.log("post... :", post);
					return (
						<Card>
			            <CardItem style={this.props.dark_mode ? styles.backgroundBlack : styles.backgroundWhite}>
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
			            <CardItem cardBody style={this.props.dark_mode ? { flex: 1, backgroundColor: "black" } : { flex: 1 }}>
			              {post.text ?  <NativeText style={this.props.dark_mode ? { textAlign: "left", color: "white", paddingLeft: 20, paddingRight: 20 } : { textAlign: "left", color: "black", paddingLeft: 20, paddingRight: 20, marginBottom: 60 }}>{post.text}</NativeText> : null}
			            </CardItem>
			            <CardItem style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
							{post.images ? <View style={this.props.dark_mode ? styles.containerDark : styles.container}>
					          {[1, 3, 4].includes(post.images.length)  && this.renderOne(post.images)}
					          {post.images.length >= 2 && post.images.length != 4 && this.renderTwo(post.images)}
					          {post.images.length >= 4 && this.renderThree(post.images)}
					      </View> : null} 
					      
			            </CardItem>
			            <CardItem style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
							<TouchableOpacity onPress={() => {
								console.log("clicked.")
								this.props.navigation.navigate("wall-individual", { post });
							}}>
								<Text style={this.props.dark_mode ? { textAlign: "left", color: "white", position: "absolute", left: 6, bottom: 10 } : { textAlign: "left", position: "absolute", left: 6, bottom: 10 }}>😂😍😁</Text>
								<Text style={this.props.dark_mode ? { textAlign: "right", color: "white", position: "absolute", right: 6, bottom: 10 } : { textAlign: "right", position: "absolute", right: 6, bottom: 10 }}>{post.replies.length} Comments - {Math.floor(Math.random() * (9 - 0 + 1)) + 0} Shares</Text>
							</TouchableOpacity>
			            </CardItem>
			            <Footer style={{ width: width * 0.99 }}>  
				          <FooterTab>
					        {this.renderResponseButton(post)}
				            <NativeButton style={this.props.dark_mode ? { backgroundColor: "black", borderColor: "white", borderWidth: 2 } : { backgroundColor: "white", borderWidth: 3, borderColor: "lightgrey", margin: 3 }}>
				              <NativeText style={this.props.dark_mode ? { color: "white", marginLeft: 6 } : { color: "black" }}>Comment</NativeText>
				            </NativeButton>
				            <NativeButton style={this.props.dark_mode ? { backgroundColor: "black", borderColor: "white", borderWidth: 2 } : { backgroundColor: "white", borderWidth: 3, borderColor: "lightgrey", margin: 3 }}>
				              <NativeText style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Share</NativeText>
				            </NativeButton>
				          </FooterTab>
				        </Footer>
			            

			          </Card>
					);
				}) : null}
			<RBSheet
	          ref={ref => {
	            this.RBSheet = ref;
	          }}
	          height={height * 0.10}
	          openDuration={250}
	          customStyles={{
	            container: {
	              justifyContent: "center",
	              alignItems: "center"
	            }
	          }}
	        >
	          <View style={styles.popoverPop}> 
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
			      <TouchableOpacity style={{ left: -10 }} onPress={() => {
			        console.log("clicked...");
			        this.handleEmojiSubmission("puke");
			      }}><Text style={{ height: 50, width: 50, fontSize: 40 }}> 🤮</Text></TouchableOpacity>
			  </View>
	        </RBSheet>
			</Content>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
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
	slide: {
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
    flex: 1,
    marginVertical: 20,
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
  },
}); 
const mapStateToProps = state => {
	return {
		dark_mode: state.mode.dark_mode,
		username: state.auth.authenticated.username
	}
} 
export default connect(mapStateToProps, { })(HomePostsPage);