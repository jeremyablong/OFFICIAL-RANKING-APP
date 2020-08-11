import React, { Fragment, Component } from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView, 
  TextInput, 
  ImageBackground
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import PhotoUpload from 'react-native-photo-upload';
import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const URL = "http://recovery-social-media.ngrok.io";

export class UploadPicturesDating extends Component {
constructor(props) {
  super(props);

  this.state = {
  	numColumns:3,
    userSelected: {},
    modalVisible:false,
    data: [
        {id: 0,  image:"https://bootdey.com/img/Content/avatar/avatar1.png"}, 
        {id:1,  image:"https://bootdey.com/img/Content/avatar/avatar2.png"}, 
        {id:2,  image:"https://bootdey.com/img/Content/avatar/avatar3.png"}, 
        {id:3,  image:"https://bootdey.com/img/Content/avatar/avatar4.png"}, 
        {id:4,  image:"https://bootdey.com/img/Content/avatar/avatar5.png"}, 
        {id:5,  image:"https://bootdey.com/img/Content/avatar/avatar6.png"}, 
        {id:6,  image:"https://bootdey.com/img/Content/avatar/avatar7.png"}, 
        {id:7,  image:"https://bootdey.com/img/Content/avatar/avatar1.png"}, 
        {id:8,  image:"https://bootdey.com/img/Content/avatar/avatar2.png"}
    ],
    avatar: null,
    index: 0
  };
}
	handleClick = (item) => {
		console.log("clicked.", item);
		this.setState({
			index: item.id
		}, () => {
			this.RBSheet.open();
		})
	}
    setModalVisible = (visible) => {
    	this.setState({
    		modalVisible: visible
    	});
    }
    renderItem = ({item, index}) => {
	    if (item.empty === true) {
	      return <View style={[styles.item, styles.itemInvisible]} />;
	    }
	    var itemDimension = Dimensions.get('window').width / this.state.numColumns;
	    return (
	      <TouchableOpacity style={[styles.item, {height: itemDimension}]} onPress={() => {
	      	this.handleClick(item);
	      }}>
	        <Image style={{height:itemDimension - 2, width:itemDimension - 2}} source={{uri: item.image}}/>
	      </TouchableOpacity>
	    );
    }
  
