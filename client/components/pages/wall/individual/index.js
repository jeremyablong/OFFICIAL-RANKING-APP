import React, { Component, Fragment } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity, 
  Image,
  ImageBackground, 
  Dimensions, 
  ScrollView, 
  FlatList
} from 'react-native';
import { Header, Left, CardItem, Card, Body, Right, Thumbnail, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab } from 'native-base';
import NavigationDrawer from "../../../navigation/drawer.js";
import SideMenu from 'react-native-side-menu';
import ProgressiveImage from "../../../image/image.js";
import GallerySwiper from "react-native-gallery-swiper";

const { width, height } = Dimensions.get("window");

class IndividualWallPosting extends Component {
constructor(props) {
  super(props);

  this.state = {
  	data:[
        {id:1, image: "https://bootdey.com/img/Content/avatar/avatar1.png", name:"Frank Odalthh",    comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:2, image: "https://bootdey.com/img/Content/avatar/avatar6.png", name:"John DoeLink",     comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:3, image: "https://bootdey.com/img/Content/avatar/avatar7.png", name:"March SoulLaComa", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:4, image: "https://bootdey.com/img/Content/avatar/avatar2.png", name:"Finn DoRemiFaso",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:5, image: "https://bootdey.com/img/Content/avatar/avatar3.png", name:"Maria More More",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:6, image: "https://bootdey.com/img/Content/avatar/avatar4.png", name:"Clark June Boom!", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:7, image: "https://bootdey.com/img/Content/avatar/avatar5.png", name:"The googler",      comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
      ]  
    };
}
	renderContent = () => {
		const post = this.props.route.params.post; 

		switch (post.images.length) {
			case 1:
				return (
					<Card style={styles.shadow}>
			            <CardItem>
			              <Left>
			                <Thumbnail source={{uri: post.picture }} />
			                <Body>
			                  <NativeText>{post.author}</NativeText>
			                  <NativeText note>{post.date}</NativeText>
			                </Body>
			              </Left>
			            </CardItem>
			            {post.text ? <CardItem>
			              <Body>
			                <Image source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[0]}` }} style={{height: height * 0.45, width: width * 0.90, flex: 1}}/>
			                <NativeText style={{ paddingTop: 10 }}>
			                  {post.text}
			                </NativeText>
			              </Body>
			            </CardItem> : null}
			            <CardItem>
							<Footer style={styles.footer}>
					          <FooterTab>
					            <NativeButton>
					              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
					            </NativeButton>
					            <NativeButton>
					              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
					            </NativeButton>
					            <NativeButton active>
					              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
					            </NativeButton>
					          </FooterTab>
					        </Footer>
			            </CardItem>
			          </Card>
				);
				break;
			case 2:
				return (
					<Card style={styles.shadow}>
			            <CardItem>
			              <Left>
			                <Thumbnail source={{uri: post.picture }} />
			                <Body>
			                  <NativeText>{post.author}</NativeText>
			                  <NativeText note>{post.date}</NativeText>
			                </Body>
			              </Left>
			            </CardItem>
			            <CardItem>
			              <Body>
			               <GallerySwiper  
			               		resizeMode={"contain"}
			               		style={{ maxHeight: height * 0.60 }}
					            images={[
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[0]}` },
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[1]}` }
					            ]}
					            onEndReached={() => {
									
					            }}
					        />
					        {post.text ? <NativeText style={{ paddingTop: 20 }}>
			                  {post.text}
			                </NativeText> : null}
			              </Body>
			            </CardItem>
			            <CardItem>
							<Footer style={styles.footer}>
					          <FooterTab>
					            <NativeButton>
					              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
					            </NativeButton>
					            <NativeButton>
					              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
					            </NativeButton>
					            <NativeButton active>
					              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
					            </NativeButton>
					          </FooterTab>
					        </Footer>
			            </CardItem>
			          </Card>
				);
				break;
			case 3:
				return (
					<Card style={styles.shadow}>
			            <CardItem>
			              <Left>
			                <Thumbnail source={{uri: post.picture }} />
			                <Body>
			                  <NativeText>{post.author}</NativeText>
			                  <NativeText note>{post.date}</NativeText>
			                </Body>
			              </Left>
			            </CardItem>
			            <CardItem>
			              <Body>
			               <GallerySwiper  
			               		resizeMode={"contain"}
			               		style={{ maxHeight: height * 0.60 }}
					            images={[
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[0]}` },
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[1]}` },
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[2]}` }
					            ]}
					            onEndReached={() => {
									
					            }}
					        />
					        {post.text ? <NativeText style={{ paddingTop: 20 }}>
			                  {post.text}
			                </NativeText> : null}
			              </Body>
			            </CardItem>
			            <CardItem>
							<Footer style={styles.footer}>
					          <FooterTab>
					            <NativeButton>
					              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
					            </NativeButton>
					            <NativeButton>
					              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
					            </NativeButton>
					            <NativeButton active>
					              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
					            </NativeButton>
					          </FooterTab>
					        </Footer>
			            </CardItem>
			          </Card>
				);
				break;
			case 4:
				return (
					<Card style={styles.shadow}>
			            <CardItem>
			              <Left>
			                <Thumbnail source={{uri: post.picture }} />
			                <Body>
			                  <NativeText>{post.author}</NativeText>
			                  <NativeText note>{post.date}</NativeText>
			                </Body>
			              </Left>
			            </CardItem>
			            <CardItem>
			              <Body>
			               <GallerySwiper  
			               		resizeMode={"contain"}
			               		style={{ maxHeight: height * 0.60 }}
					            images={[
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[0]}` },
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[1]}` },
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[2]}` },
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[3]}` }
					            ]}
					            onEndReached={() => {
									
					            }}
					        />
					        {post.text ? <NativeText style={{ paddingTop: 20 }}>
			                  {post.text}
			                </NativeText> : null}
			              </Body>
			            </CardItem>
			            <CardItem>
							<Footer style={styles.footer}>
					          <FooterTab>
					            <NativeButton>
					              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
					            </NativeButton>
					            <NativeButton>
					              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
					            </NativeButton>
					            <NativeButton active>
					              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
					            </NativeButton>
					          </FooterTab>
					        </Footer>
			            </CardItem>
			          </Card>
				);
				break;
			case 5:
				return (
					<Card style={styles.shadow}>
			            <CardItem>
			              <Left>
			                <Thumbnail source={{uri: post.picture }} />
			                <Body>
			                  <NativeText>{post.author}</NativeText>
			                  <NativeText note>{post.date}</NativeText>
			                </Body>
			              </Left>
			            </CardItem>
			            <CardItem>
			              <Body>
			               <GallerySwiper  
			               		resizeMode={"contain"}
			               		style={{ maxHeight: height * 0.60 }}
					            images={[
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[0]}` },
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[1]}` },
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[2]}` },
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[3]}` },
					                { uri: `https://s3.us-west-1.wasabisys.com/rating-people/${post.images[4]}` }
					            ]}
					            onEndReached={() => {
									
					            }}
					        />
					        {post.text ? <NativeText style={{ paddingTop: 20 }}>
			                  {post.text}
			                </NativeText> : null}
			              </Body>
			            </CardItem>
			            <CardItem>
							<Footer style={styles.footer}>
					          <FooterTab>
					            <NativeButton>
					              <NativeText><Image source={require("../../../../assets/icons/like.png")} style={styles.icon} />Like</NativeText>
					            </NativeButton>
					            <NativeButton>
					              <NativeText><Image source={require("../../../../assets/icons/chat.png")} style={styles.icon} />Comment</NativeText>
					            </NativeButton>
					            <NativeButton active>
					              <NativeText><Image source={require("../../../../assets/icons/fb-share.png")} style={styles.icon} />Share</NativeText>
					            </NativeButton>
					          </FooterTab>
					        </Footer>
			            </CardItem>
			          </Card>
				);
				break;
			default:
				return null;
				break;
		}
	}
	render() {
		const post = this.props.route.params.post; 
		console.log("this.props", this.props.route.params.post);
		const menu = <NavigationDrawer navigation={this.props.navigation}/>;
		return (
			<Fragment>
			<SideMenu isOpen={this.state.isOpen} menu={menu}>
				<Header>
				  <Left>
				    <NativeButton onPress={() => {
				      this.props.navigation.navigate("dashboard");
				    }} hasText transparent>
				      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/construction.png")}/>
				    </NativeButton>
				  </Left>
				  <Body>
				    <Title>Post</Title>
				  </Body>
				  <Right>
				    <NativeButton onPress={() => {
				    	console.log("clicked user interface...");
				         {/*this.props.navigation.navigate("chat-users");*/}
					    this.setState({
					    	isOpen: true
					    })
				    }} hasText transparent>
				      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../../assets/icons/user-interface.png")}/>
				    </NativeButton>
				  </Right>
				</Header>
				<ScrollView showsVerticalScrollIndicator={false} style={{ width, height, backgroundColor: "white" }}>
					{this.renderContent()}
					<FlatList
				        style={styles.root}
				        data={this.state.data}
				        extraData={this.state}
				        ItemSeparatorComponent={() => {
				          return (
				            <View style={styles.separator}/>
				          )
				        }}
				        keyExtractor={(item) => {
				          return item.id;
				        }}
				        renderItem={(item) => {
				          const Notification = item.item;
				          return(
				            <View style={styles.container}>
				              <TouchableOpacity onPress={() => {

				              }}>
				                <Image style={styles.image} source={{uri: Notification.image}}/>
				              </TouchableOpacity>
				              <View style={styles.content}>
				                <View style={styles.contentHeader}>
				                  <Text  style={styles.name}>{Notification.name}</Text>
				                  <Text style={styles.time}>
				                    9:58 am
				                  </Text>
				                </View>
				                <Text rkType='primary3 mediumLine'>{Notification.comment}</Text>
				              </View>
				            </View>
				          );
				        }}/>
				</ScrollView>
				</SideMenu>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	footer: {
		marginLeft: -20,
		width: width
	},
	icon: {
		width: 25, 
		height: 25
	},
	shadow: {
		flex: 0,
		shadowColor: "black",
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.00,

		elevation: 24
	},
  root: {
    backgroundColor: "#ffffff",
    marginTop:10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15
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
  name:{
    fontSize:16,
    fontWeight:"bold",
  },
})

export default IndividualWallPosting;