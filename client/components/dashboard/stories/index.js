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
	]
  };
}
	clickEventListener = () => {
		console.log("clicked.");
    this.props.navigation.navigate("story-individual");
	}
	render() {
		return (
			<Fragment>
				<ScrollView style={{ backgroundColor: "#e31b39" }} horizontal={true}>
					<FlatList  
						horizontal
				        data={this.state.stories}
				        renderItem={({ item }) => {
							return (
								<TouchableOpacity style={styles.card} onPress={() => {
									this.clickEventListener(item)
								}}>
								<ImageBackground imageStyle={{ borderRadius: 35 }} style={{ height: 250 }} source={{ uri: item.picture }}>
				                <View style={styles.cardHeader}>
				                  <Image style={styles.icon} source={{uri:"https://img.icons8.com/flat_round/64/000000/hearts.png"}}/>
				                </View>
				                {/*<Image style={styles.userImage} source={require("../../../assets/icons/eye.png")}/>*/}
				                <View style={styles.cardFooter}>
				                  <View style={{ alignItems:"center", justifyContent:"center" }}>
				                    <Text style={styles.name}>{item.name}</Text>
				                    {/*<Text style={styles.position}>{item.position}</Text>*/}
				                    <TouchableOpacity style={styles.followButton} onPress={() => {
				                    	this.clickEventListener(item)
				                    }}>
				                      <Text style={styles.followButtonText}>View</Text>  
				                    </TouchableOpacity>
				                  </View>
				                </View>
				                </ImageBackground>
				              </TouchableOpacity>
							);
				        }} 
				        keyExtractor={item => item.id}
				    />
				</ScrollView>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
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
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.87,
    shadowRadius: 7.49,
    elevation: 22,

    marginVertical: 5,
    flexBasis: '46%',
    marginHorizontal: 5,
    paddingRight: 10,
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
    fontWeight:'bold'
  },
  position:{
    fontSize:14,
    flex:1,
    alignSelf:'center',
    color:"#696969"
  },
  followButton: {
    marginTop:100,
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

export default StoriesComponent;