    formatRow = (data, numColumns) => {
	    const numberOfFullRows = Math.floor(data.length / numColumns);
	    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
	    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
	      data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
	      numberOfElementsLastRow++;
	    }
	    return data;
    }
    handleSubmission = () => {

    	console.log("submitted.");

    	axios.post(`${URL}/upload/dating/picture`, {
    		username: this.props.username,
    		picture64: this.state.avatar
    	}).then((res) => {
    		console.log('res.data', res.data);
    		if (res.data.message === "Uploaded Image!") {

    			const arr = [...this.state.data];

    			arr[this.state.index] = { image: `https://s3.us-west-1.wasabisys.com/rating-people/${res.data.pictureID}` };

				this.setState({
					data: arr
				}, () => {
					this.RBSheet.close();
					console.log("this.stateeeeeeee :", this.state);
				})
    		}
    	}).catch((err) => {
    		console.log(err);
    	})
    }
	render() {
		console.log("STATE :", this.state);
		return (
			<Fragment>
				<Header style={{ width: width }}>
				  <Left>
				    <NativeButton onPress={() => {
				      this.props.navigation.navigate("profile-settings");
				    }} hasText transparent>
				     <NativeText>Back</NativeText>
				    </NativeButton>
				  </Left>
				  <Body>
				    <Title>Randomized</Title>
				  </Body>
				  <Right>
				    <NativeButton onPress={() => {
				    	console.log("clicked user interface...");
				    }} hasText transparent>
				      <NativeText>Need Help?</NativeText>
				    </NativeButton>
				    {/*<NativeButton onPress={() => {
				    	console.log("clicked chat...");
				    	this.props.navigation.navigate("chat-users");
				    }} hasText transparent>
				      <Image style={{ width: 45, height: 45, marginBottom: 10 }} source={require("../../../assets/icons/chat.png")}/>
				    </NativeButton>*/}
				  </Right>
				</Header>
				<View style={styles.container}>
				<View style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 30, padding: 15, marginBottom: 25, marginTop: 20 }}>
					<Text style={{ color: "white" }}>Select any of the boxes and select a picture to upload to your profile!</Text>
				</View>
			        <FlatList
			          data={this.formatRow(this.state.data, this.state.numColumns)}
			          keyExtractor= {(item) => {
			            return item.id;
			          }}
			          renderItem={this.renderItem}
			          numColumns={this.state.numColumns}/>

			        <Modal
			          animationType={'fade'}
			          transparent={true}
			          onRequestClose={() => {
			          	this.setState({
			          		modalVisible: false
			          	})
			          }}
			          visible={this.state.modalVisible}>

			          <View style={styles.popupOverlay}>
			            <View style={styles.popup}>
			              <View style={styles.popupContent}>
			                <ScrollView contentContainerStyle={styles.modalInfo}>
			                  <Image style={{width:200, height:200}} source={{uri: this.state.userSelected.image}}/>
			                </ScrollView>
			              </View>
			              <View style={styles.popupButtons}>
			                <TouchableOpacity onPress={() => {
			                	this.setState({
					          		modalVisible: false
					          	})
			                }} style={styles.btnClose}>
			                  <Text style={styles.txtClose}>Close</Text>
			                </TouchableOpacity>
			              </View>
			            </View>
			          </View>
			        </Modal>
			        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
						<NativeButton onPress={() => {
	 						this.handleSubmission();
	 					}} style={styles.buttonnn}>
							<NativeText style={{ color: "black" }}>Continue To Next Page...</NativeText>
	 					</NativeButton>
			        </View>
			        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 30, padding: 15, marginBottom: 25, top: -125 }}>
						<Text style={{ color: "white" }}>Select any of the boxes and select a picture to upload to your profile!</Text>
					</View>
			      </View>
				<RBSheet
		          ref={ref => {
		            this.RBSheet = ref;
		          }}
		          height={550}
		          openDuration={250}
		          customStyles={{
		            container: {
		              justifyContent: "center",
		              alignItems: "center"
		            }
		          }}
		        >
					<View style={{ marginTop: 50 }}>
						<Text style={{ fontWeight: "bold", textAlign: "center" }}>Select a photo to upload...</Text>
					</View>
		            <PhotoUpload
					   onPhotoSelect={avatar => {
					     if (avatar) {
					       console.log('Image base64 string: ', avatar);
					       this.setState({
					       	avatar
					       })
					     }
					   }}
					 >
					   <Image
					     style={{
					       paddingVertical: 30,
					       width: 150,
					       height: 150,
					       borderRadius: 75
					     }}
					     resizeMode='cover'
					     source={require("../../../../assets/icons/user.png")}
					   />
 					</PhotoUpload>

 					<NativeButton onPress={() => {
 						this.handleSubmission();
 					}} style={{ justifyContent: "center", backgroundColor: "#858AE3", width, marginBottom: 10 }}>
						<NativeText>Submit Photo Selection</NativeText>
 					</NativeButton>
 					<View style={{ marginTop: 10, marginBottom: 10, borderBottomColor: "black", borderWidth: 3, width }} />
 					<NativeButton onPress={() => {
 						this.RBSheet.close();
 					}} style={{ justifyContent: "center", backgroundColor: "darkred", width, marginBottom: 100 }}>
						<NativeText>Cancel</NativeText>
 					</NativeButton>
		        </RBSheet>
			</Fragment>
		)
	}
}
const styles = StyleSheet.create({
	buttonnn: {
		justifyContent: "center", 
		backgroundColor: "white", 
		width: width * 0.80, 
		marginBottom: 10, 
		borderColor: "black", 
		borderWidth: 2 
	},
  container: {
    flex: 1,
    backgroundColor: "#97DFFC"
  },
  item: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },

 /************ modals ************/
  popup: {
    backgroundColor: 'white',
    marginTop: 80,
    marginHorizontal: 20,
    borderRadius: 7,
  },
  popupOverlay: {
    backgroundColor: "#00000057",
    flex: 1,
    marginTop: 20
  },
  popupContent: {
    //alignItems: 'center',
    margin: 5,
    height:250,
  },
  popupHeader: {
    marginBottom: 45
  },
  popupButtons: {
    marginTop: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: "#eee",
    justifyContent:'center'
  },
  popupButton: {
    flex: 1,
    marginVertical: 16
  },
  btnClose:{
    height:20,
    backgroundColor:'#20b2aa',
    padding:20
  },
  modalInfo:{
    alignItems:'center',
    justifyContent:'center',
  }
}); 
const mapStateToProps = state => {
	return {
		username: state.auth.authenticated.username
	}
}

export default connect(mapStateToProps, {  })(UploadPicturesDating);
