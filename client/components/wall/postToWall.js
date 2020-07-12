import React, { Fragment, Component } from 'react';
import SlidingUpPanel from 'rn-sliding-up-panel';
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
  Animated,
  ScrollView
} from 'react-native';
import axios from "axios";
import { connect } from "react-redux";
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, FooterTab, Footer, List, ListItem } from 'native-base';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import RBSheet from "react-native-raw-bottom-sheet";

const { width, height } = Dimensions.get("window");

const TAB_BAR_HEIGHT = 49;

class PostToWallSubComponent extends Component {
constructor(props) {
  super(props);

  this.state = {
	text: "",
	dragPanel: false,
	scrollEnabled: false
  };

  this._animatedValue = new Animated.Value(0)
} 
	componentDidMount() {
	  
	}
    renderContent = () => {
	    return (
	      <View>
	        <Text>Get directions to your location</Text>
	      </View>
	    )
	}  
	renderSlide = () => {
		return (
			<SlidingUpPanel style={{ postion: "absolute" }} allowDragging={this.state.dragPanel} animatedValue={this._animatedValue} ref={c => this._panelll = c}>
	          <View style={styles.container}>
	          <View style={styles.containerRow}>
		      	 <View style={{ left: -125, top: 120 }}>
					<Image source={{ uri: this.props.profilePic ? `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.profilePic.picture}` : "" }} style={styles.pic} />
		          </View>
		   	  </View>	
	          <Text style={styles.username}>{this.props.username}</Text>
	          <View style={{ marginTop: 150 }}>
	          
	          <View style={{ top: -40 }}>
				<Button title='Hide' onPress={() => this._panelll.hide()} />
				<AutoGrowingTextInput
		            value={this.state.text}
		            onChangeText={(value) => {
		            	this.setState({
		            		text: value
		            	})
		            }}
		            style={styles.textInput}
		            placeholder={"What's on your mind?"}
		            placeholderTextColor='#66737C'
		            maxHeight={600}
		            minHeight={400}
		            enableScrollToCaret
		            ref={(r) => { this._textInput = r; }}
		          />
	          </View>
				
	          </View>
			  <RBSheet 
			  	  onClose={() => {

			  	  }}
		          ref={ref => {
		            this.RBSheet = ref;
		          }}
		          height={300}
		          openDuration={250}
		          customStyles={{
		            container: {
		              justifyContent: "center",
		              alignItems: "center"
		            }
		          }}
		        >
		          <ScrollView style={{ width: width }}>
		            <ListItem noIndent style={{ backgroundColor: "white" }}>
		              <TouchableOpacity onPress={() => {
		              	console.log("pressed...");
		              }}>
						<Left>
			              	<Image source={require("../../assets/icons/video-1.png")} style={{ width: 50, height: 50 }} />
			                <Text style={styles.specialTxt}>Create Room</Text>
	   	                </Left>
		              </TouchableOpacity>
		            </ListItem>
		            <ListItem noIndent style={{ backgroundColor: "lightgrey" }}>
		             <TouchableOpacity onPress={() => {
		              	console.log("pressed...");
		              }}>
		             <Left>
		             	<Image source={require("../../assets/icons/picture-1.png")} style={{ width: 50, height: 50 }} />
		                <Text style={styles.specialTxt}>Photo/Video</Text>
		              </Left>
		              </TouchableOpacity>
		            </ListItem>
		            <ListItem noIndent style={{ backgroundColor: "white" }}>
		             <TouchableOpacity onPress={() => {
		              	console.log("pressed...");
		              }}>
		              <Left>
		              	<Image source={require("../../assets/icons/question-1.png")} style={{ width: 50, height: 50 }} />
		                <Text style={styles.specialTxt}>Tag Friends</Text>
		              </Left>
		              </TouchableOpacity>
		            </ListItem>
		            <ListItem noIndent style={{ backgroundColor: "lightgrey" }}>
		             <TouchableOpacity onPress={() => {
		              	console.log("pressed...");
		              }}>
		              <Left>
		              	<Image source={require("../../assets/icons/files-1.png")} style={{ width: 50, height: 50 }} />
		                <Text style={styles.specialTxt}>GIF</Text>
		              </Left>
		              </TouchableOpacity>
		            </ListItem>
		            <ListItem noIndent style={{ backgroundColor: "white" }}>
		             <TouchableOpacity onPress={() => {
		              	console.log("pressed...");
		              }}>
		              <Left>
		                <Image source={require("../../assets/icons/pin-1.png")} style={{ width: 50, height: 50 }} />
		                <Text style={styles.specialTxt}>Check In</Text>
		              </Left>
		             </TouchableOpacity>
		            </ListItem>
		            <ListItem noIndent style={{ backgroundColor: "lightgrey" }}>
		             <TouchableOpacity onPress={() => {
		              	console.log("pressed...");
		              }}>
		              <Left>
		                <Image source={require("../../assets/icons/emoji-1.png")} style={{ width: 50, height: 50 }} />
		                <Text style={styles.specialTxt}>Feeling/Activity</Text>
		              </Left>
		              </TouchableOpacity>
		            </ListItem>
		            <ListItem noIndent style={{ backgroundColor: "white" }}>
		             <TouchableOpacity onPress={() => {
		              	console.log("pressed...");
		              }}>
		              <Left>
		                <Image source={require("../../assets/icons/live-1.png")} style={{ width: 50, height: 50 }} />
		                <Text style={styles.specialTxt}>Live Video</Text>
		              </Left>
		              </TouchableOpacity>
		            </ListItem>
		            <ListItem noIndent style={{ backgroundColor: "lightgrey" }}>
		             <TouchableOpacity onPress={() => {
		              	console.log("pressed...");
		              }}>
		              <Left>
		    		    <Image source={require("../../assets/icons/picture-1.png")} style={{ width: 50, height: 50 }} />
		                <Text style={styles.specialTxt}>Camera</Text>
		              </Left>
		              </TouchableOpacity>
		            </ListItem>
		            <ListItem noIndent style={{ backgroundColor: "white" }}>
		             <TouchableOpacity onPress={() => {
		              	console.log("pressed...");
		              }}>
		              <Left>
		                <Image source={require("../../assets/icons/recommendations-1.png")} style={{ width: 50, height: 50 }} />
		                <Text style={styles.specialTxt}>Ask For Recommendations</Text>
		              </Left>
		              </TouchableOpacity>
		            </ListItem>
		            <ListItem noIndent style={{ backgroundColor: "lightgrey" }}>
		             <TouchableOpacity onPress={() => {
		              	console.log("pressed...");
		              }}>
		              <Left>
		                <Image source={require("../../assets/icons/non-profit-1.png")} style={{ width: 50, height: 50 }} />
		                <Text style={styles.specialTxt}>Support Non-Profit</Text>
		              </Left>
		              </TouchableOpacity>
		            </ListItem>
		           
		          </ScrollView>
		        </RBSheet>
	          </View>
	        </SlidingUpPanel>
		);
	}
	render() {
		console.log(this.state);
		return (
			<Fragment>
				<TouchableOpacity style={styles.wrapper}>
			        <View style={styles.rowTwo}>
			          <Image source={{ uri: this.props.profilePic ? `https://s3.us-west-1.wasabisys.com/rating-people/${this.props.profilePic.picture}` : "" }} style={styles.pic} />
			          <View style={{ marginLeft: 0 }}>
			            <View style={styles.nameContainer}>
			              <NativeButton onPress={() => {
			            	this.props.navigation.navigate("post-to-wall-page");
			            }} transparent><NativeText style={{ color: "grey", fontSize: 15, textAlign: "center", fontWeight: "bold" }}>What's on your mind...?</NativeText></NativeButton>
			            </View>
			          </View>
			        </View>
			        <Footer>
			          <FooterTab>
			            <NativeButton>
			              <NativeText>Upload Photo</NativeText>
			            </NativeButton>
			            <NativeButton onPress={() => {
			            	this.props.navigation.navigate("post-to-wall-page");
			            }}>
			              <Image style={{ width: 50, height: 50 }} source={require("../../assets/icons/live.png")} />
			            </NativeButton>
			            <NativeButton>
			              <NativeText>Open A Room</NativeText>
			            </NativeButton>
			            
			          </FooterTab>
			        </Footer>
			      </TouchableOpacity>
				{this.renderSlide()}
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => {
	console.log(state);
	if (state.auth.authenticated.username) {
		return {
			profilePic: state.auth.authenticated.profilePic ? state.auth.authenticated.profilePic[state.auth.authenticated.profilePic.length - 1] : [],
			username: state.auth.authenticated.username
		}
	} else {
		return {
			username: state.auth.authenticated.username
		}
	}
}
const styles = StyleSheet.create({
	specialTxt: {
		marginTop: 10, 
		marginLeft: 15, 
		fontSize: 23 
	},
	username: {
		top: 125,
		fontSize: 25,
		paddingLeft: 20, 
		fontWeight: "bold",
		position: "absolute"
	},
  containerRow: {
	flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textInput: {
    paddingLeft: 10, 
    marginLeft: 25,
    marginRight: 25,
    textAlign: "left",
    fontSize: 17,
    backgroundColor: 'white',
    borderWidth: 0,
    borderRadius: 4,
    maxWidth: width * 0.90
  },
  rowTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    top: 0
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  wrapper: {
  	top: -80
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default connect(mapStateToProps, {  })(PostToWallSubComponent);