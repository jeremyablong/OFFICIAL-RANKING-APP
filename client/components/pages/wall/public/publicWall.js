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
import { Container, Header, Thumbnail, Left, Body, Right, Card, CardItem, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import { connect } from "react-redux";
import SlidingUpPanel from 'rn-sliding-up-panel';
import PhotoUpload from 'react-native-photo-upload';
import axios from "axios";
import LoadingWall from "../loading.js";
import FriendsListSubComponent from "../../../friends/friendList.js";
import PostToWallSubComponent from "../../../wall/postToWall.js";
import NavigationDrawer from "../../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import ProgressiveImage from "../../../image/image.js";
import Modal from 'react-native-modal';
   
 

const { width, height } = Dimensions.get("window");
 
const URL = "http://recovery-social-media.ngrok.io";
 
class PublicWall extends React.Component {
constructor(props) {
  super(props);

  this.state = {
	avatar: null,
	cover: null,
	user: null,
	ready: false,
	isOpen: false,   
	posts: [],
	countFrom: 5,
    conditionalRender: false,
	modalImageValue: null,
	showModal: false,
	playing: false
  };  
    
  
} 
	componentDidMount() {

		axios.post(`${URL}/get/user/by/username`, {
          username: this.props.username
        }).then((res) => {
          console.log("UUU :", res.data);
          if (res.data.message === "FOUND user!") {
          	this.setState({
          		user: res.data.user
          	});  
			for (var i = 0; i < res.data.user.wall.length; i++) {
          		let post = res.data.user.wall[i];
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
        });         
	}  
	// start = async () => {
	// 	console.log("pressed...");
	// 	if (TrackPlayer) {
	// 		this.setState({
	// 			playing: !this.state.playing
	// 		}, async () => {
	// 			if (this.state.playing === true) {
	// 				// Set up the player
	// 			    await TrackPlayer.setupPlayer();

	// 			    // Add a track to the queue
	// 			    await TrackPlayer.add({
	// 			        id: 'trackId',
	// 			        url: require("../../../../assets/music/tom.mp3"),
	// 			        title: 'Track Title',
	// 			        artist: 'Track Artist'
	// 			    });

	// 			    // Start playing it
	// 			    await TrackPlayer.play();
	// 			} else {
	// 				TrackPlayer.stop();
	// 			}
	// 		})
	// 	}
	// };
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
	componentDidUpdate(prevProps, prevState) {
		if (prevState.cover !== this.state.cover) {
			axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
	          username: this.props.username
	        }).then((res) => {
	          console.log(res.data);
	          if (res.data.message === "FOUND user!") {
	          	this.setState({
	          		user: res.data.user
	          	})
	          }
	        }).catch((err) => {  
	          console.log(err);
	        })  
		}
	} 
	handleRerender = () => {
		axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
          username: this.props.username
        }).then((res) => {
          console.log(res.data);
          if (res.data.message === "FOUND user!") {
          	this.setState({ 
          		user: res.data.user,
          		ready: true
          	}) 
          }
        }).catch((err) => {
          console.log(err);
        })
	} 
	redirectUser = () => {
		this.props.navigation.navigate("profile-pic-view", { user: this.state.user });
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
	renderTwo = (images) => {
	    const { countFrom } = this.state;
	    const conditionalRender = [3, 4].includes(images.length) || images.length > +countFrom && [3, 4].includes(+countFrom);

	    return(
	      <View style={styles.row}>
	        <TouchableOpacity resizeMode={"contain"} style={[styles.imageContent, styles.imageContent2]} onPress={() => {
	        	if (conditionalRender) {
					this.viewImage(images[1]);
	        	} else {
	        		this.viewImage(images[0]);
	        	}
	        }}>
	          <ProgressiveImage style={styles.image} source={{uri: (conditionalRender) ? `https://s3.us-west-1.wasabisys.com/rating-people/${images[1]}` : `https://s3.us-west-1.wasabisys.com/rating-people/${images[0]}`}}/>
	        </TouchableOpacity>
	        <TouchableOpacity style={[styles.imageContent, styles.imageContent2]} onPress={() => {
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
	        <TouchableOpacity style={[styles.imageContent, styles.imageContent3]} onPress={() => {
	        	if (conditionalRender) {
					this.viewImage(images[1]);
	        	} else {
	        		this.viewImage(images[2]);
	        	}
	        	 
	        }}>
	          <ProgressiveImage style={styles.image} source={{uri: (conditionalRender) ? `https://s3.us-west-1.wasabisys.com/rating-people/${images[1]}` : `https://s3.us-west-1.wasabisys.com/rating-people/${images[2]}`}}/>
	        </TouchableOpacity>
	        <TouchableOpacity style={[styles.imageContent, styles.imageContent3]} onPress={() => {
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
	        <TouchableOpacity style={[styles.imageContent, styles.imageContent3]} onPress={() => {
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
	          <View style={styles.overlayContent}>
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
	renderContent = () => {
		if (this.state.ready === true) {
			return (
				<ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={styles.container}>
		          {this.state.ready ? <ImageBackground resizeMode='cover' source={{ uri: this.state.cover !== null ? `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.cover}` : `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.user.coverPhoto}` }} style={styles.header}><TouchableOpacity onPress={() => {
		          	console.log("clicked..");
		          	this._panel.show()
		          }}><Image style={{ position: "absolute", top: 10, left: 10, width: 40, height: 40, tintColor: "white" }} source={require("../../../../assets/icons/upload-two.png")}/></TouchableOpacity></ImageBackground> : <Fragment><View style={styles.header}></View></Fragment>}
		          <TouchableOpacity style={{ position: "absolute", right: 10, top: 10 }} onPress={() => {
		              	this.props.navigation.navigate("profile-music-playlist", { user: this.state.user });
		              }}><Image source={require("../../../../assets/icons/multi.png")} style={this.props.dark_mode ? styles.goToMusicPlaylistDark : styles.goToMusicPlaylistLight} /></TouchableOpacity>
		          <TouchableOpacity style={styles.avatar} onPress={this.redirectUser}>
					 <Image style={{ width: 130,
					    height: 130,
					    borderRadius: 63,
					    marginTop: -4,
					    marginLeft: -4,
					    borderWidth: 4, 
					    zIndex: 999,
					    borderColor: "white",
					    paddingRight: 10 }} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.user.profilePic[this.state.user.profilePic.length - 1].picture}` }}/>
				  </TouchableOpacity>
		          <View style={this.props.dark_mode ? styles.bodyDark : styles.body}>
		            <View style={styles.bodyContent}>
		              {this.state.user.username === this.props.username ? <TouchableOpacity onPress={() => {
		              	this.props.navigation.navigate("upload-profile-picture", { publicProfile: true });
		              }} style={{ right: 15, top: 5, position: "absolute" }}><Image style={this.props.dark_mode ? { width: 50, height: 50, tintColor: "white" } : { width: 50, height: 50 }} source={require("../../../../assets/icons/ar-camera.png")}/></TouchableOpacity> : null}
		              <TouchableOpacity style={{ position: "absolute", left: 10, top: 10 }} onPress={() => {
		              	this.start();
		              }}><Image source={require("../../../../assets/icons/music.png")} style={this.props.dark_mode ? styles.darkMusicIcon : styles.lightMusicIcon} /></TouchableOpacity>
		              
		              <Text style={this.props.dark_mode ? styles.nameDark : styles.name}>{this.state.user !== null ? this.state.user.fullName : "--"}</Text>
		              <Text style={styles.ranking}><Text style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Social Ranking:</Text>834</Text>
		              <Text style={styles.info}>{this.state.user ? this.state.user.username : "--"}</Text>
		              <Text style={this.props.dark_mode ? styles.descriptionDark : styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
		              <View style={styles.customContainer}>
					      <NativeButton style={{ width: width * 0.45, backgroundColor: "#4E148C" }} onPress={() => {
							// do something
					      }}><Image style={styles.specialBtn} source={require("../../../../assets/icons/math.png")}/><NativeText style={{ color: "white" }}>Add Story</NativeText></NativeButton>
					     <NativeButton style={{ width: width * 0.20, backgroundColor: "transparent" }} onPress={() => {
							this.props.navigation.navigate("profile-settings-list", { user: this.state.user });
					      }}><Image style={styles.specialBtnTwo} source={require("../../../../assets/icons/more.png")}/></NativeButton>
					      <NativeButton style={{ width: width * 0.10, backgroundColor: "transparent" }} onPress={() => {
							this.props.navigation.navigate("view-instagram-style-images", { user: null });
			   		      }}><Image style={styles.specialBtnThree} source={require("../../../../assets/icons/content.png")}/></NativeButton>
					    </View> 
		            </View>   
		            <FriendsListSubComponent navigation={this.props.navigation} user={this.state.user} />
   
		            <PostToWallSubComponent navigation={this.props.navigation}  />

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
							      
					            </CardItem>
					            <CardItem style={this.props.dark_mode ? { backgroundColor: "black", paddingTop: 15, paddingBottom: 10 } : { backgroundColor: "white", paddingTop: 15, paddingBottom: 10 }}>
									<Text style={{ textAlign: "left", position: "absolute", left: 6, bottom: 10 }}>😂😍😁</Text>
									<Text style={this.props.dark_mode ? { textAlign: "right", position: "absolute", right: 6, bottom: 10, color: "white" } : { textAlign: "right", position: "absolute", color: "black", right: 6, bottom: 10 }}>{Math.floor(Math.random() * (33 - 0 + 1)) + 0} Comments - {Math.floor(Math.random() * (9 - 0 + 1)) + 0} Shares</Text>
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
			);
		} else {
			return (
				<View style={this.props.dark_mode ? { backgroundColor: "black", height: height } : { backgroundColor: "white", height: height }}>
					<TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}>
						<NativeButton onPress={() => {
							this.handleRerender(); 
							console.log("clicked.");
						}} style={styles.load}>
							<NativeText style={{ color: "black" }}>Load Page...</NativeText>
						</NativeButton>
					</TouchableOpacity>
					<View> 
						<LoadingWall /> 
					</View>
				</View>
			);
		}
	}
	render() {
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		console.log(this.state);
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }}>
		          <Left>
		            <NativeButton onPress={() => {
		             	// redirect
		             	this.props.navigation.navigate("dashboard")
		            }} hasText transparent>
		              <Image style={this.props.dark_mode ? { width: 35, height: 35, marginBottom: 10, tintColor: "white" } : { width: 35, height: 35, marginBottom: 10 }} source={require("../../../../assets/icons/construction.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title style={this.props.dark_mode ? { color: "white" } : { color: "black" }}>Public Wall</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked user interface...");
		                 {/*this.props.navigation.navigate("chat-users");*/}
					    this.setState({
					    	isOpen: true
					    })
		            }} hasText transparent>
		              <Image style={this.props.dark_mode ? { width: 45, height: 45, marginBottom: 10, tintColor: "white" } : { width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/user-interface.png")}/>
		            </NativeButton>
		          </Right>
		        </Header>
		        {this.renderContent()}
		      		<SlidingUpPanel ref={c => this._panel = c}>
			          <View style={styles.slide}>
			            <PhotoUpload
						   onPhotoSelect={avatar => {
						     if (avatar) {
						       this.setState({
						       	avatar
						       })
						     }
						   }}
						 >
						   <Image
						     style={this.state.avatar ? styles.picNoTint : styles.picTint}
						     resizeMode='cover'
						     source={require("../../../../assets/icons/user.png")}
						   />
						 </PhotoUpload>
						 <View style={{ top: -150 }}>
							<NativeButton style={{ backgroundColor: "black" }} onPress={this.uploadCoverPhoto}>
								<NativeText style={{ color: "white" }}>Submit Cover Photo</NativeText>
							 </NativeButton>
							 <NativeButton style={{ justifyContent: "center", alignItems: "center", alignContent: "center", backgroundColor: "#613DC1", marginTop: 50 }} onPress={() => {
							 	this._panel.hide();
							 }}><NativeText style={{ color: "white" }}>Close Screen</NativeText>
							 </NativeButton>
						 </View>
			             
			          </View>
			        </SlidingUpPanel>
			{this.renderModal()}
			<View style={{ position: "absolute", bottom: 0, width: width }}>
				<Footer style={this.props.dark_mode ? { backgroundColor: "black" } : {  }}>
			          <FooterTab>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("dashboard");
				            }}>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/home-run.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("notifications");
				            }}>
				            <Badge style={{ marginBottom: -15, marginLeft: 5 }}><NativeText>3</NativeText></Badge>
			               <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/notification.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("chat-users");
				            }}>
				          <Badge style={{ marginBottom: -10 }}><NativeText>51</NativeText></Badge>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/mail-three.png")} />
			            </NativeButton>
			            <NativeButton active onPress={() => {
				            	this.props.navigation.navigate("public-wall");
				            }}>
			              <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "black" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/wall.png")} />
			            </NativeButton>
		              <NativeButton onPress={() => {
		                  this.props.navigation.navigate("profile-settings");
		                }}>
		                <Image style={this.props.dark_mode ? { width: 35, height: 35, tintColor: "white" } : { width: 35, height: 35 }} source={require("../../../../assets/icons/list.png")} />
		              </NativeButton>
			          </FooterTab>
			        </Footer>
			</View>
			</SideMenu>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	darkText: {
		color: "white"
	},
	lightText: {
		color: "black"
	},
	backDark: {
		backgroundColor: "black",
		flex: 1,  
		width: width * 0.90, 
		height: height, 
		justifyContent: "center", 
		alignItems: "center", 
		alignContent: "center"
	},
	backLight: {
		flex: 1, 
		backgroundColor: "white", 
		width: width * 0.90, 
		height: height, 
		justifyContent: "center", 
		alignItems: "center", 
		alignContent: "center"
	},
	goToMusicPlaylistDark: {
		position: "absolute",
		right: 10,
		top: 10,
		tintColor: "white",
		width: 40, 
		height: 40
	},
	goToMusicPlaylistLight: {
		position: "absolute",
		right: 10,
		top: 10,
		tintColor: "black",
		width: 40, 
		height: 40		
	},
	darkMusicIcon: {
		tintColor: "white", 
		width: 40, 
		height: 40, 
		position: "absolute", 
		left: 10, 
		top: 10
	},
	lightMusicIcon: {
		tintColor: "black", 
		width: 40, 
		height: 40, 
		position: "absolute", 
		left: 10, 
		top: 10
	},
	descriptionDark: {
		color: "lightgrey"
	},
  load: {
  	width: width * 0.80, 
  	justifyContent: "center", 
  	alignItems: "center", 
  	top: 40, 
  	borderWidth: 3, 
  	borderColor: "black", 
  	backgroundColor: "#97DFFC"
  },
  picTint: {
   paddingVertical: 30,
   width: 150,
   height: 150,
   borderRadius: 75,
   tintColor: "#613DC1"
  },
  picNoTint: {
   paddingVertical: 30,
   width: 150,
   height: 150,
   borderRadius: 75
  },
  slide: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
	backgroundColor: "white"
  },
  customContainer: {
  	marginTop: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  header:{
    backgroundColor: "#613DC1",
    height:200,
  },
  specialBtn: {
  	width: 45, 
  	height: 45, 
  	marginTop: 10, 
  	marginLeft: 20, 
  	marginBottom: 10
  },
  specialBtnTwo: {
	height: 45,
	width: 45,
	marginLeft: 20
  },
  specialBtnThree: {
	width: 50, 
	height: 50
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
    marginTop:130,
    zIndex: 999
  },
  name:{
    fontSize:22,
    color:"black",
    fontWeight:'600',
    marginTop: 20
  },
  nameDark:{
    fontSize:22,
    color:"white",
    fontWeight:'600',
    marginTop: 40
  },
  ranking: {
    fontSize:30,
    color:"darkred",
    fontWeight:'600',
    textDecorationLine: "underline"
  },
  body:{
    marginTop: 20,
  },
  bodyDark: {
	backgroundColor: "black"
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:50,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
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
  imageContent2:{
    width:'50%',
  },
  imageContent3:{
    width:'33.33%',
  },
  image:{
    width:'100%',
    height:'100%',
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
  count:{
    fontSize:50,
    color: "#ffffff",
    fontWeight:'bold',
    textShadowColor: 'rgba(0, 0, 139, 1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
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
	modalViewDark: {
		flex: 1, 
		backgroundColor: "black", 
		width: width * 0.90, 
		height: height, 
		justifyContent: "center", 
		alignItems: "center", 
		alignContent: "center",
		borderWidth: 3,
		borderColor: "white"
	},
	closeBtn: {
		width: width - 75, 
		backgroundColor: "#613DC1", 
		marginTop: 50, 
		justifyContent: "center", 
		alignItems: "center", 
		alignContent: "center"
	},

});
const mapStateToProps = state => {
	return {
		profilePic: state.auth.authenticated.profilePic,
		username: state.auth.authenticated.username,
		dark_mode: state.mode.dark_mode
	}
}

export default connect(mapStateToProps, {  })(PublicWall);