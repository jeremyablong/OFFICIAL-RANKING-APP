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
  FlatList
} from 'react-native';
import axios from "axios";
import { Button as NativeButton, Text as NativeText } from 'native-base';



const { width, height } = Dimensions.get("window");

const URL = "http://recovery-social-media.ngrok.io";

class FriendsListSubComponent extends Component {
constructor(props) {
  super(props);

  this.state = {
  	data: []
  };
}
	componentDidMount() {
		axios.get(`${URL}/gather/all/profiles`).then((res) => {
          	console.log("ppppppp :", res.data);
          	this.setState({
          		data: res.data
          	})
        }).catch((err) => {
          console.log(err);
        });
	}
	render() {
		return (
			<Fragment>
				<View style={{ marginBottom: 100, marginLeft: 10, marginRight: 10 }}>
					<Text style={{ textAlign: "left", fontSize: 30, fontWeight: "bold" }}>Friends</Text>
					<Text style={{ textAlign: "left", fontSize: 20 }}>452 Friends</Text>
		                <FlatList
					        contentContainerStyle={{alignSelf: 'flex-start'}}
					        numColumns={3}
					        showsVerticalScrollIndicator={false}
					        showsHorizontalScrollIndicator={false}
					        data={this.state.data.slice(0, 6)} 
					        renderItem={({ item, index }) => {
					        	let split = item.fullName.split(" ");
					            console.log("ITEMMMMMMM :", split);
					            return (
									<TouchableOpacity style={styles.touchable} onPress={() => {
										{/*this.clickEventListener(item);*/}

									}}>
								    <ImageBackground source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${item.profilePic[item.profilePic.length - 1].picture}` }} style={{ height: 100 }}>
							            <View style={styles.bodyContent}>

							              
							            </View>
							        </ImageBackground>
							        <View style={{ backgroundColor: "white", paddingLeft: 4, paddingRight: 4, minHeight: 45 }}>
						                <Text style={styles.info}>{split[0].slice(0, 8)}{split[0].length > 8 ? ".." : null} {split[1].slice(0, 8)}{split[1].length > 8 ? ".." : null}</Text>
						            </View>
					              </TouchableOpacity>
					            );
					        }}
					    />
					<NativeButton onPress={() => {
						this.props.navigation.navigate("friends-list");
					}} style={styles.seeMore}>
						<NativeText style={{ color: "white", fontSize: 20 }}>See All Friends</NativeText>
					</NativeButton>
				</View>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  info:{
    fontSize: 17,
    color: "#696969"
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
  seeMore: {
  	width: width * 0.95, 
  	marginTop: 20,
  	backgroundColor: "grey", 
  	alignItems: "center", 
  	justifyContent: "center", 
  	alignContent: "center",
  	borderWidth: 4, 
  	borderColor: "black"
  }
})

export default FriendsListSubComponent;