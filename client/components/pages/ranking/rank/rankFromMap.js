import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';


class RankFromMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {id:1, title: "Polite", image: require("../../../../assets/icons/emoji-1.png")},
        {id:2, title: "Courteous", image: require("../../../../assets/icons/share-share.png")} ,
        {id:3, title: "Honest", image: require("../../../../assets/icons/ethics.png")} ,
        {id:4, title: "Funny", image: require("../../../../assets/icons/smile.png")} ,
        {id:5, title: "Attractive", image: require("../../../../assets/icons/magnet.png")} ,
        {id:6, title: "Good Conversation", image: require("../../../../assets/icons/phoney.png")} ,
        {id:7, title: "Approachable", image: require("../../../../assets/icons/invite.png")} ,
        {id:8, title: "Articulate", image: require("../../../../assets/icons/easy-return.png")} ,
        {id:9, title: "Charismatic",image: require("../../../../assets/icons/charm.png")} ,
        {id:10, title: "Talkative",image: require("../../../../assets/icons/phone-set.png")}
      ],
     selected: []
    };
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
  	console.log(this.props);
    const custom = this.props.route.params.user;
    return (
      <View style={styles.container}>
        <Header>
	      <Left>
	      	<NativeButton onPress={() => {
	        	console.log("clicked user interface...");
	            this.props.navigation.navigate("rank-nearby-users");
	        }} hasText transparent>
	          <NativeText style={{ color: "black" }}>Back</NativeText>
	        </NativeButton>
	      </Left>
	      <Body>
	        <Title>Review</Title>
	      </Body>
	      <Right>
	        <NativeButton onPress={() => {
	          this.props.navigation.navigate("dashboard");
	        }} hasText transparent>
	          <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/construction.png")}/>
	        </NativeButton>
	      </Right>
	    </Header>
	    <View style={{ padding: 20 }}>
			<Text style={{ fontSize: 18 }}>What're some positive charectoristics of this person you interacted with?</Text>
	    </View>
      <NativeButton style={{ justifyContent: "center", backgroundColor: "#858AE3" }} onPress={() => {
        console.log("pressed...");
        this.props.navigation.navigate("review-rate-nearby", { selected: this.state.selected, user: this.props.route.params.user });
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
            this.props.navigation.navigate("review-rate-nearby", { selected: this.state.selected, user: custom });
          }}>
            <NativeText style={{ fontSize: 22, fontWeight: "bold" }}>Continue To Next Page</NativeText>
          </NativeButton>
      </View>
    );
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

export default RankFromMap;