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
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText } from 'native-base';
import axios from "axios";
import io from "socket.io-client";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import uuid from "react-uuid";
const ENDPOINT = "http://recovery-social-media.ngrok.io";
import _ from "lodash";
import LoadingMessage from "../../../chat/loader.js";

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
      refresh: false
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
						})
					} else {
						this.setState({
							first: res.data.messages,
							replies: res.data.messages.replies
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
  _renderItem = ({ item }) => {
    // if (item.sent === false) {
      	if (item.id === this.props.route.params.user.id && item.author !== this.props.username) {
	      	return (
	      	<Fragment>
	        	<View style={styles.eachMsg}>
		          <Image source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.user.profilePic}` }} style={styles.userPic} />
		          <View style={styles.msgBlock}>
		            <Text style={styles.msgTxt}>{item.message}</Text>
		          </View>
		        </View>
		        <Text style={{ textAlign: "left", padding: 10 }}>{item.date}</Text>
		    </Fragment>
		      );
	      } else {
	    	if (item.id === this.props.route.params.user.id) {
		      return (
		      <Fragment>
		        <View style={styles.rightMsg} >
		          <View style={styles.rightBlock} >
		            <Text style={styles.rightTxt}>{item.message}</Text>
		          </View>
		          <Image source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.profilePic}` }} style={styles.userPic} />
		        </View>
		       <Text style={{ textAlign: "right", paddingRight: 10 }}>{item.date}</Text>
		    </Fragment>
		      );
		    }
	    }
  };
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
	  return this.state.replies.some((el) => {
	    return el.message === element.message && el.date === element.date;
	  }); 
  }
  componentDidUpdate(prevProps, prevState) {
  	if (this.state.sureUpdate === true) {
		if (this.userExists(this.state.last)) {
			return null;
			console.log("MATCH")
		} else {
			console.log("DOESNT match.");
			this.setState({
				replies: [ this.state.last, ...this.state.replies ],
				sureUpdate: false
			})
		}
  	}
  }
  _onChange = (text) => {
  	this.setState({ msg: text })
  }
  render() {
  	const { user } = this.state;
  	console.log(this.state);
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
            <Title>{user !== null ? user.username : "--"}</Title>
          </Body>
          <Right>
            <NativeButton onPress={() => {
            	console.log("clicked chat...");
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
            {this.state.ready === true && this.state.first !== null ? <ScrollView style={{ flex: 1, paddingBottom: 100 }}>{this.state.replies.map((item, index) => {
            	if (item.id === this.props.route.params.user.id && item.author !== this.props.username) {
			      	return (
			      	<Fragment>
			        	<View style={styles.eachMsg}>
				          <Image source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.user.profilePic}` }} style={styles.userPic} />
				          <View style={styles.msgBlock}>
				            <Text style={styles.msgTxt}>{item.message}</Text>
				          </View>
				        </View>
				        <Text style={{ textAlign: "left", padding: 10 }}>{item.date}</Text>
				    </Fragment>
				      );
			      } else {
			    	if (item.id === this.props.route.params.user.id) {
				      return (
				      <Fragment>
				        <View style={styles.rightMsg} >
				          <View style={styles.rightBlock} >
				            <Text style={styles.rightTxt}>{item.message}</Text>
				          </View>
				          <Image source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.profilePic}` }} style={styles.userPic} />
				        </View>
				       <Text style={{ textAlign: "right", paddingRight: 10 }}>{item.date}</Text>
				    </Fragment>
				      );
				    }
			    }
            })}<Fragment><View style={styles.rightMsg} >
		          <View style={styles.rightBlock} >
		            <Text style={styles.rightTxt}>{this.state.first.message}</Text>
		          </View>
		          <Image source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.profilePic}` }} style={styles.userPic} />
		        </View></Fragment></ScrollView> : null}
            <View style={this.state.align ? styles.loadedInput : styles.input}>
            <KeyboardAvoidingView style={{ flex: 1 }} 
		      behavior={Platform.OS == "ios" ? "padding" : "height"} 
		      keyboardVerticalOffset={Platform.select({ ios: 80, android: 500 })}
		    >
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
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  rightBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#147efb',
    padding: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
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
});  
const mapStateToProps = state => {
	console.log("state", state);
	return {
		id: state.auth.authenticated.id,
		profilePic: state.auth.authenticated.profilePic,
		username: state.auth.authenticated.username
	}
}
export default connect(mapStateToProps, {  })(MessageIndividual);