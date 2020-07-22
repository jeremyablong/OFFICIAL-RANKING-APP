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
  Keyboard, 
  FileSystem,
  TouchableWithoutFeedback
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Content, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import NavigationDrawer from "../../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import RBSheet from "react-native-raw-bottom-sheet";
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SlidingUpPanel from 'rn-sliding-up-panel';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-view';
import axios from "axios";
import { connect } from "react-redux";
import * as RNFS from 'react-native-fs';

const { width, height } = Dimensions.get("window");

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'RankBook', title: 'Choose Photo from RankBook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class PostToWallPage extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false,
  	avatar: null,
  	avatarSource: null,
  	images: [],
  	activeIndex: 0,
  	selectedImages: [],
  	ready: false,
  	display: false,
  	isVisible: false,
  	text: ""
  };
}
	componentDidMount() {
	  this.RBSheet.open();
	}
	uploadImg = () => {
		ImagePicker.openPicker({
		  multiple: true,
		  mediaType: "photo"
		}).then(image => {
		  	for (var i = 0; i < image.length; i++) {
	    		let element = image[i];
	    		let selectedWithFileSystem = RNFS.readFile(element.path, 'base64').then((response) => {
	    			console.log("BASE64 :", response);
	    			return response;
	    		});
	    		console.log("selectedWithFileSystem", selectedWithFileSystem)
	    		selectedWithFileSystem.then((result) => {
	    			console.log("RESULT :", result);
	    			this.setState(prevState => ({
		    			selectedImages: [ ...prevState.selectedImages, { source: { uri: element.path }, mime: element.mime, filename: element.filename, base64: result } ]
		    		}))
	    		})
	    	}
	    	this.setState({
	    		display: true
	    	}, () => {
	    		this.RBSheetTwo.close();
	    		this.RBSheet.close();
	    	})
		});
	}
	showImages = () => {
		console.log("on press.")
		this.setState({
			isVisible: true
		})
	}
	renderConstant = () => {
		const { display } = this.state;

		if (display === true) {
			return (
				<Fragment><TouchableOpacity onPress={() => {
					console.log("delete.")
					this.setState({
						selectedImages: [],
						display: false
					})
				}}><Image style={{ width: 35, height: 35, bottom: 20, left: 20 }} source={require("../../../../assets/icons/close.png")}/>
				<NativeText style={{ left: 6, bottom: 10 }}>Re-Select Images</NativeText></TouchableOpacity><NativeButton onPress={this.showImages} style={{ backgroundColor: "darkred", justifyContent: "center" }}>
					<NativeText>View Selected Photos</NativeText>
				</NativeButton></Fragment>
			);
		}
	}
	handleSubmission = () => {
		const { selectedImages, text } = this.state;

		if (text.length > 0 && selectedImages.length > 0) {

			axios.post("http://recovery-social-media.ngrok.io/create/wall/posting", {
				images: selectedImages,
				text,
				username: this.props.username
			}).then((res) => {
				console.log(res.data);
				if (res.data.message === "Successfully uploaded images to wall and status update!") {
					alert(res.data.message);
				}
			}).catch((err) => {
				console.log(err);
			});
		} else if (selectedImages.length > 0 && !text) {
			console.log("Only images are present...");
			axios.post("http://recovery-social-media.ngrok.io/create/wall/posting", {
				images: selectedImages,
				username: this.props.username
			}).then((res) => {
				console.log(res.data);
				if (res.data.message === "Successfully uploaded images to wall and status update!") {
					alert(res.data.message);
				}
			}).catch((err) => {
				console.log(err);
			});
		} else if (selectedImages.length === 0 && text.length > 0) {
			console.log("text exists and images do NOT...");
			axios.post("http://recovery-social-media.ngrok.io/create/wall/posting", {
				text,
				username: this.props.username
			}).then((res) => {
				console.log(res.data);
				if (res.data.message === "Successfully uploaded wall posting!") {
					alert(res.data.message);
				}
			}).catch((err) => {
				console.log(err);
			});
		}
	}
	renderConstantTwo = () => {
		const { display } = this.state;

		if (display === true) {
			return (
				<ImageView
				    images={this.state.selectedImages}
				    imageIndex={0}
				    isVisible={this.state.isVisible} 
				    onClose={() => {
				    	this.setState({
				    		isVisible: false
				    	})
				    }}
				/>
			);
		}
	}
	render() {
		console.log("THIS state... :", this.state);
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<Fragment>
			
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header>
		          <Left>
		            <NativeButton onPress={() => {
		              console.log("clicked.");
		              this.props.navigation.navigate("dashboard");
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/construction.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title>Create Post</Title>
		          </Body>
		          <Right>
		            <NativeButton onPress={() => {
		            	console.log("clicked user interface...");
		            	this.setState({
		            		isOpen: true
		            	})
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/user-interface.png")}/>
		            </NativeButton>
		          </Right>
		        </Header>
		       
		       <View style={styles.container}>
						<View style={{ flexDirection: "row", padding: 13 }}>
							<NativeButton onPress={() => {
								this._panel.show();
							}} transparent style={{  borderColor: "black", borderWidth: 2, marginRight: 10 }}><Image style={{ width: 25, height: 25, marginLeft: 18 }} source={require("../../../../assets/icons/anonymous.png")}/><NativeText style={{ fontSize: 20, color: "black" }}> Post Visibility </NativeText><Image style={{ width: 25, height: 25, marginRight: 30 }} source={require("../../../../assets/icons/download.png")}/></NativeButton>
							
						</View>
						<ScrollView keyboardShouldPersistTaps="handled">
				        	<AutoGrowingTextInput placeholderTextColor='grey' style={styles.textInput} onChangeText={(text) => {
				        		this.setState({
				        			text
				        		})
				        	}} placeholder={"What's on your mind? Click here to type..."} />
							{this.renderConstantTwo()}
						</ScrollView>
						
						<View style={{ bottom: 0, position: "absolute", width: width}}>

							{this.renderConstant()}
							<Footer>
					          <FooterTab>
					            <NativeButton onPress={() => {
									this.RBSheetTwo.open();
									this.uploadImg();
					            }}>
					              <NativeText>Upload Image</NativeText>
					            </NativeButton>
					         {/*   <NativeButton>
					              <NativeText>Camera</NativeText>
					            </NativeButton>*/}
					            <NativeButton>
					              <NativeText>Navigate</NativeText>
					            </NativeButton>
					            <NativeButton>
					              <NativeText>Contact</NativeText>
					            </NativeButton>
					          </FooterTab>
					        </Footer>


							<NativeButton onPress={this.handleSubmission} style={{ backgroundColor: "#613DC1", justifyContent: "center" }}>
								<NativeText>Submit Posting</NativeText>
							</NativeButton>	
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
						          	<Image source={require("../../../../assets/icons/video-1.png")} style={{ width: 50, height: 50 }} />
						            <Text style={styles.specialTxt}>Create Room</Text>
						            </Left>
						      </TouchableOpacity>
						    </ListItem>
						    <ListItem noIndent style={{ backgroundColor: "lightgrey" }}>
						     <TouchableOpacity onPress={() => {
						      	console.log("pressed...");
						      }}>
						     <Left>
						     	<Image source={require("../../../../assets/icons/picture-1.png")} style={{ width: 50, height: 50 }} />
						        <Text style={styles.specialTxt}>Photo/Video</Text>
						      </Left>
						      </TouchableOpacity>
						    </ListItem>
						    <ListItem noIndent style={{ backgroundColor: "white" }}>
						     <TouchableOpacity onPress={() => {
						      	console.log("pressed...");
						      }}>
						      <Left>
						      	<Image source={require("../../../../assets/icons/question-1.png")} style={{ width: 50, height: 50 }} />
						        <Text style={styles.specialTxt}>Tag Friends</Text>
						      </Left>
						      </TouchableOpacity>
						    </ListItem>
						    <ListItem noIndent style={{ backgroundColor: "lightgrey" }}>
						     <TouchableOpacity onPress={() => {
						      	console.log("pressed...");
						      }}>
						      <Left>
						      	<Image source={require("../../../../assets/icons/files-1.png")} style={{ width: 50, height: 50 }} />
						        <Text style={styles.specialTxt}>GIF</Text>
						      </Left>
						      </TouchableOpacity>
						    </ListItem>
						    <ListItem noIndent style={{ backgroundColor: "white" }}>
						     <TouchableOpacity onPress={() => {
						      	console.log("pressed...");
						      }}>
						      <Left>
						        <Image source={require("../../../../assets/icons/pin-1.png")} style={{ width: 50, height: 50 }} />
						        <Text style={styles.specialTxt}>Check In</Text>
						      </Left>
						     </TouchableOpacity>
						    </ListItem>
						    <ListItem noIndent style={{ backgroundColor: "lightgrey" }}>
						     <TouchableOpacity onPress={() => {
						      	console.log("pressed...");
						      }}>
						      <Left>
						        <Image source={require("../../../../assets/icons/emoji-1.png")} style={{ width: 50, height: 50 }} />
						        <Text style={styles.specialTxt}>Feeling/Activity</Text>
						      </Left>
						      </TouchableOpacity>
						    </ListItem>
						    <ListItem noIndent style={{ backgroundColor: "white" }}>
						     <TouchableOpacity onPress={() => {
						      	console.log("pressed...");
						      }}>
						      <Left>
						        <Image source={require("../../../../assets/icons/live-1.png")} style={{ width: 50, height: 50 }} />
						        <Text style={styles.specialTxt}>Live Video</Text>
						      </Left>
						      </TouchableOpacity>
						    </ListItem>
						    <ListItem noIndent style={{ backgroundColor: "lightgrey" }}>
						     <TouchableOpacity onPress={() => {
						      	console.log("pressed...");
						      }}>
						      <Left>
							    <Image source={require("../../../../assets/icons/picture-1.png")} style={{ width: 50, height: 50 }} />
						        <Text style={styles.specialTxt}>Camera</Text>
						      </Left>
						      </TouchableOpacity>
						    </ListItem>
						    <ListItem noIndent style={{ backgroundColor: "white" }}>
						     <TouchableOpacity onPress={() => {
						      	console.log("pressed...");
						      }}>
						      <Left>
						        <Image source={require("../../../../assets/icons/recommendations-1.png")} style={{ width: 50, height: 50 }} />
						        <Text style={styles.specialTxt}>Ask For Recommendations</Text>
						      </Left>
						      </TouchableOpacity>
						    </ListItem>
						    <ListItem noIndent style={{ backgroundColor: "lightgrey" }}>
						     <TouchableOpacity onPress={() => {
						      	console.log("pressed...");
						      }}>
						      <Left>
						        <Image source={require("../../../../assets/icons/patient.png")} style={{ width: 50, height: 50 }} />
						        <Text style={styles.specialTxt}>Support Non-Profit</Text>
						      </Left>
						      </TouchableOpacity>
						    </ListItem>
						   
						  </ScrollView>
						</RBSheet>
						<RBSheet 
							  onClose={() => {

							  }}
						  ref={ref => {
						    this.RBSheetTwo = ref;
						  }}
						  height={500}
						  openDuration={250}
						  customStyles={{
						    container: {
						      justifyContent: "center",
						      alignItems: "center"
						    }
						  }}
						>
						  <ScrollView style={{ width: width }}>
						   	<View style={{ marginTop: 40 }}>
								
						   	</View>
						  </ScrollView>
						</RBSheet>
		       </View>
		       <SlidingUpPanel allowDragging={false} ref={c => this._panel = c}>
		          <View style={styles.containerSlide}>
		            <Content>
		            <Button title='Hide' onPress={() => this._panel.hide()} />
		            <NativeText style={{ padding: 10, color: "blue" }}>Who can see your post?</NativeText>
		            <NativeText style={{ padding: 10 }}>Your post will show up in the News Feed, on your profile and in search results...</NativeText>
		         	 <List>
			            <TouchableOpacity onPress={() => {
			            	console.log("clicked...");
			            }}>
							<ListItem style={{ width: width }} avatar>
				              <Left>
				                <Thumbnail source={require("../../../../assets/icons/globe-neon.png")} />
				              </Left>
				              <Body>
				                <Text>Public - Everyone</Text>
				                <Text note>Anyone on or off our platform...</Text>
				              </Body>
				            </ListItem>
			            </TouchableOpacity>
			             <TouchableOpacity onPress={() => {
				            	console.log("clicked...");
				            }}>
				            <ListItem style={{ width: width }} avatar>
				              <Left>
				                <Thumbnail source={require("../../../../assets/icons/interface.png")} />
				              </Left>
				              <Body>
				                <Text>Friends - Only</Text>
				                <Text note>Your friends on our platform...</Text>
				              </Body>
				            </ListItem>
				            </TouchableOpacity>
				             <TouchableOpacity onPress={() => {
				            	console.log("clicked...");
				            }}>
				            <ListItem style={{ width: width }} avatar>
				              <Left>
				                <Thumbnail source={require("../../../../assets/icons/patient.png")} />
				              </Left>
				              <Body>
				                <Text>Friends Except...</Text>
				                <Text note>Friends: Except... Thomas Smith, Rogers Adams, Beccy Smith</Text>
				              </Body>
				            </ListItem>
				            </TouchableOpacity>
				          </List>
			          <Button title='Hide' onPress={() => this._panel.hide()} />
			        </Content>
		            
		          </View>
		        </SlidingUpPanel>
		       </SideMenu>
		       
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	specialTxt: {
		marginTop: 10, 
		marginLeft: 15, 
		fontSize: 23 
	},
    containerSlide: {
	    flex: 1,
	    backgroundColor: 'white',
	    alignItems: 'center',
	    justifyContent: 'center'
    },
	container: {
		height: height,
		width: width,
		backgroundColor: "white",
		flex: 1
	},
	textInput: {
		width: width,
		minHeight: 50,
		paddingLeft: 50,
		paddingRight: 50,
		paddingTop: 50
	}
})
const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username
	}
}

export default connect(mapStateToProps, { })(PostToWallPage);