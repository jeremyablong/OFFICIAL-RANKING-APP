import React, { Fragment, Component } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView
} from 'react-native';
import { Container, Header, Thumbnail, Left, Body, Right, Button as NativeButton, Title, Text as NativeText, ListItem, List, Footer, FooterTab, Badge } from 'native-base';
import { connect } from "react-redux";
import axios from "axios";

const { width, height } = Dimensions.get("window");

class InstagramFeedPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numColumns:3,
      userSelected: {

      },
      selected: null,
      pictures: [],
      modalVisible:false,
      data: [
        {id:1,  image:"https://bootdey.com/img/Content/avatar/avatar1.png"}, 
        {id:2,  image:"https://bootdey.com/img/Content/avatar/avatar2.png"}, 
        {id:3,  image:"https://bootdey.com/img/Content/avatar/avatar3.png"}, 
        {id:4,  image:"https://bootdey.com/img/Content/avatar/avatar4.png"}, 
        {id:5,  image:"https://bootdey.com/img/Content/avatar/avatar5.png"}, 
        {id:6,  image:"https://bootdey.com/img/Content/avatar/avatar6.png"}, 
        {id:7,  image:"https://bootdey.com/img/Content/avatar/avatar7.png"}, 
        {id:8,  image:"https://bootdey.com/img/Content/avatar/avatar1.png"}, 
        {id:9,  image:"https://bootdey.com/img/Content/avatar/avatar2.png"}, 
        {id:10, image:"https://bootdey.com/img/Content/avatar/avatar3.png"},
      ]
    };
  }

  clickEventListener = (item) => {
    this.setState({userSelected: item}, () =>{
      this.setModalVisible(true);
    });
  }

  setModalVisible(visible) {
    this.setState({
    	modalVisible: visible
    });
  }

  renderItem = ({item, index}) => {
  	console.log("iiiiii :", item);
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    var itemDimension = Dimensions.get('window').width / this.state.numColumns;
    return (
      <TouchableOpacity style={[styles.item, {height: itemDimension}]} onPress={() => {
      	
      	this.setState({
      		selected: item
      	}, () => {
      		this.clickEventListener(item);
      	})
      }}>
        <Image style={{height:itemDimension - 2, width:itemDimension - 2}} source={{uri: `https://s3.us-west-1.wasabisys.com/rating-people/${item.picture}`}}/>
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
  componentDidMount() {
    axios.post("http://recovery-social-media.ngrok.io/gather/profile/pictures/gallery", {
    	username: this.props.username
    }).then((res) => {
    	console.log(res.data);
    	this.setState({
    		pictures: res.data.pictures
    	})
    }).catch((err) => {
    	console.log(err);
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Header>
	      <Left>
	        <NativeButton onPress={() => {
	          this.props.navigation.navigate("public-wall");
	        }} hasText transparent>
	          <NativeText>Back</NativeText>
	        </NativeButton>
	      </Left>
	      <Body>
	        <Title>Gallery</Title>
	      </Body>
	      <Right>
	        <NativeButton hasText transparent>
	          <NativeText>help?</NativeText>
	        </NativeButton>
	      </Right>
	    </Header>
        <FlatList
          data={this.formatRow(this.state.pictures, this.state.numColumns)}
          keyExtractor= {(item) => {
            return item.id;
          }}
          renderItem={this.renderItem}
          numColumns={this.state.numColumns}/>

        <Modal
          animationType={'fade'}
          transparent={true}
          onRequestClose={() => this.setModalVisible(false)}
          visible={this.state.modalVisible}>

          <View style={styles.popupOverlay}>
            <View style={styles.popup}>
              <View style={styles.popupContent}>
                <ScrollView contentContainerStyle={styles.modalInfo}>
                  <Image style={{width:200, height:200}} source={{uri: this.state.selected !== null ? `https://s3.us-west-1.wasabisys.com/rating-people/${this.state.selected.picture}` : ""}}/>
                </ScrollView>
              </View>
              <View style={styles.popupButtons}>
                <NativeButton onPress={() => {this.setModalVisible(false) }} style={styles.btnClose}>
                  <NativeText style={styles.txtClose}>Close</NativeText>
                </NativeButton>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  txtClose: {
  	color: "white"
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
    height:50,
    width: width * 0.80,
    backgroundColor:'black',
    padding:20,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
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
 
export default connect(mapStateToProps, {  })(InstagramFeedPage);