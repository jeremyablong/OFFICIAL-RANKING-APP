import React, { Component, Fragment } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity, 
  Image,
  ImageBackground, 
  Dimensions, 
  ScrollView, 
  FlatList, 
  Keyboard
} from 'react-native';
import { Header, Left, CardItem, Card, Body, Right, Thumbnail, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab } from 'native-base';
import NavigationDrawer from "../../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import GallerySwiper from "react-native-gallery-swiper";
import RBSheet from "react-native-raw-bottom-sheet";
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import PhotoUpload from 'react-native-photo-upload';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from "axios";
import { connect } from "react-redux";
import ProgressiveImage from "../../../image/image.js";
import Popover from 'react-native-popover-view';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const URL = "http://recovery-social-media.ngrok.io";

const { width, height } = Dimensions.get("window");

class IndividualWallPosting extends Component {
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
	    avatar: require("../../../../assets/icons/hobbies.png"),
	    typing: false,
	    response: "",
	    replies: [],
	    showPopover: false,
	    modalImageValue: null,
	    showModal: false,
	    countFrom: 5,
	    isLoading: true
    }
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
		return <Text style={this.props.dark_mode ? { textAlign: "left", color: "white", position: "absolute", left: 6, bottom: 0, top: 40 } : { textAlign: "left", position: "absolute", left: 6, bottom: 0, top: 40 }}>{emojis}</Text>;
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
	renderContent = () => {
		const post = this.props.route.params.post; 

		if (post.images) {
			switch (post.images.length) {
				case 1:
					return (
						<Card style={styles.shadow}>
				            <CardItem>
				              <Left>
				                <Thumbnail source={{uri: post.picture }} />
				                <Body>
				                  <NativeText>{post.author}</NativeText>
				                  <NativeText note>{post.date}</NativeText>
				                </Body>
				              </Left>
				            </CardItem>
				            {post.text ? <CardItem>
				              <Body>
				                <Image source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[0]}` }} style={{height: height * 0.45, width: width * 0.90, flex: 1}}/>
				                <NativeText style={{ paddingTop: 10 }}>
				                  {post.text}
				                </NativeText>

				                
				              </Body>
				            </CardItem> : null}

				            <CardItem>
								{this.renderEmojisReturn(post.reactions)}
				            </CardItem>
				            
				            <CardItem>
								<Footer style={styles.footer}>
						          <FooterTab>
						          <Popover
						                onRequestClose={() => {
						                	this.setState({
						                		showPopover: false
						                	})
						                }}
								        isVisible={this.state.showPopover}
									      from={(sourceRef, showPopover) => (
									        <NativeButton onPress={() => {
									        	this.setState({
									        		showPopover: !this.state.showPopover
									        	})
									        }}>
								              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
								            </NativeButton>
									      )}>
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
							    </Popover>
						            <NativeButton onPress={() => {
						            	this.RBSheet.open();
						            }}>
						              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
						            </NativeButton>
						            <NativeButton active>
						              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
						            </NativeButton>
						          </FooterTab>
						        </Footer>
				            </CardItem>
				          </Card>
					);
					break;
				case 2:
					return (
						<Card style={styles.shadow}> 
				            <CardItem>
				              <Left>
				                <Thumbnail source={{uri: post.picture }} />
				                <Body>
				                  <NativeText>{post.author}</NativeText>
				                  <NativeText note>{post.date}</NativeText>
				                </Body>
				              </Left> 
				            </CardItem>
				            <CardItem>
				              <Body>
				              <Text style={styles.specialSwipe}>Swipe to view all photos...</Text>
				               <GallerySwiper  
				               		resizeMode={"contain"}
				               		style={{ maxHeight: height * 0.60 }}
						            images={[
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[0]}` },
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[1]}` }
						            ]}
						            onEndReached={() => {
										
						            }}
						        />
						        {post.text ? <NativeText style={{ paddingTop: 20 }}>
				                  {post.text}
				                </NativeText> : null}

				                
				              </Body>
				            </CardItem>
				            <CardItem>
								{this.renderEmojisReturn(post.reactions)}
				            </CardItem>
				            <CardItem>
								<Footer style={styles.footer}>
						          <FooterTab>
						            <Popover
						            	onRequestClose={() => {
						                	this.setState({
						                		showPopover: false
						                	})
						                }}
								        isVisible={this.state.showPopover}
									      from={(sourceRef, showPopover) => (
									        <NativeButton onPress={() => {
									        	this.setState({
									        		showPopover: !this.state.showPopover
									        	})
									        }}>
								              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
								            </NativeButton>
									      )}>
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
								    </Popover>
						            <NativeButton onPress={() => {
						            	this.RBSheet.open();
						            }}>
						              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
						            </NativeButton>
						            <NativeButton active>
						              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
						            </NativeButton>
						          </FooterTab>
						        </Footer>
				            </CardItem>
				          </Card>
					);
					break;
				case 3:
					return (
						<Card style={styles.shadow}>
				            <CardItem>
				              <Left>
				                <Thumbnail source={{uri: post.picture }} />
				                <Body>
				                  <NativeText>{post.author}</NativeText>
				                  <NativeText note>{post.date}</NativeText>
				                </Body>
				              </Left>
				            </CardItem>
				            <CardItem>
				              <Body>
				              <Text style={styles.specialSwipe}>Swipe to view all photos...</Text>
				               <GallerySwiper  
				               		resizeMode={"contain"}
				               		style={{ maxHeight: height * 0.60 }}
						            images={[
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[0]}` },
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[1]}` },
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[2]}` }
						            ]}
						            onEndReached={() => {
										
						            }}
						        />
						        {post.text ? <NativeText style={{ paddingTop: 20 }}>
				                  {post.text}
				                </NativeText> : null}

				                
				              </Body>
				            </CardItem>
				            <CardItem>
								{this.renderEmojisReturn(post.reactions)}
				            </CardItem>
				            <CardItem>
								<Footer style={styles.footer}>
						          <FooterTab>
						            <Popover
						            	onRequestClose={() => {
						                	this.setState({
						                		showPopover: false
						                	})
						                }}
								        isVisible={this.state.showPopover}
									      from={(sourceRef, showPopover) => (
									        <NativeButton onPress={() => {
									        	this.setState({
									        		showPopover: !this.state.showPopover
									        	})
									        }}>
								              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
								            </NativeButton>
									      )}>
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
								    </Popover>
						            <NativeButton onPress={() => {
						            	this.RBSheet.open();
						            }}>
						              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
						            </NativeButton>
						            <NativeButton active>
						              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
						            </NativeButton>
						          </FooterTab>
						        </Footer>
				            </CardItem>
				          </Card>
					);
					break;
				case 4:
					return (
						<Card style={styles.shadow}>
				            <CardItem>
				              <Left>
				                <Thumbnail source={{uri: post.picture }} />
				                <Body>
				                  <NativeText>{post.author}</NativeText>
				                  <NativeText note>{post.date}</NativeText>
				                </Body>
				              </Left>
				            </CardItem>
				            <CardItem>
				              <Body>
				              <Text style={styles.specialSwipe}>Swipe to view all photos...</Text>
				               <GallerySwiper  
				               		resizeMode={"contain"}
				               		style={{ maxHeight: height * 0.60 }}
						            images={[
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[0]}` },
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[1]}` },
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[2]}` },
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[3]}` }
						            ]}
						            onEndReached={() => {
										
						            }}
						        />
						        {post.text ? <NativeText style={{ paddingTop: 20 }}>
				                  {post.text}
				                </NativeText> : null}

				                
				              </Body>
				            </CardItem>
				            <CardItem>
								{this.renderEmojisReturn(post.reactions)}
				            </CardItem>
				            <CardItem>
								<Footer style={styles.footer}>
						          <FooterTab>
						           <Popover
						           		onRequestClose={() => {
						                	this.setState({
						                		showPopover: false
						                	})
						                }}
								        isVisible={this.state.showPopover}
									      from={(sourceRef, showPopover) => (
									        <NativeButton onPress={() => {
									        	this.setState({
									        		showPopover: !this.state.showPopover
									        	})
									        }}>
								              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
								            </NativeButton>
									      )}>
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
								    </Popover>
						            <NativeButton onPress={() => {
						            	this.RBSheet.open();
						            }}>
						              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
						            </NativeButton>
						            <NativeButton active>
						              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
						            </NativeButton>
						          </FooterTab>
						        </Footer>
				            </CardItem>
				          </Card>
					);
					break;
				case 5:
					return (
						<Card style={styles.shadow}>
				            <CardItem>
				              <Left>
				                <Thumbnail source={{uri: post.picture }} />
				                <Body>
				                  <NativeText>{post.author}</NativeText>
				                  <NativeText note>{post.date}</NativeText>
				                </Body>
				              </Left>
				            </CardItem>
				            <CardItem>
				              <Body>
				              <Text style={styles.specialSwipe}>Swipe to view all photos...</Text>
				               <GallerySwiper  
				               		resizeMode={"contain"}
				               		style={{ maxHeight: height * 0.60 }}
						            images={[
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[0]}` },
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[1]}` },
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[2]}` },
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[3]}` },
						                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[4]}` }
						            ]}
						            onEndReached={() => {
										
						            }}
						        />
						        {post.text ? <NativeText style={{ paddingTop: 20 }}>
				                  {post.text}
				                </NativeText> : null}

				                
				              </Body>
				            </CardItem>
				            <CardItem>
								{this.renderEmojisReturn(post.reactions)}
				            </CardItem>
				            <CardItem>
								<Footer style={styles.footer}>
						          <FooterTab>
						            <Popover
						            	onRequestClose={() => {
						                	this.setState({
						                		showPopover: false
						                	})
						                }}
								        isVisible={this.state.showPopover}
									      from={(sourceRef, showPopover) => (
									        <NativeButton onPress={() => {
									        	this.setState({
									        		showPopover: !this.state.showPopover
									        	})
									        }}>
								              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
								            </NativeButton>
									      )}>
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
							    	</Popover>
						            <NativeButton onPress={() => {
						            	this.RBSheet.open();
						            }}>
						              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
						            </NativeButton>
						            <NativeButton active>
						              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
						            </NativeButton>
						          </FooterTab>
						        </Footer>
				            </CardItem>
				          </Card>
					);
					break;
				default:
					return null;
					break;
			}
		} else {
			return (
			  <Card style={styles.shadow}>
	            <CardItem>
	              <Left>
	                <Thumbnail source={{uri: post.picture }} />
	                <Body>
	                  <NativeText>{post.author}</NativeText>
	                  <NativeText note>{post.date}</NativeText>
	                </Body>
	              </Left>
	            </CardItem>
	            {post.text ? <CardItem>
	              <Body>
	                
	                <NativeText style={{ paddingTop: 10 }}>
	                  {post.text}
	                </NativeText>
	              </Body>
	            </CardItem> : null}
        		{post.original ? <Fragment><Card style={{flex: 0, width: width * 0.92, minHeight: 400, marginBottom: 35, borderWidth: 3, marginLeft: 15, borderColor: "#4E148C" }}>
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


					{post.videoID ? <View style={{ marginLeft: 20 }}><Video 
			      	   paused={true} 
			      	   ignoreSilentSwitch={"ignore"} 
			      	   muted={false} 
			      	   resizeMode={"cover"} 
			      	   controls={true} 
			      	   source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.videoID}` }} 
				       ref={(ref) => {
				         this.player = ref
				       }}                                  
				       onBuffer={this.onBuffer}            
				       onError={this.videoError}          
				       style={styles.backgroundVideo} /></View> : null}
	            <CardItem>
					<Footer style={styles.footer}>
			          <FooterTab>
			            <Popover 
			              onRequestClose={() => {
			                	this.setState({
			                		showPopover: false
			                	})
			              }}
			              isVisible={this.state.showPopover}
					      from={(sourceRef, showPopover) => (
					        <NativeButton onPress={() => {
					        	this.setState({
					        		showPopover: !this.state.showPopover
					        	})
					        }}>
				              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
				            </NativeButton>
					      )}>
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
					    </Popover>
			            <NativeButton onPress={() => {
			            	this.RBSheet.open();
			            }}>
			              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
			            </NativeButton>
			            <NativeButton>
			              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
			            </NativeButton>
			          </FooterTab>
			        </Footer>
	            </CardItem>
	          </Card>
			);
		}
	} 
	renderEmojiResponseSender = (message) => {
	    console.log("messageeeeeeeee", message);
	    if (message.reactions !== undefined) {
	      console.log("mess :", message.reactions);
	      for (const [key, value] of Object.entries(message.reactions)) {
	        console.log(key, value);
	        if (value > 0) {
	          console.log("MATCHHHHHHH", key);
	          switch (key) {
	            case "laugh":
	              console.log("laugh");
	              return <Text style={styles.emojiResponseSender}> 😆 </Text>
	            case "heartFace":
	              console.log("heartFace");
	              return <Text style={styles.emojiResponseSender}> 😍 </Text>
	            case "frustrated":
	              console.log("frustrated");
	              return <Text style={styles.emojiResponseSender}> 😤 </Text>
	            case "heart":
	              console.log("heart");
	              return <Text style={styles.emojiResponseSender}> ❤️ </Text>
	            case "angry":
	              console.log("angry");
	              return <Text style={styles.emojiResponseSender}> 🤬 </Text>
	            case "sad":
	              console.log("sad");
	              return <Text style={styles.emojiResponseSender}> 😥 </Text>
	            case "puke":
	              console.log("puke");
	              return <Text style={styles.emojiResponseSender}> 🤮 </Text>
	            default:
	              console.log("none match :( - uh oh...");
	          }
	        }
	      }
	    }
	  }
	_handleSubmit = () => {
		const { response, avatar } = this.state;

		const post = this.props.route.params.post;

		if (response.length > 0 && avatar !== require("../../../../assets/icons/hobbies.png")) {
			console.log("avatar EXISTS.");
			axios.post(`${URL}/post/comment/general/wall`, {
				avatar,
				message: response,
				id: post.id,
				author: post.author,
				poster: this.props.username
			}).then((res) => {
				if (res.data.message === "Successfully posted comment to posting!") {
					console.log(res.data);
					axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
						username: this.props.username
					}).then((resolutionnnn) => {

						console.log("resolution :", resolutionnnn.data);

						const picture = resolutionnnn.data.user.profilePic[resolutionnnn.data.user.profilePic.length - 1].picture;
						// append picture to object
						const finale = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

						this.setState({
							response: "",
							replies: [ { 
								message: res.data.added.message,
								id: res.data.added.id,
								date: res.data.added.date,
								author: res.data.added.author,
								profilePhoto: finale,
								picture: res.data.added.picture
							}, ...this.state.replies]
						}, () => {
							this.RBSheet.close();
						})
					}).catch((err) => {
						console.log("FAILURE :", err);
					})
				}
			}).catch((err) => {
				console.log(err);
			})
		} else if (response.length > 0 && avatar === require("../../../../assets/icons/hobbies.png")) {
			console.log("Avatar DOESN'T exist.");
			axios.post(`${URL}/post/comment/general/wall`, {
				message: response,
				id: post.id,
				author: post.author,
				poster: this.props.username
			}).then((res) => {
				if (res.data.message === "Successfully posted comment to posting!") {
					console.log(res.data);
					axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
						username: this.props.username
					}).then((resolutionnnn) => {

						console.log("resolution :", resolutionnnn.data);

						const picture = resolutionnnn.data.user.profilePic[resolutionnnn.data.user.profilePic.length - 1].picture;
						// append picture to object
						const finale = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

						this.setState({
							response: "",
							replies: [ { 
								message: res.data.added.message,
								id: res.data.added.id,
								date: res.data.added.date,
								author: res.data.added.author,
								profilePhoto: finale
							}, ...this.state.replies]
						}, () => {
							this.RBSheet.close();
						})
					}).catch((err) => {
						console.log("FAILURE :", err);
					})
					
				}
			}).catch((err) => {
				console.log(err);
			})
		}
	}
	componentDidMount() {
		const post = this.props.route.params.post;

	    axios.post(`${URL}/gather/general/comments/feed`, {
	  		username: post.author,
	  		id: post.id
	    }).then((res) => {
	  		if (res.data.message === "Gathered comments!") {
	  			console.log(res.data);
  				
  				for (let i = 0; i < res.data.replies.length; i++) {

  					let reply = res.data.replies[i];

  					axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
						username: reply.author
					}).then((resolutionnnn) => {

						console.log("resolution :", resolutionnnn.data);

						const picture = resolutionnnn.data.user.profilePic[resolutionnnn.data.user.profilePic.length - 1].picture;
						// append picture to object
						reply["profilePhoto"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

						this.setState({
							replies: [...this.state.replies, reply]
						})
					}).catch((err) => {
						console.log("FAILURE :", err);
					})
  				}
  				this.setState({
  					isLoading: false
  				})
	  		}
	    }).catch((err) => {
	  		console.log(err);
	    })
	}
	render() {
		const post = this.props.route.params.post; 
		console.log("this.props", this.props.route.params.post);
		console.log("this.state", this.state);
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header>
				  <Left>
				    <NativeButton onPress={() => {
				      this.props.navigation.navigate("dashboard");
				    }} hasText transparent>
				      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/backkkk.png")}/>
				    </NativeButton>
				  </Left>
				  <Body>
				    <Title>Post</Title>
				  </Body>
				  <Right>
				    <NativeButton onPress={() => {
				    	console.log("clicked user interface...");
				         {/*this.props.navigation.navigate("chat-users");*/}
					    this.setState({
					    	isOpen: true
					    })
				    }} hasText transparent>
				      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/user-interface.png")}/>
				    </NativeButton>
				  </Right>
				</Header>
				<ScrollView showsVerticalScrollIndicator={false} style={{ width, height, backgroundColor: "white" }}>

					{this.state.isLoading === true ? <SkeletonPlaceholder>
				      <View style={{ flexDirection: "row", alignItems: "center", width, backgroundColor: "white" }}>
				        <View style={{ width: width * 0.95, height: 300, marginLeft: 10 }} />
				        <View style={{ marginLeft: 20 }}>
				          <View style={{ width: 120, height: 20, borderRadius: 4 }} />
				          <View
				            style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
				          />
				        </View>
				      </View>
				      <View style={{ paddingTop: 40, width, paddingLeft: 20, paddingBottom: 20, backgroundColor: "white", flexDirection: "row" }}>
						<View style={{ width: 70, height: 70, borderRadius: 60 }}>

				      	</View>
				      	<View style={{ width: width * 0.70, height: 40, marginLeft: 20, marginTop: 20 }}>

				      	</View>
				      </View>
				      <View style={{ backgroundColor: "white", height: 400 }}>
						<View style={{ width: width * 0.55, marginLeft: 15, height: 40, marginBottom: 20 }}>

				     	</View>
				     	<View style={{ width: width * 0.45, marginLeft: 15, height: 40, marginTop: 20 }}>

				     	</View>
				     	<View style={{ width: width * 0.85, marginLeft: 15, height: 40, marginTop: 20 }}>

				     	</View>
				      </View>
				    </SkeletonPlaceholder> : this.renderContent()}

					{this.renderModal()}

					{this.state.replies ? this.state.replies.map((reply, index) => {
						console.log("ITEMMMMMMMMM :", reply);
				          return(
				       		<Fragment>
					            <View key={index} style={styles.containerTwo}>
					              <TouchableOpacity onPress={() => {
									console.log("clicked...", reply);
					              }}>
					                <Image style={styles.imageTwo} source={{uri: reply.profilePhoto}}/>
					              </TouchableOpacity>
					              <View style={styles.content}>
					                <TouchableOpacity onPress={() => { 
					                	this.props.navigation.navigate("profile-individual", { user: { 
					                		username: reply.author 
					                	}})
					                }} style={styles.contentHeader}>
					                  <Text  style={styles.name}>{reply.author}</Text>
					                </TouchableOpacity>
					                <Text style={{ fontSize: 13, color: "grey", paddingBottom: 10 }}>
					                    {reply.date}
					                </Text>
					                <Text rkType='primary3 mediumLine'>{reply.message}</Text>
					               
					              </View>
					            
					            </View>
					            {reply.picture ? <View style={{ marginTop: 10, marginLeft: 100, marginRight: 45 }}>
									<ProgressiveImage source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${reply.picture}` }} style={{ width: "100%", height: 325 }} />
				                </View> : null}
			               </Fragment>
				          );
					}) : null}
					
				</ScrollView>
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
		        
		       <ScrollView contentContainerStyle={{ paddingTop: 100, paddingbottom: 100 }}>
		       <KeyboardAwareScrollView style={{ paddingBottom: 50 }}>
		       <TouchableOpacity onPress={() => {
    				this.RBSheet.close();
		        }} style={{ position: "relative", left: 10, top: 0, alignItems: 'flex-start' }}>
					<Image source={require("../../../../assets/icons/close-two.png")} style={{ width: 25, height: 25 }} /> 
		        </TouchableOpacity>
		        <View style={{ marginTop: 20, marginBottom: 50 }}>
		        <Text style={{ textAlign: "center", fontSize: 30, paddingBottom: 30, fontWeight: "bold" }}>Drop a comment...</Text>
					<PhotoUpload
					   onPhotoSelect={avatar => {
					     if (avatar) {
					       console.log('Image base64 string: ', avatar);
					       this.setState({
					       	avatar
					       })
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
					     source={this.state.avatar}
					   />
					 </PhotoUpload>
		        </View>
		          <View style={{ margin: 10 }}>
					<AutoGrowingTextInput value={this.state.response} onChangeText={(text) => {
						this.setState({
							response: text,
							typing: true
						})
					}} ref={(attach) => {
						this._textInput = attach
					}} style={styles.textInput} placeholderTextColor={"black"} placeholder={"Please consider posting kind and respectful comments... thank you! What's on your mind?"} />
		          </View>
		          <View>
					<NativeButton style={styles.submit} onPress={() => {
				      console.log("submitted comment...");
				      this._handleSubmit();
				    }} hasText>
				      <NativeText style={{ color: "white" }}> Accept & Post Response </NativeText>
				    </NativeButton>
		          </View>
		          </KeyboardAwareScrollView>
		          </ScrollView>
		        </RBSheet>
				</SideMenu>
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
	submit: {
		backgroundColor: "#613DC1",
		margin: 15,
		justifyContent: "center"
	},
	specialSwipe: {
		fontSize: 20, 
		fontWeight: "bold", 
		textAlign: "center",
		paddingBottom: 15
	},
	footer: {
		marginLeft: -20,
		width: width
	},
	icon: {
		width: 25, 
		height: 25
	},
	textInput: {
		borderColor: "black",
		borderWidth: 3,
		padding: 20,
		minWidth: width * 0.90
	},
	shadow: {
		flex: 0,
		shadowColor: "black",
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.00,

		elevation: 24
	},
  root: {
    backgroundColor: "#ffffff",
    marginTop:10,
  },
  containerTwo: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15
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
  imageTwo:{
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
	btnContainer: {
		position: "absolute", 
		bottom: 0, 
		justifyContent: "center", 
		alignItems: "center", 
		alignContent: "center"
	},
	backgroundVideo: {
		width: width * 0.90,
		height: 250,
		minHeight: 250, 
		minWidth: width * 0.90,
		marginBottom: 40
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
		username: state.auth.authenticated.username
	}
}

export default connect(mapStateToProps, {  })(IndividualWallPosting);