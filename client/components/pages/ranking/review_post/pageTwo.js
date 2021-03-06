import React, { Component, Fragment } from 'react';
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Text, Button as NativeButton, Header, Title, Right, Left, Body } from "native-base";
import { Rating, AirbnbRating } from 'react-native-ratings';
import axios from "axios";
import NavigationDrawer from "../../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import { connect } from "react-redux";

const URL = "http://recovery-social-media.ngrok.io";

class ReviewPostPageTwo extends Component {
constructor(props) {
  super(props);

  this.state = {
	selected: [],
	relatable: null,
	entertaining: null,
	offensive: null,
	respectful: null, 
	happy: null,
	overall: null
  };
}
	componentDidMount() {
	  this.setState({
	  	selected: this.props.route.params.selected
	  })
	}
	handleRatingSubmission = () => {
		console.log("handle submission...", this.props.username);

		const { relatable, entertaining, offensive, respectful, happy, overall } = this.state;

		const post = this.props.route.params.post;

		const selected = this.props.route.params.selected;

		let compliments = [];

		for (var i = 0; i < selected.length; i++) {
			
			let element = selected[i];

			console.log("elementtttt ----- element : ", element);

			compliments.push(element.title);
		}

		axios.post(`${URL}/post/ranking/wall/posting`, {
			relatable,
			entertaining, 
			offensive, 
			respectful, 
			happy, 
			overall,
			username: post.author,
			compliments, 
			post,
			reviewer: this.props.username
		}).then((res) => {
			if (res.data.message === "Successfully updated wall posting && user account...") {
				console.log(res.data);
				this.props.navigation.navigate("dashboard", { post });
				
			}
		}).catch((err) => {
			console.log(err);
		})
	}
	render() {
		console.log("this.props :", this.props);
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header>
		          <Left>
		            <NativeButton onPress={() => {
		              console.log("clicked.");
		              this.props.navigation.navigate("review-wall-posting");
		            }} hasText transparent>
		              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/backkkk.png")}/>
		            </NativeButton>
		          </Left>
		          <Body>
		            <Title>Review Post</Title>
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
				<ScrollView contentContainerStyle={{ paddingTop: 60, paddingBottom: 60 }} style={{ flex: 1, backgroundColor: "white" }}>
		          	<Text style={{ color: "darkred", fontSize: 25, textAlign: "center" }}>This post was <Text style={{ color: "blue", fontSize: 25 }}>relatable</Text>...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6} 
					  size={20}  
					  onFinishRating={(value) => {
					  	this.setState({
					  		relatable: value
					  	})
					  }} 
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10,
					  }}
					/>
					<Text style={{ color: "darkred", fontSize: 25, textAlign: "center" }}>This post was <Text style={{ color: "blue", fontSize: 25 }}>entertaining</Text>...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6}
					  size={20} 
					  onFinishRating={(value) => {
					  	this.setState({
					  		entertaining: value
					  	})
					  }}
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10
					  }}
					/>
					<Text style={{ color: "darkred", fontSize: 25, textAlign: "center" }}>This post was NOT <Text style={{ color: "blue", fontSize: 25 }}>offensive</Text>...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6}
					  size={20} 
					  onFinishRating={(value) => {
					  	this.setState({
					  		offensive: value
					  	})
					  }}
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10
					  }}
					/>
					<Text style={{ color: "darkred", fontSize: 25, textAlign: "center" }}>This post was <Text style={{ color: "blue", fontSize: 25 }}>respectful</Text>...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6}
					  size={20} 
					  onFinishRating={(value) => {
					  	this.setState({
					  		respectful: value
					  	})
					  }}
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10
					  }}
					/>
					<Text style={{ color: "darkred", fontSize: 25, textAlign: "center" }}>I'm <Text style={{ color: "blue", fontSize: 25 }}>happy</Text> I saw this post...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6}
					  size={20} 
					  onFinishRating={(value) => {
					  	this.setState({
					  		happy: value
					  	})
					  }}
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10
					  }}
					/>
					<Text style={{ color: "darkred", fontSize: 25, textAlign: "center" }}>I <Text style={{ color: "blue", fontSize: 25 }}>liked</Text> this post overall...</Text>
		            <AirbnbRating
					  count={11}
					  reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Perfection"]}
					  defaultRating={6}
					  size={20} 
					  onFinishRating={(value) => {
					  	this.setState({
					  		overall: value
					  	})
					  }}
					/>
					<View
					  style={{
					    borderBottomColor: 'black',
					    borderBottomWidth: 2,
					    marginTop: 10, 
					    marginBottom: 10
					  }}
					/>
		            
					
			        <NativeButton onPress={() => {
			        	this.handleRatingSubmission();
			        }} style={styles.viewPicturesBtnBlue}>
						<Text style={{ color: "white" }}>Submit Rating - Continue</Text>
			        </NativeButton>
			        <NativeButton onPress={() => {
			        	this.props.navigation.navigate("review-wall-posting");
			        }} style={{ backgroundColor: "#613DC1", justifyContent: "center", marginTop: 25 }}>
						<Text style={{ color: "white" }}>Go Back To Previous Page</Text>
			        </NativeButton>
		          </ScrollView>
		          </SideMenu>
			</Fragment>
		)
	}
}
const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username
	}
}
const styles = StyleSheet.create({
	viewPicturesBtnBlue: {
		backgroundColor: "#858AE3",
		justifyContent: "center"
	}
})
export default connect(mapStateToProps, {  })(ReviewPostPageTwo);