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
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

const URL = "http://recovery-social-media.ngrok.io";

class FriendsListSubComponent extends Component {
constructor(props) {
  super(props);

  this.state = {
  	friends: []
  };
}
	componentDidMount() {
      axios.post(`${URL}/get/user/by/username`, {
        username: this.props.username === this.props.user.username ? this.props.username : this.props.user.username
      }).then((res) => {
        console.log("EQUITY :", res.data);
        for (let i = 0; i < res.data.user.confirmedFriendsList.length; i++) {
          let friend = res.data.user.confirmedFriendsList[i];
          console.log("FRIEND.... ----- :", friend);

          axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
            username: friend.acceptedUser
          }).then((resolution) => {
            console.log("resolution :", resolution.data);
            const picture = resolution.data.user.profilePic[resolution.data.user.profilePic.length - 1].picture;
            // append picture to object
            friend["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

            friend["fullName"] = resolution.data.user.fullName;

            this.setState({
              friends: [friend, ...this.state.friends]
            })
          }).catch((err) => {
            console.log("FAILURE :", err);
          })
        }
      }).catch((err) => {
        console.log(err);
      });
	}
  visitFriend = (friend) => {
    console.log("visit friend... --- :", friend)
  }
	render() {
    console.log("THIS props :", this.props);
		return (
			<Fragment>
				<View style={{ marginBottom: 100, marginLeft: 10, marginRight: 10 }}>
					<Text style={this.props.dark_mode ? { textAlign: "left", fontSize: 30, color: "white", fontWeight: "bold" } : { textAlign: "left", fontSize: 30, fontWeight: "bold" }}>Friends</Text>
					<Text style={this.props.dark_mode ? { textAlign: "left", fontSize: 20, color: "white" } : { textAlign: "left", fontSize: 20 }}>452 Friends</Text>
            {this.state.friends ? <FlatList
                  contentContainerStyle={{ alignSelf: 'flex-start' }}
                  numColumns={3}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.friends.slice(0, 6)} 
                  renderItem={({ item, index }) => {
                    let split = item.fullName.split(" ");
                    console.log("ITEMMMMMMM :", item);
                    return (
                      <TouchableOpacity style={styles.touchable} onPress={() => {
                        this.visitFriend(item);
                      }}>
                      <ImageBackground source={{uri: item.picture }} style={{ height: 100 }}>
                          <View style={styles.bodyContent}>

                            
                          </View>
                      </ImageBackground>
                      <View style={{ backgroundColor: "white", paddingLeft: 4, paddingRight: 4, minHeight: 45 }}>
                          <Text style={styles.info}>{split[0].slice(0, 8)}{split[0].length > 8 ? ".." : null} {split[1].slice(0, 8)}{split[1].length > 8 ? ".." : null}</Text>
                      </View>
                      </TouchableOpacity>
                    );
              }}
              /> : null}
					<NativeButton onPress={() => {
						this.props.navigation.navigate("friends-list");
					}} style={styles.seeMore}>
						<NativeText style={this.props.dark_mode ?  { color: "white", fontSize: 20 } : { color: "white", fontSize: 20 }}>See All Friends</NativeText>
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
  	backgroundColor: "#858AE3", 
  	alignItems: "center", 
  	justifyContent: "center", 
  	alignContent: "center",
  	borderWidth: 4, 
  	borderColor: "black"
  }
});

const mapStateToProps = state => {
  return {
    username: state.auth.authenticated.username,
    dark_mode: state.mode.dark_mode
  }
}

export default connect(mapStateToProps, {  })(FriendsListSubComponent);

