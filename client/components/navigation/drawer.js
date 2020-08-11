import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList, 
  Dimensions
} from 'react-native';
import { connect } from "react-redux";
import { Text as NativeText, Button as NativeButton } from "native-base";

const { width, height } = Dimensions.get("window");

class NavigationDrawer extends Component {
constructor(props) {
  super(props);

  this.state = {
    data: [
        {id: 1, route: "rank-nearby-users", title: "Rank People In Your Proximity", image: require("../../assets/icons/review.png") },
        { id: 2, route: "social-ranking-stats", title: "View Social Ranking Statistics", image: require("../../assets/icons/first.png") } ,
        {id: 3, route: "live-stream-start", title: "Start Live-Stream", image: require("../../assets/icons/live-news.png") } ,
        {id: 4, route: "dashboard", title: "Social Ranking Repair", image: require("../../assets/icons/repair.png") } ,
        {id: 5, route: "dashboard", title: "Edit Profile", image: require("../../assets/icons/user.png") },
        {id: 6, route: "dashboard", title: "Privacy Shortcuts", image: require("../../assets/icons/privacy.png") } ,
        {id: 7, route: "dating-homepage", title: "Dating", image: require("../../assets/icons/online-dating.png") } ,
        {id: 8, route: "dashboard", title: "View Friends", image: require("../../assets/icons/sport-team.png") } ,
        {id:9, title: "Sign-Out", image: require("../../assets/icons/logout.png") } ,
        // {id:9, title: "Option 9", image:"https://img.icons8.com/color/70/000000/coworking.png"} ,
        // {id:9, title: "Option 10",image:"https://img.icons8.com/nolan/70/000000/job.png"} ,
    ]	
  };
}
	render() {
    console.log(this.props.open);
		return (
			<Fragment>	
				<View style={styles.container}>
              
			        <FlatList style={this.props.dark_mode ? styles.listDark : styles.list}
			          contentContainerStyle={styles.listContainer}
			          data={this.state.data}
			          horizontal={false}
			          numColumns={1}
			          keyExtractor= {(item) => {
			            return item.id;
			          }}
			          renderItem={({item}) => {
			            return (
			              <View>
			                <TouchableOpacity style={styles.card} onPress={() => {
			                	console.log("navigation clicked...");
			                	this.props.navigation.navigate(item.route);
			                }}>
			                  <Image style={styles.cardImage} source={item.image}/>
			                </TouchableOpacity>

			                <View style={styles.cardHeader}>
			                  <View style={{alignItems:"center", justifyContent:"center"}}>
			                    <Text style={styles.title}>{item.title}</Text>
			                  </View>
			                </View>
			              </View>
			            )
			          }}/>
			      </View>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#f6f6f6',
  },
  listDark: {
    paddingHorizontal: 5,
    backgroundColor:"black",
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor:"#4E148C",
  },
  listContainer:{
    alignItems:'center'
  },
  /******** card **************/
  card:{
    shadowColor: '#474747',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
    marginVertical: 20,
    marginHorizontal: 40,
    backgroundColor:"#e2e2e2",
    //flexBasis: '42%',
    width:120,
    height:120,
    borderRadius:60,
    alignItems:'center',
    justifyContent:'center'
  },
  cardHeader: {
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
  cardFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage:{
    height: 50,
    width: 50,
    alignSelf:'center'
  },
  title:{
    fontSize:18,
    flex:1,
    alignSelf:'center',
    color:"white"
  },
});  
const mapStateToProps = state => {
  return {
    dark_mode: state.mode.dark_mode
  }
}

export default connect(mapStateToProps, { })(NavigationDrawer);