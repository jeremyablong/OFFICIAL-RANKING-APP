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
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import { connect } from "react-redux";
import SlidingUpPanel from 'rn-sliding-up-panel';
import PhotoUpload from 'react-native-photo-upload';
import axios from "axios";
import LoadingWall from "../loading.js";

const { width, height } = Dimensions.get("window");

class PublicWall extends React.Component {
constructor(props) {
  super(props);

  this.state = {
	avatar: null,
	cover: null,
	user: null,
	ready: false
  };
} 
	componentDidMount() {
		const url = "http://recovery-social-media.ngrok.io/get/user/by/username";
		
		axios.post(url, {
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
	renderContent = () => {
		if (this.state.ready === true) {
			return (
				<ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={styles.container}>
		          {this.state.ready ? <ImageBackground resizeMode= 'cover' source={{ uri: this.state.cover !== null ? `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.cover}` : `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.user.coverPhoto}` }} style={styles.header}><TouchableOpacity onPress={() => {
		          	console.log("clicked..");
		          	this._panel.show()
		          }}><Image style={{ position: "absolute", top: 10, left: 10, width: 55, height: 55, tintColor: "white" }} source={require("../../../../assets/icons/upload-two.png")}/></TouchableOpacity></ImageBackground> : <Fragment><View style={styles.header}></View></Fragment>}
		          <TouchableOpacity style={styles.avatar} onPress={this.redirectUser}>
					 <Image style={{ width: 130,
					    height: 130,
					    borderRadius: 63,
					    marginTop: -4,
					    marginLeft: -4,
					    borderWidth: 4,
					    borderColor: "white",
					    paddingRight: 10 }} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.user.profilePic}` }}/>
				  </TouchableOpacity>
		          <View style={styles.body}>
		            <View style={styles.bodyContent}>
		              <Text style={styles.name}>{this.state.user ? this.state.user.fullName : "--"}</Text>
		              <Text style={styles.info}>{this.state.user ? this.state.user.username : "--"}</Text>
		              <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
		              <View style={styles.customContainer}>
					      <NativeButton style={{ width: width * 0.45, backgroundColor: "black" }} onPress={() => {
							// do something
					      }}><Image style={styles.specialBtn} source={require("../../../../assets/icons/math.png")}/><NativeText style={{ color: "white" }}>Add Story</NativeText></NativeButton>
					     <NativeButton style={{ width: width * 0.20, backgroundColor: "transparent" }} onPress={() => {
							// do something
					      }}><Image style={styles.specialBtnTwo} source={require("../../../../assets/icons/more.png")}/></NativeButton>
					      <NativeButton style={{ width: width * 0.10, backgroundColor: "transparent" }} onPress={() => {
							// do something
					      }}><Image style={styles.specialBtnThree} source={require("../../../../assets/icons/special.png")}/></NativeButton>
					    </View>
		              <TouchableOpacity style={styles.buttonContainer}>
		                <Text>Option One</Text>  
		              </TouchableOpacity>              
		              <TouchableOpacity style={styles.buttonContainer}>
		                <Text>Option Two</Text> 
		              </TouchableOpacity>
		            </View>
		        </View>
		      </ScrollView>
			);
		} else {
			return (
				<Fragment>
					<TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}>
						<NativeButton onPress={() => {
							this.handleRerender(); 
							console.log("clicked.");
						}} style={{ width: width * 0.80, justifyContent: "center", alignItems: "center", top: 40 }}>
							<NativeText style={{ color: "white" }}>Load Page...</NativeText>
						</NativeButton>
					</TouchableOpacity>
					<View> 
						<LoadingWall /> 
					</View>
				</Fragment>
			);
		}
	}
	render() {
		console.log(this.state);
		return (
			<Fragment>
				<Header>
		          <Left>
		            <NativeButton onPress={() => {
		             	// redirect
		             	this.props.navigation.navigate("dashboard")
		            }} hasText transparent>
		              <Image style={{ width: 35, height: 35, marginBottom: 10 }} source={require("../../../../assets/icons/construction.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title>Public Wall</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	this.props.navigation.navigate("chat-users");
		            }} hasText transparent>
		              <NativeText>Help?</NativeText>
		            </NativeButton>
		          </Right>
		        </Header>
		        {this.renderContent()}
		      <SlidingUpPanel ref={c => this._panel = c}>
			          <View style={styles.slide}>
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
						     source={require("../../../../assets/icons/user.png")}
						   />
						 </PhotoUpload>
						 <View style={{ top: -150 }}>
							<NativeButton onPress={this.uploadCoverPhoto}>
								<NativeText style={{ color: "white" }}>Submit Cover Photo</NativeText>
							 </NativeButton>
						 </View>
			            <Button title='Hide' onPress={() => this._panel.hide()} />
			          </View>
			        </SlidingUpPanel>
			<View style={{ position: "absolute", bottom: 0, width: width }}>
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
			            <Badge style={{ marginBottom: -10 }}><NativeText>51</NativeText></Badge>
		              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/mail-three.png")} />
		            </NativeButton>
		            <NativeButton active onPress={() => {
			            	this.props.navigation.navigate("public-wall");
			            }}>
		              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/wall.png")} />
		            </NativeButton>
		          </FooterTab>
		        </Footer>
			</View>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  customContainer: {
  	marginTop: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  header:{
    backgroundColor: "#00BFFF",
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
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
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
});
const mapStateToProps = state => {
	return {
		profilePic: state.auth.authenticated.profilePic,
		username: state.auth.authenticated.username
	}
}

export default connect(mapStateToProps, {  })(PublicWall);