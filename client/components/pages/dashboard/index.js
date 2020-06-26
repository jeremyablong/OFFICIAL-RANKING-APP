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
import { authenticated } from "../../../actions/auth/auth.js";
import Carousel from 'react-native-snap-carousel';
import axios from "axios";
import SearchBar from 'react-native-search-bar';
import ShowFeedList from "../../dashboard/feed/showFeed.js";


const { width, height } = Dimensions.get("window");

class DashboardAfterAuth extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  	searching: false,
  	searchValue: "",
  	people: [],
  	specific: null
  };
}
	uploadImage = () => {
		console.log("upload");
	}
	handleSearch = () => {
		console.log("search...");
		if (this.state.searchValue.length > 0) {
			axios.post("http://recovery-social-media.ngrok.io/get/specific/user", {
				searchValue: this.state.searchValue.toLowerCase()
			}).then((res) => {
				console.log(res.data);
				if (res.data.message === "FOUND user!") {
					this.setState({
						people: [res.data.user]
					})
				} else if (res.data.message === "User could NOT be found...") {
					this.setState({
						people: []
					})
				}
			}).catch((err) => {
				console.log(err);
			})
		}
	}
	handleCancel = () => {
		console.log("handle cancel...");
		axios.get("http://recovery-social-media.ngrok.io/gather/all/profiles").then((res) => {
			console.log(res.data);
			if (res.data) {
				this.setState({
					people: res.data,
					searching: false
				})
			}
		}).catch((err) => {
			console.log(err);
		})
	}
	componentDidMount() {
		axios.get("http://recovery-social-media.ngrok.io/gather/all/profiles").then((res) => {
			console.log(res.data);
			if (res.data) {
				this.setState({
					people: res.data
				})
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
              this.props.authenticated({});
              this.props.navigation.navigate("login");
            }} hasText transparent>
              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/logout.png")}/>
            </NativeButton>
          </Left>
          <Body>
            <Title>Dashboard</Title>
          </Body>
          <Right>
            <NativeButton onPress={() => {
            	console.log("clicked chat...");
            	this.props.navigation.navigate("chat-users");
            }} hasText transparent>
              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
            </NativeButton>
          </Right>
        </Header>
        <SearchBar 
		  ref="searchBar"
		  placeholder="Search by USER-NAME..."
		  onChangeText={(value) => {
		  	this.setState({
		  		searchValue: value,
		  		searching: true
		  	})
		  }} 
		  onSearchButtonPress={this.handleSearch}
		  onCancelButtonPress={this.handleCancel}
		/>
		{this.state.searching === true ? <Fragment>
			{this.state.people ? <FlatList
		        data={this.state.people}
		        renderItem={({ item }) => {
		        	console.log("itemmmmmm :", item);
		        	return (
						<ListItem thumbnail>
			              <Left>
			                <Thumbnail square source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${item.profilePic}` }} />
			              </Left>
			              <Body>
			                <NativeText>{item.username}</NativeText>
			                {/*<NativeText note numberOfLines={1}>{}</NativeText>*/}
			              </Body>
			              <Right>
			                <NativeButton onPress={() => {
								this.props.navigation.navigate("profile-individual", { user: item });
			                }} transparent>
			                  <NativeText>View</NativeText>
			                </NativeButton>
			              </Right>
			            </ListItem>
		        	);
		        }}
		        keyExtractor={item => item.id}
		      /> : <NativeButton><NativeText>Load page...</NativeText></NativeButton>}
			</Fragment> : <ShowFeedList />}

			<Footer>
	          <FooterTab>
	            <NativeButton active onPress={() => {
		            	this.props.navigation.navigate("dashboard");
		            }}>
	              <Image style={{ width: 35, height: 35 }} source={require("../../../assets/icons/home-run.png")} />
	            </NativeButton>
	            <NativeButton onPress={() => {
		            	this.props.navigation.navigate("dashboard");
		            }}>
	               <Image style={{ width: 35, height: 35 }} source={require("../../../assets/icons/sport-team.png")} />
	            </NativeButton>
	            <NativeButton onPress={() => {
		            	this.props.navigation.navigate("chat-users");
		            }}>
		          <Badge style={{ marginBottom: -10 }}><NativeText>51</NativeText></Badge>
	              <Image style={{ width: 35, height: 35 }} source={require("../../../assets/icons/mail-three.png")} />
	            </NativeButton>
	            <NativeButton onPress={() => {
		            	this.props.navigation.navigate("public-wall");
		            }}>
	              <Image style={{ width: 35, height: 35 }} source={require("../../../assets/icons/wall.png")} />
	            </NativeButton>
	          </FooterTab>
	        </Footer>
		</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  rowTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10
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
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width:170,
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    justifyContent: 'space-between',

  },
  pic: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 270,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 15,

  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontWeight: '400',
    color: '#666',
    fontSize: 12,
	marginLeft: 14
  },
  icon:{
    height: 28,
    width: 28, 
  },
	textInputTwo: {
		marginBottom: 30,
		padding: 14,
		backgroundColor: "white",
		padding: 10,
		color: "black"
	},
	post: {
		padding: 10
	},
	postModal: {
		padding: 10,
		backgroundColor: "white"
	},
  header:{
    backgroundColor: "#00BFFF",
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
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
	box: {
		width: 70, 
		height: 70, 
		borderRadius: 60 / 2, 
		marginLeft: 6, 
		marginRight: 6,
		marginTop: 10,
		marginBottom: 5
	}
})
const mapStateToProps = state => {
	console.log(state);
	return {
		profilePic: state.auth.authenticated.profilePic
	}
}
 
export default connect(mapStateToProps, { authenticated })(DashboardAfterAuth);