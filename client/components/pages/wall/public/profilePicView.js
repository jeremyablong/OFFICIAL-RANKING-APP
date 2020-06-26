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
  PanResponder
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import axios from "axios";
import SlidingUpPanel from 'rn-sliding-up-panel';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { connect } from "react-redux";

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
  	comment: ""
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
		axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
          username: this.props.route.params.user.username
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
	handleCameraSubmission = () => {
		console.log("handleCameraSubmission - submit.");
	}
	handleCommentSubmission = () => {
		console.log("handle submission - comment.");
		axios.post("http://recovery-social-media.ngrok.io/post/profile/pic/comment", {
			comment: this.state.comment,
			username: this.props.username
		}).then((res) => {
			if (res.data.message === "Successfully posted new comment!") {
				console.log(res.data);
				// this.setState({

				// })
			}
		}).catch((err) => {
			console.log(err);
		})
	}
	render() {
		console.log(this.state);
		return (
			<Fragment>
				<Header>
		          <Left>
		            <NativeButton onPress={() => {
		             	// redirect
		             	this.props.navigation.navigate("public-wall");
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
		       <Image resizeMode={'cover'} style={{ width: width * 0.90, marginLeft: 20,  height: 400 }} source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.route.params.user.profilePic}` }} />
		       <Footer>
		          <FooterTab>
		            <NativeButton style={{  paddingTop: 20  }} badge vertical>
		              <Badge style={styles.badgeLike}><NativeText>2</NativeText></Badge>
		              {/*<Icon name="apps" />*/}
		              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/like.png")} />
		              <NativeText>Like</NativeText>
		            </NativeButton>
		            
		            <NativeButton onPress={() => {
		            	this._panel.show();
		            }} style={{ paddingTop: 30 }} active badge vertical>
		              <Badge style={styles.badge}><NativeText>5</NativeText></Badge>
		              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/comment.png")} />
		              <NativeText>Comments</NativeText>
		            </NativeButton>
		            <NativeButton vertical>
		            <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/innovation.png")} />
		              <NativeText>Share</NativeText>
		            </NativeButton>
		          </FooterTab>
		        </Footer>
		    </ScrollView>

		       <View style={{ bottom: 0, width: width, position: "absolute" }}>
					<Footer>
			          <FooterTab>
			            <NativeButton active onPress={() => {
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
							<TouchableOpacity onPress={() => {
								this.handleCameraSubmission();
							}}><Image style={styles.camera} source={require("../../../../assets/icons/ar-camera.png")} /></TouchableOpacity>
					     	<NativeButton onPress={() => {
					     		this.handleCommentSubmission();
					     	}} style={styles.btn}>
								<NativeText style={{ color: "white" }}>Submit New Comment</NativeText>
							</NativeButton>
					    </View>
					</View>
		            {this.state.data ? this.state.data.map((Notification, index) => {
		            	return (
							<View style={styles.container}>
				              <TouchableOpacity onPress={() => {}}>
				                <Image style={styles.image} source={{uri: Notification.image}}/>
				              </TouchableOpacity>
				              <View style={styles.content}>
				                <View style={styles.contentHeader}>
				                  <Text  style={styles.name}>{Notification.name}</Text>
				                  <Text style={styles.time}>
				                    9:58 am
				                  </Text>
				                </View>
				                <Text rkType='primary3 mediumLine'>{Notification.comment}</Text>
				              </View>
				            </View>
		            	);
		            }) : null}
		            <Button title='Hide' onPress={() => this._panel.hide()} />
		          </ScrollView>
		        </SlidingUpPanel>

			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
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