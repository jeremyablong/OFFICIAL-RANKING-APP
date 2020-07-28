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
  PanResponder, 
  Keyboard,
  Animated
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import NavigationDrawer from "../../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import MapView, { Marker } from 'react-native-maps';
import axios from "axios";
import RBSheet from "react-native-raw-bottom-sheet";
import ProfileSub from "../../../mapProfileHelpers/reviewUserPopProfile.js";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

const URL = "http://recovery-social-media.ngrok.io";
 
class DisplayNearbyUsers extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false,
  	markers: [],
  	showSlide: false,
  	marker: null,
  	user: null
  };
}
	componentDidMount() {
	    axios.get(`${URL}/gather/all/profiles`).then((res) => {
	  	  console.log("Unicorn res.data :", res.data);
	  	  this.setState({
			markers: res.data
	  	  })
	    }).catch((err) => {
	  	  console.log(err);
	    });
	}
	renderSlideUp = () => {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<RBSheet
				  ref={ref => {
				    this.RBSheet = ref;
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
				  <View style={{ width: width, backgroundColor: "white" }}>
					<ProfileSub navigation={this.props.navigation} user={this.state.marker} />
					 <NativeButton style={{ backgroundColor: "#999999", width: width, justifyContent: "center", marginBottom: 40, alignItems: "center", alignContent: "center" }} onPress={() => {
          					console.log("clicked user interface...");
                        	 this.RBSheet.close();
  							 this.props.navigation.navigate("rank-from-map-view", { user: this.state.marker });
  							}} hasText>
  								<Text style={{ color: "white", fontSize: 22, fontWeight: "bold", paddingBottom: 10 }}>Review This User  <Image style={{ width: 40, height: 40, marginBottom: 10, marginTop: 15 }} source={require("../../../../assets/icons/review-two.png")}/>  </Text>
  					</NativeButton>
				  </View>
				</RBSheet>
		</View>
		);
	}
	loop = (marker) => {
		console.log("marka :", marker);
		if (marker.rankedUsers) {
			for (var i = 0; i < marker.rankedUsers.length; i++) {
				let element = marker.rankedUsers[i];
				console.log("elementtttt :", element);
				if (element.reciever === marker.username || marker.username === this.props.username) {
					return false;
				}
			}
		}
		return true;
	}
	render() {
		console.log("marker state :", this.state);
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<Fragment>
				<SideMenu isOpen={this.state.isOpen} menu={menu}>
					<Header>
			          <Left>
			            <NativeButton onPress={() => {
			              this.props.navigation.navigate("dashboard");
			            }} hasText transparent>
			              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/construction.png")}/>
			            </NativeButton>
			          </Left>
			          <Body>
			            <Title>Nearby Users</Title>
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
			        <View style={{ minHeight: height, backgroundColor: "white" }}>
						<MapView 
							style={styles.map}
						    initialRegion={{
						      latitude: 37.78825,
						      longitude: -122.4324,
						      latitudeDelta: 0.0922,
						      longitudeDelta: 0.0421,
						    }}
						  >
							{this.state.markers.map((marker, index) => {
								console.log("MARKER: ", marker);
								if (marker.location && this.loop(marker)) {
									let latitude = marker.location.coords.latitude;
									let longitude = marker.location.coords.longitude;
									let activityType = marker.location.activity.type;
									let confidence = marker.location.activity.confidence;
									let coordinates = {
										latitude,
										longitude
									}
								    return (
										<Marker  
										  key={index}
										  onPress={() => {
									    	console.log("marker pressed!");
											this.setState({
												showSlide: !this.state.showSlide,
												isOpen: false,
												marker
											}, () => {
												if (this.state.showSlide === true) {
													this.RBSheet.open();
												} else {
													this.RBSheet.close();
												}
											})
									      }}
									      coordinate={coordinates}
									      title={marker.fullName}
									      description={marker.username}
									    />
								    );
								}
							  })}
						
						  </MapView>
						  {this.renderSlideUp()}
			        </View>
			        <View style={{ position: "absolute", bottom: 0, width: width }}>
					<Footer>
			          <FooterTab>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("dashboard");
				            }}>
			              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/home-run.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("notifications");
				            }}>
				            <Badge style={{ marginBottom: -15, marginLeft: 5 }}><NativeText>3</NativeText></Badge>
			               <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/notification.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("chat-users");
				            }}>
				          <Badge style={{ marginBottom: -10 }}><NativeText>51</NativeText></Badge>
			              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/mail-three.png")} />
			            </NativeButton>
			            <NativeButton onPress={() => {
				            	this.props.navigation.navigate("public-wall");
				            }}>
			              <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/wall.png")} />
			            </NativeButton>
		              <NativeButton onPress={() => {
		                  this.props.navigation.navigate("profile-settings");
		                }}>
		                <Image style={{ width: 35, height: 35 }} source={require("../../../../assets/icons/list.png")} />
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
	map: {
		width: width,
		height: height
	}
})

const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username
	}
}

export default connect(mapStateToProps, {  })(DisplayNearbyUsers);