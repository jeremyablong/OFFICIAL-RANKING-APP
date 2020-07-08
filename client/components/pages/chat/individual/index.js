import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  Dimensions, 
  TouchableWithoutFeedback, 
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import Modal from 'react-native-modal';
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, Badge } from 'native-base';
import axios from "axios";
import io from "socket.io-client";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import uuid from "react-uuid";
const ENDPOINT = "http://recovery-social-media.ngrok.io";
import _ from "lodash";
import LoadingMessage from "../../../chat/loader.js";
import Popover from 'react-native-popover-view';
import RBSheet from "react-native-raw-bottom-sheet";

const { width, height } = Dimensions.get('window'); 

const socket = io('https://recovery-social-media.ngrok.io', {
	transport: ['websocket']
});




class MessageIndividual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      messages: [],
      user: null,
      ready: false,
      align: false,
      replies: null,
      reciever: null,
      first: null,
      updateChat: false,
      messageObj: null,
      customObject: null,
      special: null,
      newObj: false,
      repliesUpdated: false,
      last: null,
      sureUpdate: false,
      loading: false,
      refresh: false,
      modalIsVisible: false,
      showPopover: false,
      data: [
        {id:1,  name: "I'm being scammed...",   image: require("../../../../assets/icons/scam.png")},
        {id:2,  name: "They're being offensive...",    image: require("../../../../assets/icons/offensive.png")},
        {id:3,  name: "It's something else...",       image: require("../../../../assets/icons/change.png")}
      ],
      message: null
    };
  }
  componentDidMount() {
  	axios.post("http://recovery-social-media.ngrok.io/get/user/by/username/filter", {
  		username: this.props.username
  	}).then((res) => {
  		console.log("RESSSEEEE :", res.data);
  		if (res.data.message === "FOUND user!") {

  			const replies = [];

  			if (res.data.messages) {
	  				for (let i = 0; i < res.data.messages.length; i++) {
	  				let messages = res.data.messages[i].replies;
	  				if (messages) {
	  					for (let x = 0; x < messages.length; x++) {
		  					let message = messages[x];
		  					this.setState({
			  					ready: true,
								  user: res.data.user
			  				})
		  				}
	  				} else {
	  					this.setState({
		  					ready: true,
							  user: res.data.user
		  				})
	  				}

	  			}
	  		} else {
	  			this.setState({
  					ready: true,
					  user: res.data.user
  				})
	  		}
		  	axios.post("http://recovery-social-media.ngrok.io/get/individual/messages", {
		  		id: this.props.route.params.user.id
		  	}).then((res) => {
		  		if (res.data.message === "FOUND user!") {
					this.setState({
						messages: res.data.messages
					})
		  		}
		  	}).catch((err) => {
		  		console.log(err);
		  	});

			axios.post("http://recovery-social-media.ngrok.io/get/first/message/private", {
		  		id: this.props.route.params.user.id
		  	}).then((res) => {
		  		if (res.data.message === "FOUND user!") {
  					if (res.data.messages.replies) {
  						this.setState({
  							first: res.data.messages,
  							replies: res.data.messages.replies.reverse()
  						}, () => {
                const sender = this.state.first;
                axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
                  username: this.state.first.author === this.props.username ? this.state.first.reciever : this.state.first.author
                }).then((res) => {

                  console.log("resolution :", res.data);
                  const picture = res.data.user.profilePic[res.data.user.profilePic.length - 1].picture;
                  // append picture to object
                  sender["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

                  this.setState({
                    first: sender
                  })    
                }).catch((err) => {
                  console.log("FAILURE :", err);
                })
              })
  					} else {
  						this.setState({
  							first: res.data.messages,
  							replies: res.data.messages.replies
  						}, () => {
                const sender = this.state.first;
                axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
                  username: this.state.first.author === this.props.username ? this.state.first.reciever : this.state.first.author
                }).then((res) => {

                  console.log("resolution :", res.data);
                  const picture = res.data.user.profilePic[res.data.user.profilePic.length - 1].picture;
                  // append picture to object
                  sender["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

                  this.setState({
                    first: sender
                  })    
                }).catch((err) => {
                  console.log("FAILURE :", err);
                })
              })
  					}
		  		}
		  	}).catch((err) => {
		  		console.log(err);
		  	});
  		}
  	}).catch((err) => {
  		console.log(err);
  	});
  }
  send = () => {
  	console.log("send message...", this.state.msg);
  	if (this.props.route.params.user.author === this.props.username) {
  		axios.post("http://recovery-social-media.ngrok.io/post/replay/message/thread", {
	  		message: this.state.msg,
	  		sender: this.state.user.username,
	  		reciever: this.props.route.params.user.reciever,
	  		messageID: this.props.route.params.user.id
	  	}).then((res) => {
	  		console.log(res.data);
	  		if (res.data.messageCase === "Successfully updated both users!") {
				console.log("Successfully updated both users!");
				this.setState({
					align: false,
					repliesUpdated: true,
					last: null,
					refresh: true
				}, () => {
					Keyboard.dismiss();
				});

				const message = res.data.message;
				const author = res.data.author;
				const date = res.data.date;
				const id = res.data.id;

				socket.emit("messaged", {
					message,
					author,
					date,
					id,
					update: true
				});
	  		}
	  	}).catch((err) => {
	  		console.log(err);
	  	});
	  } else {
	  	axios.post("http://recovery-social-media.ngrok.io/post/replay/message/thread", {
	  		message: this.state.msg,
	  		sender: this.state.user.username,
	  		reciever: this.props.route.params.user.author,
	  		messageID: this.props.route.params.user.id
	  	}).then((res) => {
	  		console.log(res.data);
	  		if (res.data.messageCase === "Successfully updated both users!") {
				console.log("Successfully updated both users!");
				this.setState({
					align: false,
					repliesUpdated: true,
					last: null,
					refresh: true
				}, () => {
					Keyboard.dismiss();
					// alert("Message sent!");
				});

				const message = res.data.message;
				const author = res.data.author;
				const date = res.data.date;
				const id = res.data.id;


				socket.emit("messaged", {
					message,
					author,
					date,
					id,
					update: true
				});
	  		}
	  	}).catch((err) => {
	  		console.log(err);
	  	});
	  }
  	this.setState({
  		align: false,
  		msg: ""
  	})
  }

  renderSockets = () => {
  	socket.on("message", (message) => {
		if (message.update === true) {
			const customMessage = message.message;
			const author = message.author;
			const date = message.date;
			const id = message.id;

			const customObject = {
				message: customMessage,
				author, 
				date, 
				id
			}

			if (!this.state.last) {
				this.setState({
					last: customObject,
					sureUpdate: true
				})
			}
		}
	});
  }
  userExists = (element) => {
	  if (this.state.replies) {
	  	return this.state.replies.some((el) => {
	    	return el.message === element.message && el.date === element.date;
	    }); 
	  }
  }
  componentDidUpdate(prevProps, prevState) {
  	if (this.state.sureUpdate === true && this.state.last) {
		if (this.userExists(this.state.last)) {
			return null;
			console.log("MATCH")
		} else {
			console.log("DOESNT match.");
			if (!this.state.replies) {
				this.setState({
					replies: [ this.state.last],
					sureUpdate: false
				})
			} else {
				this.setState({
					replies: [ this.state.last, ...this.state.replies ],
					sureUpdate: false
				})
			}
		}
  	}
  }
  _onChange = (text) => {
  	this.setState({ msg: text })
  }
  handleProblemRedirect = () => {
  	console.log("handle redirect - problem.");
  }
  renderModalComponent = () => {
  	if (this.state.modalIsVisible === true) {
  		return (
			<Modal isVisible={true}>
	          <View style={{ flex: 1, width: width, height: height * 0.90, backgroundColor: "white", alignSelf: 'center', justifyContent:"center", alignItems: 'center'}}>
	           {this.state.data ? this.state.data.map((item, index) => {
	           	return (
					<TouchableOpacity style={styles.card} onPress={() => { 
						this.handleProblemRedirect(item) 
					}}>
		              <Image style={styles.image} source={item.image}/>
		              <View style={styles.cardContent}>
		                <Text style={styles.name}>{item.name}</Text>
		                <TouchableOpacity style={styles.followButton} onPress={() => {
		                	this.handleProblemRedirect(item);
		                }}>
		                  <Text style={styles.followButtonText}>Explore now</Text>  
		                </TouchableOpacity>
		              </View>
		            </TouchableOpacity>
	           	);
	           }) : null}
				<NativeButton style={styles.buttonCancel} onPress={() => {
					this.setState({
						modalIsVisible: false
					})
				}}><NativeText style={{ color: "white", fontSize: 23, fontWeight: "bold", marginLeft: width / 4 }}>Cancel</NativeText></NativeButton>
	          </View>
	        </Modal>
  		);
  	}
  }
  handleEmojiSubmission = (reaction) => {
    console.log("emoji clicked... :", reaction, this.state.message, this.props.route.params.user);
    axios.post("http://recovery-social-media.ngrok.io/reaction/individual/message", {
      username: this.props.username,
      reaction,
      otherUser: this.props.username === this.props.route.params.user.author ? this.props.route.params.user.reciever : this.props.route.params.user.author,
      id: this.state.message.id,
      date: this.state.message.date,
      message: this.state.message.message
    }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log("FAILURE :", err);
    })
  }
  render() {
  	const { user } = this.state;
  	console.log("THIS.props :", this.props);
    return (

      <View style={{ flex: 1 }}>
        <Header>
          <Left>
            <NativeButton onPress={() => {
              this.props.navigation.navigate("chat-users");
            }} hasText transparent>
              <NativeText>Back</NativeText>
            </NativeButton>
          </Left>
          <Body>
           {user !== null ? <Title>{user.username === this.props.username ? this.props.route.params.user.author : this.props.route.params.user.author}</Title> : null}
          </Body>
          <Right>
            <NativeButton onPress={() => {
            	console.log("clicked chat...");
            	this.setState({
            		modalIsVisible: true
            	})
            }} hasText transparent>
             	<NativeText>Report?</NativeText>
            </NativeButton>
          </Right>
          {this.renderSockets()}
        </Header>
    	<View>
			<Text style={{ textAlign: "center", paddingTop: 10, color: "darkred" }}>latest messages...</Text>
    	</View>
	    <View style={{ flex: 1 }}> 
          <View behavior="padding" style={styles.keyboard}>
            {this.state.ready === true && this.state.first !== null ? <ScrollView style={{ flex: 1, paddingBottom: 100 }}>{this.state.replies ? this.state.replies.map((item, index) => {
            	if (item.id === this.props.route.params.user.id && item.author !== this.props.username) {
			      	return (
			      	<Fragment>
			        	<View style={styles.eachMsg}>
				          <Image source={{ uri: this.props.route.params.image || this.props.route.params.notify.picture }} style={styles.userPic} />
                    <TouchableOpacity onPress={() => {
                      this.setState({
                        message: item
                      }, () => {
                        this.RBSheet.open();
                      })
                    }} style={styles.msgBlock} >
                          <Text style={styles.msgTxt}>{item.message}</Text>
                    </TouchableOpacity>
				        </View>
				        <Text style={{ textAlign: "left", padding: 10 }}>{item.date}</Text>
				    </Fragment>
				      );
			      } else {
			    	if (item.id === this.props.route.params.user.id) {
				      return (
				      <Fragment>
				        <View style={styles.rightMsg} >
                  <TouchableOpacity onPress={() => {
                      this.setState({
                        message: item
                      }, () => {
                        this.RBSheet.open();
                      })
                  }} style={styles.rightBlock} >
                        <Text style={styles.rightTxt}>{item.message}</Text>
                  </TouchableOpacity>
				          <Image source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.profilePic.picture}` }} style={styles.userPic} />
				        </View>
				       <Text style={{ textAlign: "right", paddingRight: 10 }}>{item.date}</Text>
				    </Fragment>
				      );
				    }
			    }
            }) : null}<Fragment>
            <View style={this.state.first.author === this.props.username ? styles.rightMsg : styles.eachMsg} >
            {this.state.first.author !== this.props.username ? <Image source={{uri: this.state.first.picture }} style={styles.userPic} /> : null}
            <TouchableOpacity onPress={() => {
              this.setState({
                message: this.state.first
              }, () => {
                this.RBSheet.open();
              })
            }} style={this.state.first.author === this.props.username ? styles.rightBlock : styles.msgBlock} >
              <Text style={this.state.first.author === this.props.username ? styles.rightTxt : styles.msgTxt}>{this.state.first.message}</Text>
            </TouchableOpacity>
          
		          {this.state.first.author === this.props.username ? <Image source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.profilePic.picture}` }} style={styles.userPic} /> : null}
		        </View><Text style={{ alignItems: 'flex-start', alignSelf: 'flex-start', paddingRight: 10, paddingLeft: 10 }}>{this.state.first.date}</Text></Fragment></ScrollView> : null}
            <View style={this.state.align ? styles.loadedInput : styles.input}>
            <KeyboardAvoidingView style={{ flex: 1 }} 
		      behavior={Platform.OS == "ios" ? "padding" : "height"} 
		      keyboardVerticalOffset={Platform.select({ ios: 80, android: 500 })}
		    >
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={75}
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
		    {this.renderModalComponent()}
		    <View style={{ flex: 1 }}>
              <TextInput 
              	onChangeText={(text) => {
                	this._onChange(text);
                }} 
                value={this.state.msg}
                placeholderTextColor = "#696969" 
                onEndEditing={() => {
                	console.log('boooooom');
                	this.setState({
                		align: false
                	})
                }}
                blurOnSubmit={false}
                onSubmitEditing={() => this.send()}
                placeholder="Type a message" 
                onFocus={() => {
                	this.setState({
                		align: true
                	})
                }}
                returnKeyType="send"/>
            </View>
              </KeyboardAvoidingView>
            </View>
          </View>
          </View>
      
      </View>
    
    );
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
  keyboard: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width,
    height,
  },
  header: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#075e54',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
  },
  chatTitle: {
    color: '#fff',
    fontWeight: '600',
    margin: 10,
    fontSize: 15,
  },
  chatImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  loadedInput: {
	  flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 10,
    height: 40,
    width: width - 20,
    backgroundColor: '#fff',
    margin: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    borderColor:'#696969',
    borderWidth:1,
    position: "absolute",
    right: 0
  },
  input: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 10,
    height: 40,
    width: width - 20,
    backgroundColor: '#fff',
    margin: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    borderColor:'#696969',
    borderWidth:1,
    bottom: 0,
    position: "absolute",
    right: 0
  },
  eachMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
  },
  rightMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
    alignSelf: 'flex-end',
  },
  userPic: {
    height: 40,
    width: 40,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
  },
  msgBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    padding: 10,
    shadowColor: '#858AE3',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
    },
  },
  rightBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#613DC1',
    padding: 10,
    shadowColor: '#858AE3',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 7,
    },
  },
  msgTxt: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  rightTxt: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
  buttonCancel: {
  	width: width * 0.90,
  	marginTop: 50
  },
  contentList:{
    flex:1,
  },
  cardContent: {
    marginLeft:20,
    marginTop:10
  },
  image:{
    width:90,
    height:90,
    borderRadius:45,
    borderWidth:2,
    borderColor:"#ebf0f7"
  },

  card:{
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginLeft: 20,
    marginRight: 20,
    marginTop:20,
    backgroundColor:"white",
    padding: 10,
    flexDirection:'row',
    borderRadius:30,
  },

  name:{
    fontSize:18,
    flex:1,
    alignSelf:'center',
    color:"#3399ff",
    fontWeight:'bold'
  },
  count:{
    fontSize:14,
    flex:1,
    alignSelf:'center',
    color:"#6666ff"
  },
  followButton: {
    marginTop:10,
    height:35,
    width:100,
    padding:10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "white",
    borderWidth:1,
    borderColor:"#dcdcdc",
  },
  followButtonText:{
    color: "#dcdcdc",
    fontSize:12,
  },
});  
const mapStateToProps = state => {
	console.log("state", state);
	return {
		id: state.auth.authenticated.id,
		profilePic: state.auth.authenticated.profilePic ? state.auth.authenticated.profilePic[state.auth.authenticated.profilePic.length - 1] : null,
		username: state.auth.authenticated.username
	}
}
export default connect(mapStateToProps, {  })(MessageIndividual);