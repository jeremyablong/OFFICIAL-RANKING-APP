import React, { Component, Fragment } from 'react';
import { View, Text, Image, Dimensions, ScrollView, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Separator, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import NavigationDrawer from "../../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';

const { height, width } = Dimensions.get("window");

class ReviewPostWall extends Component {
constructor(props) {
  super(props);

  this.state = {
  	isOpen: false,
  	data: [
        {id:1, title: "Quality Post", image: require("../../../../assets/icons/emoji-1.png")},
        {id:2, title: "Funny Post", image: require("../../../../assets/icons/share-share.png")} ,
        {id:3, title: "Unique Post", image: require("../../../../assets/icons/ethics.png")} ,
        {id:4, title: "Funny", image: require("../../../../assets/icons/smile.png")} ,
        {id:5, title: "Happy I Saw This", image: require("../../../../assets/icons/magnet.png")} ,
        {id:6, title: "Interesting Post", image: require("../../../../assets/icons/phoney.png")} ,
        {id:7, title: "Agree With Post", image: require("../../../../assets/icons/invite.png")} ,
        {id:8, title: "Logical - Made Sense", image: require("../../../../assets/icons/easy-return.png")} ,
        {id:9, title: "Intellectual Thinking",image: require("../../../../assets/icons/charm.png")} ,
        {id:10, title: "Open-Minded Post",image: require("../../../../assets/icons/phone-set.png")}
      ], 
    selected: [],
    post: null
  };
} 
	componentDidMount() {
	  this.setState({
	  	post: this.props.route.params.post
	  })
	}
 	select = (item) => {
	  	console.log("clicked...");
	  	this.setState({
			selected: [...this.state.selected, item]
	  	})
  	}
  	uncheckSelection = (item) => {
	  	console.log("uncheck.")
	  	const filtered = this.state.selected.filter((x) => {
	  		if (x.id !== item.id) {
				return x;
	  		}
	  	});
	  	this.setState({
	  		selected: filtered
	  	})
  	}
	render() {
		console.log("this.propies :", this.props);
		console.log("this.statsies :", this.state);
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
			              <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/backkkk.png")}/>
			            </NativeButton>
			          </Left>
			          <Body>
			            <Title>Review Posting</Title>
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
					<ScrollView style={{ backgroundColor: "white", height, width }}>
						<View style={{ padding: 20 }}>
							<Text style={{ fontSize: 18 }}>What're some positive charectoristics you feel resonate from this posting?</Text>
					    </View>
				      <NativeButton style={{ justifyContent: "center", backgroundColor: "#858AE3" }} onPress={() => {
				        console.log("pressed...");
				        this.props.navigation.navigate("rank-post-page-two", { selected: this.state.selected, post: this.state.post });
				      }}>
				        <NativeText style={{ fontSize: 22, fontWeight: "bold" }}>Continue To Next Page</NativeText>
				      </NativeButton>
				        <FlatList style={styles.list}
				          contentContainerStyle={styles.listContainer}
				          data={this.state.data}
				          horizontal={false} 
				          numColumns={2}
				          keyExtractor= {(item) => {
				            return item.id;
				          }}
				          renderItem={({item}) => {
				          	let selected = false;
				            for (var i = 0; i < this.state.selected.length; i++) {
				            	let element = this.state.selected[i];
				            	if (element.id === item.id) {
				            		console.log("item :", item);
				            		selected = true;
				            	}
				            }
				            return (
				              <View>
				                <TouchableOpacity style={selected === true ? styles.cardBlue : styles.card} onPress={() => {
									this.select(item);
				                }}>
				                  <Image style={styles.cardImage} source={item.image}/>
				                </TouchableOpacity>
								
				                <View style={styles.cardHeader}>
				                  <View style={{alignItems:"center", justifyContent:"center"}}>
				                  {selected === true ? <TouchableOpacity onPress={() => {
				                  	this.uncheckSelection(item);
				                  }} style={{ position: "absolute", top: -30 }}>
									<Image source={require("../../../../assets/icons/close.png")} style={{ width: 25, height: 25 }} />
								  </TouchableOpacity> : null}
				                    <Text style={styles.title}>{item.title.length > 1 ? item.title.replace(" ", "\n") : item.title}</Text>
				                  </View>
				                </View>
				              </View>
				            )
				          }}/>
				          <NativeButton style={{ justifyContent: "center", backgroundColor: "#858AE3" }} onPress={() => {
				            console.log("pressed...");
				            this.props.navigation.navigate("rank-post-page-two", { selected: this.state.selected, post: this.state.post });
				          }}>
				            <NativeText style={{ fontSize: 22, fontWeight: "bold" }}>Continue To Next Page</NativeText>
				          </NativeButton>
					</ScrollView>
				</SideMenu>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	cardBlue: {
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
	    backgroundColor:"#858AE3",
	    //flexBasis: '42%',
	    width:120,
	    height:120,
	    borderRadius:60,
	    alignItems:'center',
	    justifyContent:'center'
	},
  container:{
    flex:1,
    backgroundColor:'#f6f6f6',
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor:"#f6f6f6",
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
    fontSize:26,
    textAlign: "center",
    fontWeight: "bold",
    flex:1,
    alignSelf:'center',
    color:"#696969"
  },
});  

export default ReviewPostWall;