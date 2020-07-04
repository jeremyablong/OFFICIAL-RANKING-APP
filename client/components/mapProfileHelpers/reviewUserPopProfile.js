import React, { Fragment, Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  ImageBackground,
  FlatList, 
  Button
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import SlidingUpPanel from 'rn-sliding-up-panel';
import axios from "axios";
import moment from "moment";

const { width, height } = Dimensions.get("window");

class ReviewUserPopProfile extends Component {
constructor(props) {
  super(props);

  this.state = {
	individual: null,
	reversed: [],
	data:[
        {id:1, image: "https://bootdey.com/img/Content/avatar/avatar1.png", name:"Frank Odalthh",    comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:2, image: "https://bootdey.com/img/Content/avatar/avatar6.png", name:"John DoeLink",     comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:3, image: "https://bootdey.com/img/Content/avatar/avatar7.png", name:"March SoulLaComa", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:4, image: "https://bootdey.com/img/Content/avatar/avatar2.png", name:"Finn DoRemiFaso",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:5, image: "https://bootdey.com/img/Content/avatar/avatar3.png", name:"Maria More More",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:6, image: "https://bootdey.com/img/Content/avatar/avatar4.png", name:"Clark June Boom!", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:7, image: "https://bootdey.com/img/Content/avatar/avatar5.png", name:"The googler",      comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
      ],
  ready: false,
  count: 0,
  replies: []
  };
}
	componentDidMount() {
	  this.setState({
	  	reversed: this.props.user.profilePic.slice(0).reverse(),
      ready: true
	  })
	}
	renderContent = () => {
		const user = this.props.user;

		if (user.coverPhoto) {
			return (
				<ImageBackground source={{ uri: `https://s3.us-west-1.wasabisys.com/rating-people/${user.coverPhoto}` }} style={{ height: 350 }}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${user.profilePic[user.profilePic.length - 1].picture}` }}/>
                <Text style={styles.name}>
                  {user.username}
                </Text>
            </View> 
        </ImageBackground>
			);
		} else {
			 return (
				<View style={styles.header}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${user.profilePic[user.profilePic.length - 1].picture}` }}/>
                <Text style={styles.name}>
                  {user.username}
                </Text>
            </View> 
        </View>
			 );
		}
	}
	showPanel = (data) => {
		console.log("data :", data);
	}
  addPictureToItems= () => {
    this.setState({
      count: 0, 
      replies: []
    })
    if (this.state.individual.replies) {
      const reversed = this.state.individual.replies;
      reversed.map((each, index) => {
        console.log("each", each);
        axios.post("http://recovery-social-media.ngrok.io/get/user/by/username", {
          username: each.poster
        }).then((res) => {
          console.log("resolution :", res.data);
          
          const picture = res.data.user.profilePic[res.data.user.profilePic.length - 1].picture;
          // append picture to object
          each["picture"] = `https://s3.us-west-1.wasabisys.com/rating-people/${picture}`;

          this.setState({
            replies: [...this.state.replies, each]
          });

          if (res.data) {
            this.setState({
              count: this.state.count + 1
            }, () => {
              if (this.state.count === this.state.individual.replies.length) {
                this._panel.show();
              }
            })
          }
        
        }).catch((err) => {
          console.log("FAILURE :", err);
        })
      })
      
    } else {
      alert("This picture has no comments yet...")
      // this.setState({
      //   replies: [{
      //     comment: "There are no comments on this post yet...",
      //     date: "Monday, June 29th 2020, 1:26:46 pm",
      //     id: "dc593kd2-0518-44f7-93e9-9472kdla18f8",
      //     picture: "",
      //     poster: "System Message"
      //   }]
      // })
    }
  }
  renderComments = () => {
    const dates = this.state.replies.sort(function compare(a, b) {
      const dateeeA = moment(a.date, 'dddd, MMMM Do YYYY, h:mm:ss a').format();
      const dateeeB = moment(b.date, 'dddd, MMMM Do YYYY, h:mm:ss a').format();

      var dateA = new Date(dateeeA);
      console.log("date!", dateA)
      var dateB = new Date(dateeeB);
      return dateB - dateA;
    });

    return dates.map((comment, index) => {
      console.log("comm :", comment);
       return (
          <Fragment>
            <View style={styles.containerSpecial}>
              <TouchableOpacity onPress={() => {

              }}>
                <Image style={styles.image} source={{uri: comment.picture }}/>
              </TouchableOpacity>
              <View style={styles.content}>
                <View style={styles.contentHeader}>
                  <Text  style={styles.nameCustom}>{comment.poster}</Text>
                  
                </View>
                <Text rkType='primary3 mediumLine'>{comment.comment}</Text>
                  <Text style={{ textAlign: "left" }}>
                    {comment.date}
                  </Text>
              </View>
              
            </View>
            {comment.postedImage ? <Image style={styles.postedImage} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${comment.postedImage}` }}/> : null}
          </Fragment>
        );
    })
  }
	render() {
		console.log("THIS.state... :", this.state);
		const user = this.props.user;

		return (
			<Fragment>
				<ScrollView style={styles.containerMain}>
					
					{this.renderContent()}		         
					
			          <View style={styles.profileDetail}>
			            <View style={styles.detailContent}>
			              <Text style={styles.title}>Photos</Text>
			              <Text style={styles.count}>219</Text>
			            </View>
			            {/*<View style={styles.detailContent}>
			              <Text style={styles.title}>Followers</Text>
			              <Text style={styles.count}>200</Text>
			            </View>*/}
			            <View style={styles.detailContent}>
			              <Text style={styles.title}>Friends</Text>
			              <Text style={styles.count}>756</Text>
			            </View>
			          </View>
					<ScrollView>
						<View style={styles.container}>
					        <FlatList style={styles.list}
					          contentContainerStyle={styles.listContainer}
					          data={this.state.reversed}
					          horizontal={true}
					          numColumns={false}
					          keyExtractor= {(item) => {
					            return item.id;
					          }}
					          renderItem={({item}) => {
					          	console.log("special :", item);
					            return (
					            	<TouchableOpacity onPress={() => {
					            		this.setState({
					            			individual: item
					            		}, () => {
                            this.addPictureToItems();
					            		})
					            	}} style={styles.card}>
						                <ImageBackground style={{ width: 125, height: 125 }} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${item.picture}`}}>

						              	</ImageBackground>
					              	</TouchableOpacity>
					            )
					          }}/>
					      </View>
					</ScrollView>
					
			          <View style={styles.body}>
			            <View style={styles.bodyContent}>
			              <Text style={{ textAlign: "center", fontSize: 25, top: -15 }}>{user.fullName} has a social ranking of <Text style={{ color: "darkred", fontWeight: "bold" }}>579</Text></Text>
			              <NativeButton style={{ backgroundColor: "#999999",width: width * 0.95, justifyContent: "center", alignItems: "center", alignContent: "center" }} onPress={() => {
          							console.log("clicked user interface...");
          							 {/*this.props.navigation.navigate("chat-users");*/}
          							}} hasText>
          								<Text style={{ color: "white", fontSize: 22, fontWeight: "bold", paddingBottom: 10 }}>Review This User  <Image style={{ width: 40, height: 40, marginBottom: 10, marginTop: 15 }} source={require("../../assets/icons/review-two.png")}/>  </Text>
          							</NativeButton>
			              <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
			            </View>

			        </View>
			         
		      </ScrollView>
		      <SlidingUpPanel allowDragging={false} ref={c => this._panel = c}>
		            <View style={styles.containerSlide}>
		            <ScrollView style={{ marginTop: height * 0.40 }}>
		            <Button title='Hide' onPress={() => {
                  this._panel.hide();
                }} />
                {this.renderComments()}
                
                  {/*{this.state.comments.map((comment, index) => {
                    console.log("comm :", comment);
                     return (
                        <Fragment>
                          <View style={styles.containerSpecial}>
                            <TouchableOpacity onPress={() => {

                            }}>
                              <Image style={styles.image} source={{uri: comment.picture }}/>
                            </TouchableOpacity>
                            <View style={styles.content}>
                              <View style={styles.contentHeader}>
                                <Text  style={styles.nameCustom}>{comment.poster}</Text>
                                
                              </View>
                              <Text rkType='primary3 mediumLine'>{comment.comment}</Text>
                                <Text style={{ textAlign: "left" }}>
                                  {comment.date}
                                </Text>
                            </View>
                            
                          </View>
                          {comment.postedImage ? <Image style={styles.postedImage} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${comment.postedImage}` }}/> : null}
                        </Fragment>
                      );
                  })}*/}
		            <Button title='Hide' onPress={() => {
                  this._panel.hide()

                }} />
			            
		            </ScrollView>
		          </View>
		        </SlidingUpPanel>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
  postedImage: {
    width: width * 0.85,
    height: 350,
    marginLeft: width / 8
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: "center",
    backgroundColor: "black",
    marginTop: 40
  },
  root: {
    backgroundColor: "#ffffff",
    marginTop:10,
  },
  containerSpecial: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  image:{
    width:45,
    height:45,
    borderRadius:20,
    marginLeft:20
  },
  time:{
    fontSize:11,
    color:"#808080",
  },
  containerSlide: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container:{

  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: "#691F1F",
    paddingBottom: 30,
    paddingTop: 30,
    height: 250
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
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
    marginVertical: 20,
    marginHorizontal: 40,
    //flexBasis: '42%',
    width:60,
    height:60,
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
    color:"#696969"
  },
  header:{
    backgroundColor: "black",
    height: 350
  },
  headerContent:{
    padding:30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10
  },
  nameCustom:{
    fontSize:22,
    color:"black",
    fontWeight:'600'
  },
  profileDetail:{
    alignSelf: 'center',
    marginTop:250,
    alignItems: 'center',
    flexDirection: 'row',
    position:'absolute',
    backgroundColor: "#ffffff"
  },
  detailContent:{
    margin:10,
    alignItems: 'center'
  },
  title:{
    fontSize:20,
    color: "#00CED1"
  },
  count:{
    fontSize:18,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
    marginTop:40
  },
  textInfo:{
    fontSize:18,
    marginTop:20,
    color: "#696969",
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
    backgroundColor: "#00CED1",
  },
  description:{
    fontSize:20,
    color: "darkred",
    marginTop:10,
    textAlign: 'center'
  },
});

export default ReviewUserPopProfile;

