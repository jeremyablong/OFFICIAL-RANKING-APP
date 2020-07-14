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
import { Container, Header, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, Footer, FooterTab } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from "react-redux";
import axios from "axios";

const { width, height } = Dimensions.get("window");

class StoriesComponent extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  	stories: [
  		{ name: "Jeremy Blong", picture: "https://s3.us-west-1.wasabisys.com/recovery-social-media-dating/00c556fb-4b85-4c24-b7d1-34fba4d313cd", id: 0 },
  		{ name: "Jeremy Blong", picture: "https://s3.us-west-1.wasabisys.com/recovery-social-media-dating/00c556fb-4b85-4c24-b7d1-34fba4d313cd", id: 1 },
  		{ name: "Roger Smith", picture: "https://s3.us-west-1.wasabisys.com/recovery-social-media-dating/00450ae7-e66d-4f9f-9f20-504b89542749", id: 2 },
  		{ name: "Donald Trump", picture: "https://s3.us-west-1.wasabisys.com/recovery-social-media-dating/03b62d4c-d1a0-480b-bd4e-37efa0a4f1c6", id: 3 },
  		{ name: "Bernie Sanders", picture: "https://s3.us-west-1.wasabisys.com/recovery-social-media-dating/00c556fb-4b85-4c24-b7d1-34fba4d313cd", id: 4 },
  		{ name: "Rodreguez Smith", picture: "https://s3.us-west-1.wasabisys.com/recovery-social-media-dating/00c556fb-4b85-4c24-b7d1-34fba4d313cd", id: 5 },
  		{ name: "Sarah Halter", picture: "https://s3.us-west-1.wasabisys.com/recovery-social-media-dating/00450ae7-e66d-4f9f-9f20-504b89542749", id: 6 },
  		{ name: "Jessica Smith", picture: "https://s3.us-west-1.wasabisys.com/recovery-social-media-dating/00c556fb-4b85-4c24-b7d1-34fba4d313cd", id: 7 },
  		{ name: "Johnny Doe", picture: "https://s3.us-west-1.wasabisys.com/recovery-social-media-dating/00450ae7-e66d-4f9f-9f20-504b89542749", id: 8 },
  		{ name: "Jeremy Blong", picture: "https://s3.us-west-1.wasabisys.com/recovery-social-media-dating/00c556fb-4b85-4c24-b7d1-34fba4d313cd", id: 9 },
  	],
    user: null,
    picture: null
  };
}
	clickEventListener = () => {
		console.log("clicked.");
    this.props.navigation.navigate("story-individual");
	}
  componentDidMount() {
    const URL = "http://recovery-social-media.ngrok.io";
    axios.post(`${URL}/get/user/by/username`, {
      username: this.props.username
    }).then((res) => {
      console.log("res.data", res.data);
      const picture = res.data.user.profilePic[res.data.user.profilePic.length - 1].picture;

      this.setState({
        user: res.data.user,
        picture: `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`
      })
    }).catch((err) => {
      console.log(err);
    });
  } 
  createStory = () => {
    console.log("create story...");
  }
	render() {
    console.log("dis state... :", this.state);
		return (
			<Fragment>
				<ScrollView style={this.props.dark_mode ? { backgroundColor: "black" } : { backgroundColor: "white" }} horizontal={true}>
          {this.state.user !== null ? <TouchableOpacity style={styles.cardTwo} onPress={() => {
            this.createStory();
          }}>
          <ImageBackground imageStyle={{ borderRadius: 25 }} style={this.props.dark_mode ? styles.firstBackgroundDark : styles.firstBackground} source={{ uri: this.state.picture }}>
              <View style={styles.cardHeader}>
                <Image style={styles.iconTwo} source={{uri: this.state.picture }}/>
              </View>
              {/*<Image style={styles.userImage} source={require("../../../assets/icons/eye.png")}/>*/}
              <View style={styles.cardFooter}>
                <View style={{ alignItems:"center", justifyContent:"center" }}>
                  <Image style={{ height: 40, width: 40, tintColor: "#97DFFC", marginBottom: 75, borderWidth: 5, borderColor: "white", borderRadius: 60, backgroundColor: "black" }} source={require("../../../assets/icons/addd.png")} />
                  <Text style={this.props.dark_mode ? styles.createStoryTextDark : styles.createStoryText}>Create A Story</Text>
                </View>
              </View>
              </ImageBackground>
             
            </TouchableOpacity> : null}
					<FlatList style={{ paddingLeft: 5 }}
						horizontal
				        data={this.state.stories}
				        renderItem={({ item }) => {
							return (
								<TouchableOpacity style={styles.card} onPress={() => {
									this.clickEventListener(item)
								}}>
                
								<ImageBackground imageStyle={{ borderRadius: 25 }} style={this.props.dark_mode ? styles.darkModeBackground : styles.backBack} source={{ uri: item.picture }}>
                <LinearGradient colors={['white', 'black']} style={styles.linearGradient}>
		                <View style={styles.cardHeader}>
		                  <Image style={styles.icon} source={{uri:"https://img.icons8.com/flat_round/64/000000/hearts.png"}}/>
		                </View>
		                {/*<Image style={styles.userImage} source={require("../../../assets/icons/eye.png")}/>*/}
		                <View style={styles.cardFooter}>
		                  <View style={{ alignItems:"center", justifyContent:"center" }}>
		                    
		                    {/*<Text style={styles.position}>{item.position}</Text>*/}
		                    <TouchableOpacity style={styles.followButton} onPress={() => {
		                    	this.clickEventListener(item)
		                    }}>
		                      <Text style={styles.followButtonText}>View</Text>  
		                    </TouchableOpacity>
		                  </View>
		                </View>
                    
                     </LinearGradient>
                     <Text style={styles.nameBottom}>{item.name}</Text>
		                </ImageBackground>
                   
		              </TouchableOpacity>
							);
				        }} 
				        keyExtractor={item => item.id}
				    />
            
				</ScrollView>
        <View style={this.props.dark_mode ? styles.containerBtnDark : styles.containerBtn}>
          <NativeButton style={styles.middle}>
            <NativeText style={{ color: "white" }}>View All Stories</NativeText>
          </NativeButton>
        </View>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  firstBackgroundDark: {
    height: 125, 
    maxHeight: 125, 
    width: 125,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    borderRadius: 25,
    shadowOpacity: 0.87,
    shadowRadius: 7.49,
    elevation: 22
  },
  firstBackground: {
    height: 125, 
    maxHeight: 125, 
    width: 125,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    borderRadius: 25,
    shadowOpacity: 0.87,
    shadowRadius: 7.49,
    elevation: 22
  },
  darkModeBackground: {
    height: 200, 
    width: 125,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    borderRadius: 25,
    shadowOpacity: 0.87,
    shadowRadius: 3.49,
    elevation: 22,
  },
  backBack: { 
    height: 200, 
    width: 125,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    borderRadius: 25,
    shadowOpacity: 0.87,
    shadowRadius: 7.49,
    elevation: 22,
  },
  createStoryTextDark: {
    color: "white",
    fontSize: 25, 
    textAlign: "center", 
    fontWeight: "bold"
  },
  containerBtn: {
    justifyContent: "center", 
    alignItems: "center", 
    alignContent: "center",
    backgroundColor: "white"
  },
  containerBtnDark: {
    justifyContent: "center", 
    alignItems: "center", 
    alignContent: "center",
    backgroundColor: "black",
    paddingBottom: 20
  },
  middle: {
    width: width * 0.90, 
    backgroundColor: "#858AE3", 
    justifyContent: "center", 
    alignItems: "center", 
    alignContent: "center",
    borderWidth: 3,
    borderColor: "black"
  },
  createStoryText: {
    fontSize: 25, 
    textAlign: "center", 
    color: "black", 
    fontWeight: "bold"
  },
  cardTwo: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    borderRadius: 25,
    shadowOpacity: 0.87,
    shadowRadius: 7.49,
    elevation: 22,
    height: 200,
    marginVertical: 5,
    flexBasis: '46%',
    marginHorizontal: 5,
    paddingRight: 5,
    paddingTop: 15, 
    paddingBottom: 15
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    opacity: 0.6,
    borderRadius: 25
  },
  nameBottom: {
    bottom: 12,
    color: "white",
    position: "absolute",
    left: 9,
    fontWeight: "bold",
    fontSize: 15
  },
  container:{
    flex:1,
    marginTop:20,
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor:"#E6E6E6",
  },
  listContainer:{
   alignItems:'center'
  },
  /******** card **************/
  card:{
    marginVertical: 5,
    flexBasis: '46%',
    marginHorizontal: 5,
    paddingRight: 5,
    paddingTop: 15, 
    paddingBottom: 15
  },
  cardFooter: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems:"center", 
    justifyContent:"center"
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  userImage:{
    height: 120,
    width: 120,
    borderRadius:60,
    alignSelf:'center',
    borderColor:"#DCDCDC",
    borderWidth:3,
  },
  name:{
    fontSize:18,
    alignSelf:'center',
    color:"white",
    fontWeight:'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 7
  },
  position:{
    fontSize:14,
    flex:1,
    alignSelf:'center',
    color:"#696969"
  },
  followButton: {
    marginTop:20,
    height:35,
    width:100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 3
  },
  followButtonText:{
    color: "#FFFFFF",
    fontSize:20,
  },
  icon:{
    height: 20,
    width: 20, 
  }
});   
const mapStateToProps = state => {
  return {
    username: state.auth.authenticated.username,
    dark_mode: state.mode.dark_mode
  }
}  

export default connect(mapStateToProps, {  })(StoriesComponent);