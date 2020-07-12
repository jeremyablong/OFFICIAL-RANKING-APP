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
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab } from 'native-base';
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
  	requestSent: false
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
	  			} else {
	  				console.log("doesnt have any friends.");
	  				this.setState({
	  					user: res.data.user,
	  					alreadyFriends: false
	  				})
	  			}
	  			this.setState({
		  			user: res.data.user
		  		})
	  		}
	  	}).catch((err) => {
	  		console.log(err);
	  	});
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
	render() {
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		console.log(this.state);
		const { user } = this.state;
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header>
		          <Left>
		            <NativeButton onPress={() => {
		              this.props.navigation.navigate("dashboard");
		            }} hasText transparent>
		             <NativeText>Back</NativeText>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title>{user !== null ? user.username : "--"}</Title>
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
	          <ImageBackground source={require("../../../assets/images/modern.jpg")} style={{ flex: 1, height: height, width: width, alignItems: "center", justifyContent: "center" }}>
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
  }
});
const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username
	}
}
export default connect(mapStateToProps, {  })(ProfileIndividual);